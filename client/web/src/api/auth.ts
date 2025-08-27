import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

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