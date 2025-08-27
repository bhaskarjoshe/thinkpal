import { create } from "zustand";

type UIState = {
  showLoginModal: boolean;
  showSignupModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  showLoginModal: false,
  showSignupModal: false,

  openLoginModal: () => set({ showLoginModal: true }),
  closeLoginModal: () => set({ showLoginModal: false }),

  openSignupModal: () => set({ showSignupModal: true }),
  closeSignupModal: () => set({ showSignupModal: false }),
}));
