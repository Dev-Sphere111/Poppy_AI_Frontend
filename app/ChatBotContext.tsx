"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextProps {
  chatbotName: string;
  actionType: string;
  query: string;
  apiKey: string;
  output: string;
  setChatbotName: (value: string) => void;
  setActionType: (value: string) => void;
  setQuery: (value: string) => void;
  setApiKey: (value: string) => void;
  setOutput: (value: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatbotName, setChatbotName] = useState("openai");
  const [actionType, setActionType] = useState("internet search");
  const [query, setQuery] = useState("string");
  const [apiKey, setApiKey] = useState("your_api_key_here");
  const [output, setOutput] = useState("");

  return (
    <ChatContext.Provider
      value={{
        chatbotName,
        actionType,
        query,
        apiKey,
        output,
        setChatbotName,
        setActionType,
        setQuery,
        setApiKey,
        setOutput,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
