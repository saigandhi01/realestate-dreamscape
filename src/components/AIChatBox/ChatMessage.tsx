
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  timestamp: Date;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex w-full gap-2 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 mt-0.5">
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg" alt="AI" />
            <AvatarFallback className="bg-secondary">AI</AvatarFallback>
          </>
        )}
      </Avatar>
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[75%] text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
        )}
      >
        <div>{message}</div>
        <div className={cn("text-xs mt-1 opacity-70 text-right", isUser ? "" : "")}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
