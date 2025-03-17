"use client";

import type React from "react";

import { useState } from "react";
import { SendIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat-message";
import { ThemeToggle } from "@/components/theme-toggle";
import { ImageUpload } from "@/components/image-upload";
import { GenderSelect } from "@/components/gender-select";
import { Spinner } from "./spinner";

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
  const [error, setError] = useState("");

  const urlToFile = async (imgUrl: string) => {
    const res = await fetch(imgUrl);
    const blob = await res.blob();
    const file = new File([blob], "outfit.png", { type: blob.type });
    return file;
  };

  // Generate outfit using flux-dev model api
  const generateOutfit = async () => {
    // Make request to route handler
    const prompt = `(${gender}:1.0)(outfit inspired by traditional fashion from Karachi, Pakistan:1.2), (designed for ${ocassion}:1.3), (high-quality textures:1.2), (natural pose:1.0), (realistic lighting:1.0), (full body view:1.1)`;
    const response = await fetch("/api/generate-outfits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const result = await response.json();
    const file = await urlToFile(result.imageURL);
    return file;
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
    return imageURL;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ocassion.trim()) {
      setError("Please enter an ocassion");
      return;
    }
    if (!gender) {
      setError("Please select a gender");
      return;
    }
    if (!userUploadedImage) {
      setError("Please upload your image");
      return;
    }

    const messageId = messages.length - 1;
    const newMessage = {
      id: String(messageId),
      content: "",
      image: "",
      role: "assistant",
    };

    setLoading(true);
    setError("");
    try {
      // Add the initial AI message
      newMessage.content = `Generating outfit for ${ocassion} ocassion`;
      setMessages((prev) => [...prev, newMessage]);

      // Generate outfit
      const outfitImage = await generateOutfit();
      if (!outfitImage) {
        updateMessage(
          "Oops! an error occurred while generating outfit, please try again",
          messageId,
        );
        return;
      }

      // Update the AI message to make it look like a streamed response
      updateMessage(
        "Outfit generated!\n\nApplying outfit on your image...",
        messageId,
      );

      // Diffuse the user image with the outfit
      const imageURL = await diffuse(outfitImage);
      if (!imageURL) {
        updateMessage(
          "There was an error while applying outfit, please try again",
          messageId,
        );
        return;
      }

      // Update the final message and add the image url
      updateMessage(
        "Operation completed!\nThis is how you will look like",
        messageId,
      );
      addImageInAiMessage(messageId, imageURL);

      // Display the message
      // const newMessage = {
      //   id: "1",
      //   image: imageURL,
      //   role: "assistant",
      //   content: "ab",
      // };
      // setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.log((err as Error).message);
    } finally {
      setLoading(false);
      setOcassion("");
      setTimeout(() => setError(""), 5000);
      setShowImageUpload(false);
    }
  };

  const updateMessage = (message: string, messageId: string | number) => {
    setMessages((prev) => {
      const copy = prev.filter((m) => m.id !== String(messageId));
      const msg = prev.filter((m) => m.id === String(messageId))[0];
      msg.content += "\n";
      msg.content += message;
      return [...copy, msg];
    });
  };

  const addImageInAiMessage = (messageId: number, image: string) => {
    setMessages((prev) => {
      prev.map((m) => {
        if (m.id === String(messageId)) {
          m.image = image;
        }
      });
      return prev;
    });
  };

  const handleImageUpload = (file: File) => {
    setUserUploadedImage(file);
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
          {/* ERROR MESSAGE */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
              className="absolute right-2 top-2 h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? <Spinner /> : <SendIcon className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
