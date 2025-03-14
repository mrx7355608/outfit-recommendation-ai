"use client";

import type React from "react";

import { useState } from "react";
import { SendIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat-message";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ImageUpload } from "@/components/image-upload";
import { GenderSelect } from "@/components/gender-select";

type Message = {
  id: string;
  role: string;
  content: string;
  image?: string;
};

export function Chat({ region }: { region: string }) {
  const [ocassion, setOcassion] = useState("");
  const [gender, setGender] = useState<string | null>("");
  const [userUploadedImage, setUserUploadedImage] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const urlToFile = async (imgUrl: string) => {
    const res = await fetch(imgUrl);
    const blob = await res.blob();
    const file = new File([blob], "outfit.png", { type: blob.type });
    return file;
  };

  // Generate outfit using flux-dev model api
  const generateOutfit = async () => {
    try {
      const prompt = `(${gender}:1.0)(outfit inspired by fashion from ${region}:1.2), (designed for ${ocassion}:1.3), (season-appropriate fabrics and colors:1.1), (high-quality textures:1.2), (natural pose:1.0), (realistic lighting:1.0), (full body view:1.1), (on location background relevant to ${region}:1.0)`;
      const response = await fetch("/api/generate-outfits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      console.log({ genResult: result });
      const file = await urlToFile(result.imageURL);
      console.log(file);
      return file;
    } catch (err) {
      console.error((err as Error).message);
      return null;
    }
  };

  // Apply outfit on the user image using stable-diffusion model api
  const diffuse = async (outfit: File) => {
    if (!outfit || !userUploadedImage) {
      return;
    }
    const formData = new FormData();
    formData.append("avatar_image", userUploadedImage);
    formData.append("clothing_image", outfit);
    formData.append(
      "background_prompt",
      `(on background relevant to ${region})`,
    );

    // FIXME: Remove the rapid api keys!!!
    const url = "https://try-on-diffusion.p.rapidapi.com/try-on-file";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY!,
        "x-rapidapi-host": process.env.NEXT_PUBLIC_RAPID_API_HOST!,
      },
      body: formData,
    };
    const response = await fetch(url, options);
    const imageURL = URL.createObjectURL(await response.blob());

    const newMessage = {
      id: "1",
      image: imageURL,
      role: "assistant",
      content: "ab",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!ocassion.trim() || !gender) return;

    // Generate outfit
    const outfitImage = await generateOutfit();
    if (outfitImage) {
      await diffuse(outfitImage);
    }

    setLoading(false);

    setOcassion("");
    setShowImageUpload(false);
  };

  const handleImageUpload = (file: File) => {
    setUserUploadedImage(file);
    setOcassion("");
    setShowImageUpload(false);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Outfitss</h1>
        <ThemeToggle />
      </header>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
          {/* IMAGE UPLOAD UI */}
          {showImageUpload && (
            <ImageUpload
              userUploadedImage={userUploadedImage}
              onImageUpload={handleImageUpload}
              className="mb-4"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* UPLOAD BUTTON */}
            <Button
              type="button"
              variant={showImageUpload ? "default" : "outline"}
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="w-full flex items-center justify-center gap-2"
            >
              <UploadIcon className="h-4 w-4" />
              {showImageUpload
                ? "Hide Upload"
                : userUploadedImage
                  ? userUploadedImage.name
                  : "Upload your image"}
            </Button>
            {/* GENDER BUTTON */}
            <div>
              <GenderSelect onSelect={(g) => setGender(g)} />
            </div>
          </div>

          {/* PROMPT TEXTAREA */}
          <div className="relative">
            <Textarea
              value={ocassion}
              onChange={(e) => setOcassion(e.target.value)}
              placeholder="Enter your ocassion like Wedding, Farewell party, etc."
              className="min-h-[60px] w-full resize-none pr-16 rounded-lg border-muted"
            />
            <Button
              type="submit"
              size="icon"
              className={cn(
                "absolute right-2 top-2 h-8 w-12 disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              disabled={!ocassion.trim() && !showImageUpload && !gender}
            >
              {/* <SendIcon className="h-4 w-4" /> */}
              <span className="text-sm">
                {loading ? "Processsing..." : "Send"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
