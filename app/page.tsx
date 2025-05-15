"use client"

import { useState } from "react"
import { FlowEditor } from "./components/flow-editor"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
      value:
        type === "model" ? "GPT-4" : type === "selector" ? "Option 1" : undefined,
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
const [loading, setLoading] = useState(false);




  return (
    <main className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Tools</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center bg-black justify-start border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Component
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => addComponent("model")}>
              Model Component
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addComponent("selector")}>
              Selector Component
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addComponent("output")}>
              Output Component
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addComponent("chat")}>
              Chat Input Component
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      {/* Flow Editor Area */}
      <section className="flex-1 bg-slate-50">
        <FlowEditor
          components={components}
          setComponents={setComponents}
          connections={connections}
          setConnections={setConnections}
        />
      </section>
    </main>
  );
}
