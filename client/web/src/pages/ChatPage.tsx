import { GoLightBulb } from "react-icons/go";
import Navbar from "../components/Navbar";
import { IoCodeSharp, IoFlashOutline } from "react-icons/io5";
import { RiChat1Line, RiRoadMapLine } from "react-icons/ri";
import { LuFileQuestion, LuSend } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";
import ChatContainer from "../containers/ChatContainer";

const ChatPage = () => {
  const { userData } = useUserStore();
  const [quickTopics, setQuickTopics] = useState<string[]>([]);

  useEffect(() => {
    if (userData) {
      const topics = [
        ...(userData.interests || []),
        ...(userData.programming_languages || []),
      ].slice(0, 4);
      setQuickTopics(topics);
    }
  }, [userData]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
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
                  <span className="text-sm text-gray-600"> </span>
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
              {/* Quiz Me */}
              <li className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition">
                <div className="p-3 rounded-xl bg-gradient-to-r from-teal-500 to-green-400 text-white transition-transform duration-300 hover:scale-110 shadow-md">
                  <LuFileQuestion />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Quiz Me</span>
                  <span className="text-sm text-gray-500">
                    Generate interactive quizzes
                  </span>
                </div>
              </li>

              {/* Visual Learning */}
              <li className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 text-white transition-transform duration-300 hover:scale-110 shadow-md">
                  <FaRegEye />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Visual Learning</span>
                  <span className="text-sm text-gray-500">
                    Diagrams and visual explanations
                  </span>
                </div>
              </li>

              {/* Code Examples */}
              <li className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white transition-transform duration-300 hover:scale-110 shadow-md">
                  <IoCodeSharp />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Code Examples</span>
                  <span className="text-sm text-gray-500">
                    Interactive coding tutorials
                  </span>
                </div>
              </li>

              {/* Learning Roadmap */}
              <li className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex gap-3 items-center transition">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white transition-transform duration-300 hover:scale-110 shadow-md">
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

          {/* Recent Chats */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex gap-2 items-center text-gray-800">
              <RiChat1Line className="text-2xl text-blue-600" />
              Recent Chats
            </h2>
            <ul>
              <li className="cursor-pointer hover:bg-gray-100 p-2 px-4 rounded-lg flex flex-col ">
                <span>Chat 1</span>
                <span className="text-sm text-gray-500">Yesterday</span>
              </li>
              <li className="cursor-pointer hover:bg-gray-100 p-2 px-4 rounded-lg flex flex-col ">
                <span>Chat 2</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Chat Section */}
        <main className="flex flex-col flex-1 bg-gray-50">
          {/* Chat container with constrained width */}
          <div className="flex flex-col flex-1 mx-auto w-full max-w-4xl">
            {/* Chat messages */}
            <ChatContainer />
          </div>

          {/* Input Bar with full width background */}
          <div className="border-t border-gray-200 bg-white w-full p-4">
            <div className="flex items-center gap-3 mx-auto w-full max-w-4xl">
              <input
                type="text"
                placeholder="Ask me anything about any subject..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="cursor-pointer h-10 px-4 bg-gradient-to-r from-pink-300 to-purple-400 text-white rounded-xl scale-105 hover:scale-100 transition-transform shadow-md flex items-center justify-center">
                <LuSend className="h-5 w-5" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
