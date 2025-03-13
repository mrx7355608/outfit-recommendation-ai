import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Simple regex to detect code blocks (this is a simplified version)
  const hasCodeBlock = message.content.includes("```");

  return (
    <div className={cn("flex gap-3 mb-6", isUser && "justify-end")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col max-w-[80%]", isUser && "items-end")}>
        <div className="text-sm font-medium mb-1">{isUser ? "You" : "v0"}</div>
        <div
          className={cn(
            "rounded-lg px-4 py-2.5 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          {message.image && (
            <div className="mb-2">
              <img
                src={message.image || "/placeholder.svg"}
                alt="Uploaded image"
                className="max-h-64 rounded-md object-contain"
              />
            </div>
          )}
          {hasCodeBlock ? (
            <RenderMessageWithCode content={message.content} />
          ) : (
            <p>{message.content}</p>
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
