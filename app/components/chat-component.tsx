"use client";

import type React from "react";
import { useState } from "react";
import { FlowComponent } from "../components/flow-component";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChatContext } from "../ChatBotContext";

interface ChatComponentProps {
  id: string;
  position: { x: number; y: number };
  label: string;
  inputValue: string;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onStartConnection: (id: string, type: "input" | "output") => void;
  onCompleteConnection: (id: string, type: "input" | "output") => void;
  onDelete: (id: string) => void;
  onUpdate: (data: { inputValue?: string }) => void;
  onSubmit: (question: string) => void;
}

export function ChatComponent({
  id,
  position,
  label,
  inputValue,
  onDrag,
  onStartConnection,
  onCompleteConnection,
  onDelete,
  onUpdate,
  onSubmit,
}: ChatComponentProps) {
  const [loading, setLoading] = useState(false);

const { chatbotName, actionType, query, apiKey, setQuery, setOutput } =
  useChatContext();
console.log("submit")
console.log(chatbotName, actionType, query, apiKey, setQuery);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputValue.trim()) {
      setQuery(inputValue); // ✅ set context value
      onSubmit(inputValue); // optional: trigger parent handler
      onUpdate({ inputValue: "" }); // clear local state
    }
  };

  const handleClick = async () => {
    console.log("handleClick");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbot_name: chatbotName,
          action_type: actionType,
          query, // ✅ use dynamic query from context
          api_key: apiKey, // ✅ use dynamic api key from context
        }),
      });

      const result = await response.json();
       setOutput( JSON.stringify(result.response));
      console.log("Response:", result);
      alert("Component added successfully!");
    } catch (error) {
      console.error("Error adding component:", error);
      alert("Failed to add component.");
    } finally {
      setLoading(false);
    }
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
      width={350}
    >
      <div className="space-y-1">
        <label className="text-xs font-medium">Chat Input</label>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => {
              onUpdate({ inputValue: e.target.value });
              setQuery(e.target.value); // ✅ update context on change
            }}
            placeholder="Type your quxestion here..."
            className="flex-grow"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            type="submit"
            size="sm"
            onClick={(e) => handleClick()}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </FlowComponent>
  );
}
