import React, { useState } from "react";
import Select from "react-select";
import { TbBulb } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { signupApi } from "../api/auth";
import { useUIStore } from "../store/uiStore";
import {
  semesterOptions,
  skillOptions,
  interestOptions,
  languageOptions,
} from "../utils/signUpOptions";

const SignupModal = () => {
  const { closeSignupModal, openLoginModal } = useUIStore();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [step, setStep] = useState<"credentials" | "personalization">(
    "credentials"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    semester: "",
    skills: [] as string[],
    interests: [] as string[],
    programming_languages: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleNext = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setStep("personalization");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...formData,
        semester: formData.semester ? parseInt(formData.semester) : null,
      };
      const data = await signupApi(payload);
      login(data.token);
      navigate("/chat");
      closeSignupModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={closeSignupModal}
    >
      <div
        className="relative bg-white text-gray-800 rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={closeSignupModal}
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <TbBulb className="text-blue-600" size={50} />
          <span className="text-2xl font-bold mt-2">Join ThinkPal</span>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {step === "credentials" && (
            <>
              {/* --- Credentials --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="cursor-pointer  w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Next →
              </button>
            </>
          )}

          {step === "personalization" && (
            <>
              {/* --- Personalization --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <Select
                  options={semesterOptions}
                  placeholder="Select Semester"
                  value={semesterOptions.find(
                    (opt) => opt.value === formData.semester
                  )}
                  onChange={(opt) =>
                    setFormData((prev) => ({
                      ...prev,
                      semester: opt?.value || "",
                    }))
                  }
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (max 5)
                </label>
                <Select
                  isMulti
                  options={skillOptions}
                  placeholder="Select skills"
                  value={skillOptions.filter((opt) =>
                    formData.skills.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      skills: selected
                        ? selected.slice(0, 5).map((opt) => opt.value)
                        : [],
                    }))
                  }
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests (max 5)
                </label>
                <Select
                  isMulti
                  options={interestOptions}
                  placeholder="Select interests"
                  value={interestOptions.filter((opt) =>
                    formData.interests.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      interests: selected
                        ? selected.slice(0, 5).map((opt) => opt.value)
                        : [],
                    }))
                  }
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Languages (max 2)
                </label>
                <Select
                  isMulti
                  options={languageOptions}
                  placeholder="Select languages"
                  value={languageOptions.filter((opt) =>
                    formData.programming_languages.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      programming_languages: selected
                        ? selected.slice(0, 2).map((opt) => opt.value)
                        : [],
                    }))
                  }
                  className="w-full text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="cursor-pointer w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-medium transition"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {loading ? "Please wait..." : "Sign Up"}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Login line appears in both steps */}
        <p className="text-center text-gray-500 mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer text-blue-600"
            onClick={() => {
              closeSignupModal();
              openLoginModal();
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
