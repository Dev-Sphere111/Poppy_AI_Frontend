"use client";

import type React from "react";
import { FlowComponent } from "./flow-component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChatContext } from "../ChatBotContext"; // ⬅️ Adjust path as needed

interface ModelComponentProps {
  id: string;
  position: { x: number; y: number };
  label: string;
  options: string[];
  value: string;
  inputValue: string;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onStartConnection: (id: string, type: "input" | "output") => void;
  onCompleteConnection: (id: string, type: "input" | "output") => void;
  onDelete: (id: string) => void;
  onUpdate: (data: { value?: string; inputValue?: string }) => void;
  onSubmit: (model: string, prompt: string) => void;
}

export function ModelComponent({
  id,
  position,
  label,
  options,
  value,
  inputValue,
  onDrag,
  onStartConnection,
  onCompleteConnection,
  onDelete,
  onUpdate,
  onSubmit,
}: ModelComponentProps) {
  const { setChatbotName, setApiKey } = useChatContext();

  const handleModelChange = (newValue: string) => {
    onUpdate({ value: newValue });
    setChatbotName(newValue); // ⬅️ set chatbotName from selected model
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrompt = e.target.value;
    onUpdate({ inputValue: newPrompt });

    // Example: extract apiKey if prompt includes a key (adjust logic as needed)
    if (newPrompt.startsWith("sk-") || newPrompt.includes("api_key:")) {
      setApiKey(newPrompt); // Replace with parsing logic if needed
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(value, inputValue);
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
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Select Model</label>
          <Select value={value} onValueChange={handleModelChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={`${option}-${index}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Api Key</label>
          <input
            type="password"
            value={inputValue}
            onChange={handlePromptChange}
            placeholder="Enter API key"
            className="w-full border px-3 py-2 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Send className="h-4 w-4 mr-2" />
          Submit
        </Button>
      </form>
    </FlowComponent>
  );
}
