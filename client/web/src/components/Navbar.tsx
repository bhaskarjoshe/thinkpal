import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { TbBulb } from "react-icons/tb";
import { GoPerson, GoPlus } from "react-icons/go";
import { BsChat } from "react-icons/bs";
import { useChatAccess } from "../hooks/useChatAccess";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const requestChatAccess = useChatAccess();
  const location = useLocation();

  const isChat = location.pathname.startsWith("/chat");
  const isProfile = location.pathname.startsWith("/profile");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30 shadow-md">
      <nav
        className={`flex items-center justify-between px-6 lg:px-12 py-3 transition-all duration-300 backdrop-blur-md border-b
        ${
          scrolled
            ? "bg-white/90 shadow-md border-gray-200"
            : "bg-white/50 border-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-gray-800 hover:text-gray-900 transition-colors"
        >
          <TbBulb className="text-blue-600" size={32} />
          <span>ThinkPal</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {isChat && (
            <div className="flex gap-2">
              {/* Profile button */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                <GoPerson size={22} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              {/* New Chat button */}
              <button
                type="button"
                className="border border-gray-200 flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <GoPlus size={22} />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>
          )}
          {isProfile && (
            <Link
              to="/chat"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <BsChat size={15} />
              <span className="hidden sm:inline">Chat</span>
            </Link>
          )}

          {!isChat && !isProfile && (
            <>
              <Link
                to="/about"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                About
              </Link>
              <Button onClick={requestChatAccess}>Get Started →</Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
