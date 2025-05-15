"use client"

import { useState } from "react"
import { FlowEditor } from "../components/flow-editor"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Home() {
  const [components, setComponents] = useState<
    Array<{
      id: string
      type: "model" | "selector" | "output" | "chat"
      position: { x: number; y: number }
      data: {
        label: string
        options?: string[]
        value?: string
        text?: string
        inputValue?: string
      }
    }>
  >([])

  const [connections, setConnections] = useState<
    Array<{
      id: string
      source: string
      target: string
    }>
  >([])

  const addComponent = (type: "model" | "selector" | "output" | "chat") => {
    const id = `component-${Date.now()}`

    const componentData = {
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      options:
        type === "model"
          ? ["GPT-4", "GPT-3.5", "Claude", "Llama"]
          : type === "selector"
            ? ["Option 1", "Option 2", "Option 3"]
            : undefined,
      value: type === "model" ? "GPT-4" : type === "selector" ? "Option 1" : undefined,
      text: type === "output" ? "Output will appear here..." : undefined,
      inputValue: "",
    }

    const newComponent = {
      id,
      type,
      position: {
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
      },
      data: componentData,
    }

    setComponents([...components, newComponent])
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Component Flow Editor</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Component
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addComponent("model")}>Model Component</DropdownMenuItem>
              <DropdownMenuItem onClick={() => addComponent("selector")}>Selector Component</DropdownMenuItem>
              <DropdownMenuItem onClick={() => addComponent("output")}>Output Component</DropdownMenuItem>
              <DropdownMenuItem onClick={() => addComponent("chat")}>Chat Input Component</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="border rounded-lg bg-slate-50 w-full h-[calc(100vh-150px)]">
          <FlowEditor
            components={components}
            setComponents={setComponents}
            connections={connections}
            setConnections={setConnections}
          />
        </div>
      </div>
    </main>
  )
}
