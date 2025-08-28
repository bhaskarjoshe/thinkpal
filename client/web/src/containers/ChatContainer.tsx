// ChatContainer.tsx
import { useRef, useEffect } from "react";
import type { ChatMessage, UIComponent } from "../types/types";
import { AIComponentRenderer } from "../components/AIComponentRenderer";
import { CardSkeleton } from "../ui/CardSkelton";

interface ChatContainerProps {
  messages: ChatMessage[];
  loading: boolean;
}

const ChatContainer = ({ messages, loading }: ChatContainerProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 gap-3 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[70%] p-3 rounded-xl ${
            msg.role === "user"
              ? "bg-gray-100 text-gray-800 self-end"
              : "bg-gray-100 text-gray-800 self-start"
          }`}
        >
          {msg.role === "ai" ? (
            <AIComponentRenderer
              component={JSON.parse(msg.content) as UIComponent}
            />
          ) : (
            msg.content
          )}
        </div>
      ))}
      {loading && <CardSkeleton />}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatContainer;
