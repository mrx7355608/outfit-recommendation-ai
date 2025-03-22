import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ChatMessageProps {
  message: IMessage;
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
          {message.diffusedImageUrl && (
            <div className="my-4">
              <Image
                src={message.diffusedImageUrl}
                alt="Uploaded image"
                className="rounded-lg object-contain"
                width={250}
                height={250}
              />
            </div>
          )}

          {message.googleLensResponse &&
            message.googleLensResponse.length > 0 && (
              <div>
                <ol>
                  {message.googleLensResponse.map((r) => {
                    return (
                      <li className="flex gap-3 items-center" key={r.source}>
                        <Link href={r.link}>
                          <span className="font-bold">{r.source}</span>
                        </Link>
                        {r.price && <span>{r.price.value}</span>}
                        {r.in_stock && (
                          <span>
                            {r.in_stock ? "In Stock" : "Out of Stock"}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
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
