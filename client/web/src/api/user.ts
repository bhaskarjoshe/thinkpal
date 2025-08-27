import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_SERVER_BASE_URL;

export const getUserData = async () => {
  const token = useAuthStore.getState().token

  try {
    const response = await axios.get(`${API_BASE}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(
      "Failed to get user data:",
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to get user data"
    );
    throw new Error(
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to get user data"
    );
  }
};
