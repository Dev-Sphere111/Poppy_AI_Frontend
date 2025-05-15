"use client"

import { useChatContext } from "../ChatBotContext"
import { FlowComponent } from "./flow-component"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OutputComponentProps {
  id: string
  position: { x: number; y: number }
  label: string
  text: string
  onDrag: (id: string, position: { x: number; y: number }) => void
  onStartConnection: (id: string, type: "input" | "output") => void
  onCompleteConnection: (id: string, type: "input" | "output") => void
  onDelete: (id: string) => void
}

export function OutputComponent({
  id,
  position,
  label,
  text,
  onDrag,
  onStartConnection,
  onCompleteConnection,
  onDelete,
}: OutputComponentProps) {
  const { output } = useChatContext();
  return (
    <FlowComponent
      id={id}
      position={position}
      label={label}
      onDrag={onDrag}
      onStartConnection={onStartConnection}
      onCompleteConnection={onCompleteConnection}
      onDelete={onDelete}
      width={300}
    >
      <div className="space-y-1">
        <label className="text-xs font-medium">Output</label>
        <ScrollArea className="h-[150px] w-full border rounded-md bg-slate-50 p-2">
          <pre className="text-xs  text-black whitespace-pre-wrap">
            {output || "....."}
          </pre>
        </ScrollArea>
      </div>
    </FlowComponent>
  );
}
