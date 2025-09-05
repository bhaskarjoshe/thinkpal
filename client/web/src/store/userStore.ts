import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserData } from "../api/user";

type User = {
  id: number;
  name: string;
  email: string;
  semester?: number;
  skills?: string[];
  interests?: string[];
  programming_languages?: string[];
  resume_data?: any;
  resume_analysis?: any;
};

type UserState = {
  userData: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (userData: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      loading: false,

      fetchUser: async () => {
        try {
          set({ loading: true });
          const data = await getUserData();
          set({ userData: data, loading: false });
        } catch (err) {
          console.error("Failed to fetch user:", err);
          set({ userData: null, loading: false });
        }
      },

      setUser: (userData) => set({ userData }),
      clearUser: () => set({ userData: null }),
    }),
    {
      name: "user-storage", 
    }
  )
);
