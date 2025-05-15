"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { FlowComponent } from "../components/flow-component"
import { ConnectionLine } from "../components/connection-line"
import { ModelComponent } from "../components/model-component"
import { SelectorComponent } from "../components/selector-component"
import { OutputComponent } from "../components/output-component"
import { ChatComponent } from "../components/chat-component"

type ComponentType = "model" | "selector" | "output" | "chat"

type Component = {
  id: string
  type: ComponentType
  position: { x: number; y: number }
  data: {
    label: string
    options?: string[]
    value?: string
    text?: string
    inputValue?: string
  }
}

type Connection = {
  id: string
  source: string
  target: string
}

type ConnectionPoint = {
  componentId: string
  type: "input" | "output"
}

interface FlowEditorProps {
  components: Component[]
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>
  connections: Connection[]
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>
}

export function FlowEditor({ components, setComponents, connections, setConnections }: FlowEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [activeConnection, setActiveConnection] = useState<{
    source: ConnectionPoint | null
    mousePosition: { x: number; y: number }
  }>({
    source: null,
    mousePosition: { x: 0, y: 0 },
  })

  // Canvas size state
  const [canvasSize, setCanvasSize] = useState({
    width: 3000,
    height: 3000,
  })

  // Update canvas size based on component positions
  useEffect(() => {
    if (components.length === 0) return

    // Find the rightmost and bottommost components
    let maxX = 0
    let maxY = 0

    components.forEach((component) => {
      // Get component width based on type
      let componentWidth = 250
      if (component.type === "output") componentWidth = 300
      if (component.type === "chat") componentWidth = 350

      const rightEdge = component.position.x + componentWidth + 100
      const bottomEdge = component.position.y + 200

      maxX = Math.max(maxX, rightEdge)
      maxY = Math.max(maxY, bottomEdge)
    })

    // Ensure canvas is always at least 3000x3000 or larger if needed
    setCanvasSize({
      width: Math.max(3000, maxX),
      height: Math.max(3000, maxY),
    })
  }, [components])

  // Handle mouse move for drawing active connection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeConnection.source && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const scrollLeft = containerRef.current.scrollLeft
        const scrollTop = containerRef.current.scrollTop

        setActiveConnection({
          ...activeConnection,
          mousePosition: {
            x: e.clientX - rect.left + scrollLeft,
            y: e.clientY - rect.top + scrollTop,
          },
        })
      }
    }

    if (activeConnection.source) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [activeConnection])

  // Handle component drag
  const handleDrag = (id: string, position: { x: number; y: number }) => {
    setComponents(components.map((component) => (component.id === id ? { ...component, position } : component)))

    // Auto-scroll when dragging near edges
    if (containerRef.current) {
      const container = containerRef.current
      const padding = 50

      // Check if component is near right edge
      if (position.x > container.scrollLeft + container.clientWidth - padding) {
        container.scrollLeft += 10
      }
      // Check if component is near left edge
      else if (position.x < container.scrollLeft + padding) {
        container.scrollLeft -= 10
      }

      // Check if component is near bottom edge
      if (position.y > container.scrollTop + container.clientHeight - padding) {
        container.scrollTop += 10
      }
      // Check if component is near top edge
      else if (position.y < container.scrollTop + padding) {
        container.scrollTop -= 10
      }
    }
  }

  // Start connection from a component
  const handleStartConnection = (componentId: string, type: "input" | "output") => {
    const component = components.find((c) => c.id === componentId)
    if (!component) return

    // Get component width based on type
    let componentWidth = 250
    if (component.type === "output") componentWidth = 300
    if (component.type === "chat") componentWidth = 350

    setActiveConnection({
      source: { componentId, type },
      mousePosition: {
        x: component.position.x + (type === "output" ? componentWidth : 0),
        y: component.position.y + 30,
      },
    })
  }

  // Complete connection to another component
  const handleCompleteConnection = (componentId: string, type: "input" | "output") => {
    if (!activeConnection.source) return

    // Don't connect to self
    if (activeConnection.source.componentId === componentId) {
      setActiveConnection({ source: null, mousePosition: { x: 0, y: 0 } })
      return
    }

    // Don't connect output to output or input to input
    if (activeConnection.source.type === type) {
      setActiveConnection({ source: null, mousePosition: { x: 0, y: 0 } })
      return
    }

    // Determine source and target based on connection direction
    let source: string, target: string

    if (activeConnection.source.type === "output") {
      source = activeConnection.source.componentId
      target = componentId
    } else {
      source = componentId
      target = activeConnection.source.componentId
    }

    // Check if connection already exists
    const connectionExists = connections.some((conn) => conn.source === source && conn.target === target)

    if (!connectionExists) {
      const newConnection = {
        id: `connection-${Date.now()}`,
        source,
        target,
      }
      setConnections([...connections, newConnection])
    }

    setActiveConnection({ source: null, mousePosition: { x: 0, y: 0 } })
  }

  // Update component data
  const handleUpdateComponent = (id: string, newData: Partial<Component["data"]>) => {
    setComponents(
      components.map((component) =>
        component.id === id ? { ...component, data: { ...component.data, ...newData } } : component,
      ),
    )
  }

  // Handle submit from model component
  const handleModelSubmit = (id: string, model: string, prompt: string) => {
    console.log(`Model ${model} submitted with prompt: ${prompt}`)

    // Find connected output components
    const connectedOutputs = connections
      .filter((conn) => conn.source === id)
      .map((conn) => components.find((comp) => comp.id === conn.target))
      .filter((comp) => comp && comp.type === "output") as Component[]

    // Update connected output components
    connectedOutputs.forEach((output) => {
      handleUpdateComponent(output.id, {
        text: `Response from ${model} for prompt: "${prompt}"\n\nThis is a simulated response. In a real application, this would be the AI model's response.`,
      })
    })
  }

  // Handle chat input submission
  const handleChatSubmit = (id: string, question: string) => {
    console.log(`Chat question submitted: ${question}`)

    // Find connected output components
    const connectedOutputs = connections
      .filter((conn) => conn.source === id)
      .map((conn) => components.find((comp) => comp.id === conn.target))
      .filter((comp) => comp && comp.type === "output") as Component[]

    // Update connected output components
    connectedOutputs.forEach((output) => {
      const currentText = output.data.text || ""
      handleUpdateComponent(output.id, {
        text: `${currentText}\n\nQ: ${question}\nA: This is a simulated response to your question.`,
      })
    })
  }

  // Cancel connection on background click
  const handleCancel = () => {
    if (activeConnection.source) {
      setActiveConnection({ source: null, mousePosition: { x: 0, y: 0 } })
    }
  }

  // Delete a component and its connections
  const handleDelete = (id: string) => {
    setComponents(components.filter((component) => component.id !== id))
    setConnections(connections.filter((connection) => connection.source !== id && connection.target !== id))
  }

  // Delete a connection
  const handleDeleteConnection = (id: string) => {
    setConnections(connections.filter((connection) => connection.id !== id))
  }

  // Render the appropriate component based on type
  const renderComponent = (component: Component) => {
    const commonProps = {
      id: component.id,
      position: component.position,
      onDrag: handleDrag,
      onStartConnection: handleStartConnection,
      onCompleteConnection: handleCompleteConnection,
      onDelete: handleDelete,
    }

    switch (component.type) {
      case "model":
        return (
          <ModelComponent
            {...commonProps}
            label={component.data.label}
            options={component.data.options || []}
            value={component.data.value || ""}
            inputValue={component.data.inputValue || ""}
            onUpdate={(newData) => handleUpdateComponent(component.id, newData)}
            onSubmit={(model, prompt) => handleModelSubmit(component.id, model, prompt)}
          />
        )
      case "selector":
        return (
          <SelectorComponent
            {...commonProps}
            label={component.data.label}
            options={["internet search", "summarize", "email"]} // example options
            value={component.data.value || ""}
            onUpdate={(newData) => handleUpdateComponent(component.id, newData)}
          />
        );
      
      case "chat":
        return (
          <ChatComponent
            {...commonProps}
            label={component.data.label}
            inputValue={component.data.inputValue || ""}
            onUpdate={(newData) => handleUpdateComponent(component.id, newData)}
            onSubmit={(question) => handleChatSubmit(component.id, question)}
          />
        );
      case "output":
        return <OutputComponent {...commonProps} label={component.data.label} text={component.data.text || ""} />
      default:
        return <FlowComponent {...commonProps} label={component.data.label} />
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-auto"
      onClick={handleCancel}
    >
      <div
        ref={canvasRef}
        className="relative bg-grid-pattern"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
          backgroundPosition: "0 0",
        }}
      >
        {components.map((component) => (
          <div key={component.id}>{renderComponent(component)}</div>
        ))}

        {/* Render existing connections */}
        {connections.map((connection) => {
          const source = components.find((c) => c.id === connection.source);
          const target = components.find((c) => c.id === connection.target);

          if (!source || !target) return null;

          // Get component width based on type
          let sourceWidth = 250;
          if (source.type === "output") sourceWidth = 300;
          if (source.type === "chat") sourceWidth = 350;

          const startPoint = {
            x: source.position.x + sourceWidth,
            y: source.position.y + 30,
          };

          const endPoint = {
            x: target.position.x,
            y: target.position.y + 30,
          };

          return (
            <ConnectionLine
              key={connection.id}
              connectionId={connection.id}
              startPoint={startPoint}
              endPoint={endPoint}
              onDelete={handleDeleteConnection}
            />
          );
        })}

        {/* Render active connection being drawn */}
        {activeConnection.source && (
          <ConnectionLine
            startPoint={
              activeConnection.source.type === "output"
                ? {
                    x: (() => {
                      const comp = components.find(
                        (c) => c.id === activeConnection.source?.componentId
                      );
                      if (!comp) return 0;
                      let width = 250;
                      if (comp.type === "output") width = 300;
                      if (comp.type === "chat") width = 350;
                      return comp.position.x + width;
                    })(),
                    y:
                      components.find(
                        (c) => c.id === activeConnection.source?.componentId
                      )?.position.y || 0 + 30,
                  }
                : activeConnection.mousePosition
            }
            endPoint={
              activeConnection.source.type === "input"
                ? {
                    x:
                      components.find(
                        (c) => c.id === activeConnection.source?.componentId
                      )?.position.x || 0,
                    y:
                      components.find(
                        (c) => c.id === activeConnection.source?.componentId
                      )?.position.y || 0 + 30,
                  }
                : activeConnection.mousePosition
            }
            isActive
          />
        )}
      </div>
    </div>
  );
}
