import { create } from "zustand";
import { persist } from "zustand/middleware";

type JWTPayload = {
  sub?: string;
  exp?: number;
  [key: string]: unknown;
};

type AuthState = {
  userId: string | null;
  token: string | null;
  isLoggedIn: boolean;

  login: (token: string) => void;
  logout: () => void;
  getUserId: () => string | null;
  getToken: () => string | null;
};

function decodeJWT(token: string): JWTPayload | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as JWTPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000); 
  return decoded.exp < now;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      isLoggedIn: false,

      login: (token: string) => {
        if (isTokenExpired(token)) {
          set({ token: null, userId: null, isLoggedIn: false });
        } else {
          const userId = decodeJWT(token)?.sub ?? null;
          set({ token, userId, isLoggedIn: true });
        }
      },

      logout: () => set({ token: null, userId: null, isLoggedIn: false }),

      getUserId: () => get().userId,
      getToken: () => get().token,
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        const token = state?.token;
        if (token && isTokenExpired(token)) {
          state?.logout();
        }
      },
    }
  )
);
