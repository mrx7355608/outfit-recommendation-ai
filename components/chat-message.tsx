import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import Image from "next/image";

type Message = {
  id: string;
  role: string;
  content: string;
  image?: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-6 w-full", isUser && "justify-end")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex w-full flex-col", isUser && "items-end")}>
        <div className="rounded-lg px-6 py-5 w-full bg-muted">
          {message.content && (
            <p className="whitespace-pre-line">{message.content}</p>
          )}
          {message.image && (
            <div className="my-4">
              <Image
                src={message.image}
                alt="Uploaded image"
                className="rounded-lg object-contain"
                width={200}
                height={200}
              />
            </div>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function RenderMessageWithCode({ content }: { content: string }) {
  // This is a simplified parser for code blocks
  // In a real app, you'd want to use a proper markdown parser
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        return part && <p key={index}>{part}</p>;
      })}
    </div>
  );
}
