"use client";

import { useChatContext } from "../ChatBotContext";
import { FlowComponent } from "./flow-component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectorComponentProps {
  id: string;
  position: { x: number; y: number };
  label: string;
  options: string[];
  value: string;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onStartConnection: (id: string, type: "input" | "output") => void;
  onCompleteConnection: (id: string, type: "input" | "output") => void;
  onDelete: (id: string) => void;
  onUpdate: (data: { value?: string }) => void;
}

export function SelectorComponent({
  id,
  position,
  label,
  options,
  value,
  onDrag,
  onStartConnection,
  onCompleteConnection,
  onDelete,
  onUpdate,
}: SelectorComponentProps) {
  const { setActionType } = useChatContext();

  const handleChange = (newValue: string) => {
    onUpdate({ value: newValue }); // optional: keep if needed by parent
    setActionType(newValue); // updates global context
  };

  return (
    <FlowComponent
      id={id}
      position={position}
      label={label}
      onDrag={onDrag}
      onStartConnection={onStartConnection}
      onCompleteConnection={onCompleteConnection}
      onDelete={onDelete}
    >
      <div className="space-y-1">
        <label className="text-xs font-medium">Select Option</label>
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FlowComponent>
  );
}
