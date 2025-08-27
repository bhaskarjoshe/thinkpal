import Navbar from "../components/Navbar";

const ChatPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-200 flex flex-col p-4 bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Quick Topics</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              DSA
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Operating Systems
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Computer Networks
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Programming
            </li>
          </ul>

          <h2 className="text-lg font-bold mb-4">Learning Actions</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Quiz Me
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Visual Learning
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Code Examples
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Learning Roadmap
            </li>
          </ul>

          <h2 className="text-lg font-bold mb-4">Recent Chats</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Chat 1
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              Chat 2
            </li>
          </ul>
        </aside>

        {/* Main Chat Section */}
        <main className="flex flex-col flex-1">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            Chat messages
          </div>

          {/* Input Bar */}
          <div className="border-t border-gray-200 p-4 sticky bottom-0 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask me anything about any subject..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className=" cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
