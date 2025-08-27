import axios from "axios";

const API_BASE = import.meta.env.VITE_SERVER_BASE_URL;

export const loginApi = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(
      "Login failed:",
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Login failed"
    );
    throw new Error(
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Login failed"
    );
  }
};


export const signupApi = async (payload: {
  name: string;
  email: string;
  password: string;
  semester: string;
  skills: string[];
  interests: string[];
  programming_languages: string[];
}) => {
    try {
        const response = await axios.post(`${API_BASE}/auth/signup`, payload);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        console.error(
            "Signup failed:",
            (error as { response?: { data?: { message?: string } } })?.response?.data
              ?.message || "Signup failed"
        );
        throw new Error(
            (error as { response?: { data?: { message?: string } } })?.response?.data
              ?.message || "Signup failed"
        );
    }
}