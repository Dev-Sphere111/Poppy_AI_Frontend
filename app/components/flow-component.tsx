"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft } from "lucide-react"

interface FlowComponentProps {
  id: string
  position: { x: number; y: number }
  label: string
  onDrag: (id: string, position: { x: number; y: number }) => void
  onStartConnection: (id: string, type: "input" | "output") => void
  onCompleteConnection: (id: string, type: "input" | "output") => void
  onDelete: (id: string) => void
  width?: number
  children?: React.ReactNode
}

export function FlowComponent({
  id,
  position,
  label,
  onDrag,
  onStartConnection,
  onCompleteConnection,
  onDelete,
  width = 250,
  children,
}: FlowComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const componentRef = useRef<HTMLDivElement>(null)

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on connection points or interactive elements
    if (
      (e.target as HTMLElement).classList.contains("connection-point") ||
      (e.target as HTMLElement).tagName === "BUTTON" ||
      (e.target as HTMLElement).tagName === "INPUT" ||
      (e.target as HTMLElement).tagName === "SELECT" ||
      (e.target as HTMLElement).tagName === "TEXTAREA"
    ) {
      return
    }

    e.stopPropagation()
    setIsDragging(true)

    if (componentRef.current) {
      const rect = componentRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && componentRef.current) {
        // Get the parent container (the canvas)
        const parentElement = componentRef.current.parentElement
        if (!parentElement) return

        // Calculate new position based on mouse position and scroll offset
        const parentRect = parentElement.getBoundingClientRect()
        const scrollLeft = parentElement.parentElement?.scrollLeft || 0
        const scrollTop = parentElement.parentElement?.scrollTop || 0

        const newX = e.clientX - parentRect.left - dragOffset.x + scrollLeft
        const newY = e.clientY - parentRect.top - dragOffset.y + scrollTop

        // Ensure position is not negative
        const boundedX = Math.max(0, newX)
        const boundedY = Math.max(0, newY)

        onDrag(id, { x: boundedX, y: boundedY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, id, onDrag, width])

  // Handle connection point interactions
  const handleConnectionPointMouseDown = (type: "input" | "output", e: React.MouseEvent) => {
    e.stopPropagation()
    onStartConnection(id, type)
  }

  const handleConnectionPointMouseUp = (type: "input" | "output", e: React.MouseEvent) => {
    e.stopPropagation()
    onCompleteConnection(id, type)
  }

  // Handle delete
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <div
      ref={componentRef}
      className={`absolute select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isDragging ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Input connection point */}
      <div
        className="connection-point absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-[30px] cursor-crosshair hover:scale-125 transition-transform z-20"
        onMouseDown={(e) => handleConnectionPointMouseDown("input", e)}
        onMouseUp={(e) => handleConnectionPointMouseUp("input", e)}
      >
        <ArrowRight className="h-4 w-4 text-white" />
      </div>

      <Card className="shadow-md" style={{ width: `${width}px` }}>
        <CardHeader className="p-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm truncate">{label}</CardTitle>
          <button
            onClick={handleDelete}
            className="h-5 w-5 rounded-full hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="h-3 w-3" />
          </button>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {children || <div className="text-xs text-muted-foreground">Drag to move</div>}
        </CardContent>
      </Card>

      {/* Output connection point */}
      <div
        className="connection-point absolute w-4 h-4 bg-green-500 rounded-full -right-2 top-[30px] cursor-crosshair hover:scale-125 transition-transform z-20"
        onMouseDown={(e) => handleConnectionPointMouseDown("output", e)}
        onMouseUp={(e) => handleConnectionPointMouseUp("output", e)}
      >
        <ArrowLeft className="h-4 w-4 text-white" />
      </div>
    </div>
  )
}
