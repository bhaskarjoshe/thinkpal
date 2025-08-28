import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { chatApi } from "../api/chat";
import type { ChatMessage } from "../types/types";

export const useChatHandler = (chatId: string, chatMode: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: query,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatApi({
        chat_id: chatId,
        chat_mode: chatMode,
        query,
      });
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "ai",
        content: JSON.stringify(response.ui_component || { component_type: "knowledge", content: "Sorry, no response." }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, setMessages, loading, handleClick };
};
