import type { ChatMessage } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { chatApi } from "../api/chat";

export const handleClick = async (chatId: string, addMessage: (message: ChatMessage) => void, query: string) => {
    try {
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: query,
      };
      addMessage(userMessage);

      const response = await chatApi({
        chat_id: chatId,
        chat_mode: "normal",
        query: query,
      });

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "ai",
        ui_components:
          response.ui_components && response.ui_components.length > 0
            ? response.ui_components
            : [
                {
                  component_type: "knowledge",
                  title: "No Response",
                  content: "Sorry, no response.",
                  features: [],
                },
              ],
      };
      addMessage(aiMessage);
    } catch (error) {
      console.error(error);
    }
  };