import { create } from "zustand";

type UIState = {
  showLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  showLoginModal: false,
  openLoginModal: () => set({ showLoginModal: true }),
  closeLoginModal: () => set({ showLoginModal: false }),
}));
