import { create } from "zustand";
import type { ChatMessage } from "../types/types";
import { newChatApi } from "../api/chat";

type ChatStore = {
  chatId: string | null;
  inputQuery: string;
  messages: ChatMessage[];
  loading: boolean;

  setInputQuery: (query: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  startNewChat: () => Promise<void>;
};

export const useChatStore = create<ChatStore>((set) => ({
  chatId: null,
  inputQuery: "",
  messages: [],
  loading: false,

  setInputQuery: (query: string) => set({ inputQuery: query }),
  setMessages: (messages: ChatMessage[]) => set({ messages }),
  setLoading: (loading: boolean) => set({ loading }),
  addMessage: (message: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),

  startNewChat: async () => {
    set({ loading: true });
    try {
      const data = await newChatApi();
      set({
        chatId: data.chat_id,
        messages: [
          {
            id: crypto.randomUUID(),
            role: "ai",
            content: JSON.stringify(data.ui_component),
          },
        ],
      });
    } finally {
      set({ loading: false });
    }
  },
}));
