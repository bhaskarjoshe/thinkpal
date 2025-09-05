import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

const API_BASE = import.meta.env.VITE_SERVER_BASE_URL;

export const uploadResume = async (file: File) => {
  const { setLoading } = useChatStore.getState();

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE}/document/upload_resume`, formData, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Resume upload failed";
    console.error("Resume upload failed:", message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};
