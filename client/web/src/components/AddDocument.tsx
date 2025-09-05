import { useState, useRef, type ChangeEvent } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import { uploadResume } from "../api/document";
import { useChatStore } from "../store/chatStore";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "../types/types";

interface AddDocumentProps {
  maxFileSizeMB?: number;
}

export default function AddDocument({ maxFileSizeMB = 5 }: AddDocumentProps) {
  const [showOptions, setShowOptions] = useState(false);
  const MAX_FILE_SIZE = maxFileSizeMB * 1024 * 1024;
  const containerRef = useRef<HTMLDivElement>(null);

  const { addMessage, setLoading } = useChatStore();

  const handleResumeUpload = async (file: File) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: "Uploaded the resume",
    };
    addMessage(userMessage);
    setLoading(true);

    try {
      const response = await uploadResume(file);

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "ai",
        ui_components:
          response.ui_components && response.ui_components.length > 0
            ? response.ui_components
            : [
                {
                  component_type: "knowledge",
                  title: "Resume Analysis",
                  content: "No response from resume upload.",
                  features: [],
                },
              ],
      };
      addMessage(aiMessage);
    } catch (err) {
      console.error("Resume upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`File size should not exceed ${maxFileSizeMB} MB`);
      return;
    }

    if (type === "Resume") {
      handleResumeUpload(file);
    } else {
      console.log("Other document upload not implemented yet.");
    }

    setShowOptions(false);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Main Button */}
      <button
        onClick={(e) => {
          if (e.detail !== 0) setShowOptions(!showOptions);
        }}
        className="text-gray-600 bg-gray-50 hover:bg-gray-100 w-10 h-10 p-2 rounded-full
                   flex items-center justify-center cursor-pointer transition-colors duration-200
                   border border-gray-300"
      >
        <BsPlusLg className="text-2xl" />
      </button>

      {/* Dropdown above the button */}
      {showOptions && (
        <div className="absolute bottom-full mb-2 left-0 w-48 bg-white shadow-md rounded-xl border border-gray-300 z-10">
          {[
            {
              type: "Resume",
              icon: <MdOutlineDocumentScanner className="mr-2 text-lg" />,
            },
            {
              type: "Other Docs",
              icon: <IoDocumentsOutline className="mr-2 text-lg" />,
            },
          ].map(({ type, icon }) => (
            <label
              key={type}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
            >
              {icon}
              {type}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e, type)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
