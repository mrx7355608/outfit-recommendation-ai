"use client";

import type React from "react";

import { useState } from "react";
import { SendIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat-message";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ImageUpload } from "@/components/image-upload";
import { GenderSelect } from "@/components/gender-select";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
};

export function Chat({ region }: { region: string }) {
  const [ocassion, setOcassion] = useState("");
  const [gender, setGender] = useState<string | null>("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm v0, Vercel's AI-powered assistant. How can I help you today?",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ocassion.trim() || !gender) return;

    const prompt = `(${gender}:1.0)(outfit inspired by traditional fashion from ${region}:1.2), (designed for ${ocassion}:1.3), (season-appropriate fabrics and colors:1.1), (modern and stylish design:1.0), (high-quality textures:1.2), (natural pose:1.0), (realistic lighting:1.0), (full body view:1.1), (on location background relevant to ${region}:1.0)`;
    const response = await fetch("/api/generate-outfits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const result = await response.json();
    console.log(result);
    setOcassion("");
    setShowImageUpload(false);
  };

  const handleImageUpload = (file: File) => {
    console.log(file);
    setOcassion("");
    setShowImageUpload(false);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">v0 Interface</h1>
        <ThemeToggle />
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
          {showImageUpload && (
            <ImageUpload onImageUpload={handleImageUpload} className="mb-4" />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Button
              type="button"
              variant={showImageUpload ? "default" : "outline"}
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {showImageUpload ? "Hide Upload" : "Upload your image"}
            </Button>
            <div>
              <GenderSelect onSelect={(g) => setGender(g)} />
            </div>
          </div>

          {/* PROMPT TEXTAREA */}
          <div className="relative">
            <Textarea
              value={ocassion}
              onChange={(e) => setOcassion(e.target.value)}
              placeholder="Message v0..."
              className="min-h-[60px] w-full resize-none pr-16 rounded-lg border-muted"
            />
            <Button
              type="submit"
              size="icon"
              className={cn(
                "absolute right-2 top-2 h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              disabled={!ocassion.trim() && !showImageUpload}
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
