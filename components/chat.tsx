"use client";

import type React from "react";

import { useState } from "react";
import { ChatMessage } from "@/components/chat-message";
import { InputsBox } from "./inputs-box";

type Message = {
  id: string;
  role: string;
  content: string;
  image?: string;
};

export function Chat({ region }: { region: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const updateAIMessage = (message: string, messageId: string | number) => {
    setMessages((prev) => {
      const copy = prev.filter((m) => m.id !== String(messageId));
      const msg = prev.filter((m) => m.id === String(messageId))[0];
      msg.content += "\n";
      msg.content += message;
      return [...copy, msg];
    });
  };

  return (
    <div className="flex flex-col h-[90vh] max-h-[90vh]">
      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* INPUT BOX */}
      <InputsBox
        messages={messages}
        setMessages={setMessages}
        updateAIMessage={updateAIMessage}
      />
    </div>
  );
}
