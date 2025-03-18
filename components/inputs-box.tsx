"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Spinner } from "./spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, UploadIcon } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { GenderSelect } from "@/components/gender-select";
import { diffuse, generateOutfit } from "@/app/api-calls";

interface IMessage {
  id: string;
  role: string;
  content: string;
  image?: string;
}

type Props = {
  messages: IMessage[];
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
  updateAIMessage: (msg: string, msgId: string | number) => void;
};

export const InputsBox = ({
  messages,
  setMessages,
  updateAIMessage,
}: Props) => {
  const [error, setError] = useState("");
  const [ocassion, setOcassion] = useState("");
  const [gender, setGender] = useState<string | null>("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [userUploadedImage, setUserUploadedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file: File) => {
    setUserUploadedImage(file);
    setShowImageUpload(false);
  };

  const validInputs = () => {
    if (!ocassion.trim()) {
      setError("Please enter an ocassion");
      return false;
    }
    if (!gender) {
      setError("Please select a gender");
      return false;
    }
    if (!userUploadedImage) {
      setError("Please upload your image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!validInputs()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Add the initial AI message
      const messageId = messages.length - 1;
      const newMessage = {
        id: String(messageId),
        content: "",
        image: "",
        role: "assistant",
      };
      newMessage.content = `Generating outfit for ${ocassion}`;
      setMessages((prev) => [...prev, newMessage]);

      // Generate outfit
      const outfitImage = await generateOutfit(gender!, ocassion);
      updateAIMessage(
        "Outfit generated!\n\nApplying outfit on your image...",
        messageId,
      );

      // Diffuse the user image with the outfit
      const imageURL = await diffuse(outfitImage, userUploadedImage);
      updateAIMessage(
        "Operation completed!\nThis is how you will look like",
        messageId,
      );

      // Add image in the AI message
      setMessages((prev) => {
        prev.map((m) => {
          if (m.id === String(messageId)) {
            m.image = imageURL;
          }
        });
        return prev;
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setOcassion("");
      setTimeout(() => setError(""), 5000);
      setShowImageUpload(false);
    }
  };

  return (
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
  );
};
