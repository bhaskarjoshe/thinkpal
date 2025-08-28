import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_SERVER_BASE_URL;

export const chatApi = async (payload: {
  chat_id: string | null;
  chat_mode: string;
  query: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE}/chat`, payload, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(
      "Chat failed:",
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Chat failed"
    );
    throw new Error(
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Chat failed"
    );
  }
};
