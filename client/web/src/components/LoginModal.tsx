import React, { useState } from "react";
import { TbBulb } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginApi, signupApi } from "../api/auth";
import { useUIStore } from "../store/uiStore";

type FormData = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

const LoginModal = () => {
  const { closeLoginModal } = useUIStore();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const data = isSignup
        ? await signupApi({
            name: formData.name!,
            email: formData.email,
            password: formData.password,
          })
        : await loginApi({
            email: formData.email,
            password: formData.password,
          });

      login(data.token);

      navigate("/chat");
      closeLoginModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 overflow-auto"
      onClick={closeLoginModal}
    >
      <div
        className="relative bg-white text-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={closeLoginModal}
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <TbBulb className="text-blue-600" size={50} />
          <span className="text-2xl font-bold mt-2">ThinkPal</span>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border-b border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border-b border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border-b border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.password || ""}
            onChange={handleChange}
            required
          />
          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border-b border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              required
            />
          )}

          {/* Error message inside modal */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-500 mt-4 text-sm">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <span
            className="underline cursor-pointer text-blue-600"
            onClick={() => {
              setIsSignup(!isSignup);
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}
          >
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>

        <p className="text-gray-400 text-xs text-center mt-6">
          * By continuing you agree to the{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
