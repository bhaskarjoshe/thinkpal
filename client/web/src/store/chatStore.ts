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
  resetStore: () => void;
};

const CHAT_STORAGE_KEY = "chat_store";

export const useChatStore = create<ChatStore>((set, get) => {
  const persisted = typeof window !== "undefined" ? localStorage.getItem(CHAT_STORAGE_KEY) : null;
  const initialState = persisted ? JSON.parse(persisted) : {};

  const persist = () => {
    if (typeof window !== "undefined") {
      const state = get();
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify({
          chatId: state.chatId,
          messages: state.messages,
        })
      );
    }
  };

  return {
    chatId: initialState.chatId || null,
    inputQuery: "",
    messages: initialState.messages || [],
    loading: false,

    setInputQuery: (query: string) => set({ inputQuery: query }),
    setMessages: (messages: ChatMessage[]) => {
      set({ messages });
      persist();
    },
    setLoading: (loading: boolean) => set({ loading }),
    addMessage: (message: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, message] }));
      persist();
    },

    startNewChat: async () => {
      set({ loading: true });
      try {
        const data = await newChatApi();
        const initialMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "ai",
          ui_components:
            data.ui_components && data.ui_components.length > 0
              ? data.ui_components
              : [
                  {
                    component_type: "knowledge",
                    title: "No Response",
                    content: "Sorry, no response.",
                    features: [],
                  },
                ],
        };
        set({ chatId: data.chat_id, messages: [initialMessage] });
        persist();
      } finally {
        set({ loading: false });
      }
    },

    resetStore: () => {
      set({
        chatId: null,
        inputQuery: "",
        messages: [],
        loading: false,
      });
      if (typeof window !== "undefined") localStorage.removeItem(CHAT_STORAGE_KEY);
    },
  };
});
