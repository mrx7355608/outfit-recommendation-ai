"use client";

import type React from "react";

import { useState } from "react";
import { ChatMessage } from "@/components/chat-message";
import { InputsBox } from "./inputs-box";
import { IMessage } from "@/lib/types";

export function Chat({ region }: { region: string }) {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const updateAIMessage = (message: IMessage, messageId: string | number) => {
    setMessages((prev) => {
      // const copy = prev.filter((m) => m.id !== String(messageId));
      return [...prev, message];
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
        region={region}
        messages={messages}
        setMessages={setMessages}
        updateAIMessage={updateAIMessage}
      />
    </div>
  );
}
