// ChatPage.tsx
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";
import { chatApi } from "../api/chat";
import ChatContainer from "../containers/ChatContainer";
import type { ChatMessage } from "../types/types";

import { GoLightBulb } from "react-icons/go";
import { IoCodeSharp, IoFlashOutline } from "react-icons/io5";
import { RiRoadMapLine } from "react-icons/ri";
import { LuFileQuestion, LuSend } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { useUserStore } from "../store/userStore";
import { useChatStore } from "../store/chatStore";

const ChatPage = () => {
  const { userData } = useUserStore();
  const [quickTopics, setQuickTopics] = useState<string[]>([]);
  const [chatMode, setChatMode] = useState<string>("normal");
  const { chatId, messages, addMessage, inputQuery, setInputQuery } = useChatStore();

  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    if (userData) {
      const topics = [
        ...(userData.interests || []),
        ...(userData.programming_languages || []),
      ].slice(0, 4);
      setQuickTopics(topics);
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: inputQuery,
    };
    addMessage(userMessage);
    setInputQuery("");
    setLoading(true);

    try {
      const response = await chatApi({
        chat_id: chatId,
        chat_mode: chatMode,
        query: userMessage.content,
      });

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "ai",
        content: JSON.stringify(
          response.ui_component || {
            component_type: "knowledge",
            content: "Sorry, no response.",
          }
        ),
      };
      addMessage(aiMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-100 border-r border-gray-200 flex flex-col gap-8 p-6 bg-white shadow-sm">
          {/* Quick Topics */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex gap-2 items-center text-gray-800">
              <GoLightBulb className="text-2xl text-blue-600" />
              Quick Topics
            </h2>
            <ul>
              {quickTopics.map((topic, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition flex items-center gap-2"
                >
                  <span className="font-medium">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Actions */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex gap-2 items-center text-gray-800">
              <IoFlashOutline className="text-2xl text-blue-600" />
              Learning Actions
            </h2>
            <ul>
              <li
                onClick={() => setChatMode("quiz")}
                className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-teal-500 to-green-400 text-white shadow-md">
                  <LuFileQuestion />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Quiz Me</span>
                  <span className="text-sm text-gray-500">
                    Generate interactive quizzes
                  </span>
                </div>
              </li>
              <li
                onClick={() => setChatMode("visual")}
                className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-md">
                  <FaRegEye />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Visual Learning</span>
                  <span className="text-sm text-gray-500">
                    Diagrams and visual explanations
                  </span>
                </div>
              </li>
              <li
                onClick={() => setChatMode("code")}
                className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md">
                  <IoCodeSharp />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Code Examples</span>
                  <span className="text-sm text-gray-500">
                    Interactive coding tutorials
                  </span>
                </div>
              </li>
              <li
                onClick={() => setChatMode("roadmap")}
                className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md">
                  <RiRoadMapLine />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Learning Roadmap</span>
                  <span className="text-sm text-gray-500">
                    Step-by-step learning path
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </aside>
        <main className="flex flex-col flex-1 bg-gray-50">
          {/* Chat container with padding */}
          <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 md:px-8">
            <ChatContainer
              messages={messages}
              loading={loading}
              setInputQuery={setInputQuery}
            />
          </div>

          {/* Input Bar full width */}
          <div className="border-t border-gray-200 bg-white w-full p-4 mt-auto">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 w-full max-w-4xl mx-auto"
            >
              <input
                type="text"
                value={inputQuery}
                placeholder="Ask me anything..."
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                className="cursor-pointer h-10 px-4 bg-gradient-to-br from-blue-300 to-purple-400 text-white rounded-xl scale-105 hover:scale-100 transition-transform shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <LuSend className="h-5 w-5" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
