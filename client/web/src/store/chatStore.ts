// store/chatStore.ts
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "../types/types";

type ChatStore = {
  chatId: string;
  resetChat: () => void;
  inputQuery: string;
  setInputQuery: (query: string) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chatId: uuidv4(),
  resetChat: () => set({ chatId: uuidv4(), messages: [] }),

  inputQuery: "",
  setInputQuery: (query: string) => set({ inputQuery: query }),

  messages: [
    {
      id: uuidv4(),
      role: "ai",
      content: JSON.stringify({
        component_type: "knowledge",
        content:
          "Hello! I am your AI Companion. Ask me anything to get started.",
      }),
    },
  ],

  setMessages: (messages: ChatMessage[]) => set({ messages }),

  addMessage: (message: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
