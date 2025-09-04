import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_SERVER_BASE_URL;

export const uploadResume = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_BASE}/document/upload_resume`, formData, {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    });

    return response.data; 
  } catch (error: any) {
    console.error("Resume upload failed:", error);
    return {
      error: error.response?.data?.detail || "Failed to upload resume",
    };
  }
};
