import { useRef, useEffect } from "react";
import type { ChatMessage } from "../types/types";
import { AIComponentRenderer } from "../components/AIComponentRenderer";
import { CardSkeleton } from "../ui/CardSkelton";

interface ChatContainerProps {
  messages: ChatMessage[];
  loading: boolean;
  setInputQuery: (query: string) => void;
}

const ChatContainer = ({
  messages,
  loading,
  setInputQuery,
}: ChatContainerProps) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  return (
    <div className="flex flex-col flex-1 gap-3 p-4 overflow-y-auto">
      {(messages ?? []).map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[80%] p-3 rounded-xl ${
            msg.role === "user"
              ? "bg-gray-100 text-gray-800 self-end"
              : "bg-gray-100 text-gray-800 self-start"
          }`}
        >
          {msg.role === "ai" && msg.ui_components ? (
            <AIComponentRenderer
              setInputQuery={setInputQuery}
              components={msg.ui_components}
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
