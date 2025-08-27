import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { TbBulb } from "react-icons/tb";
import { useAuthStore } from "../store/authStore";
import LoginModal from "../components/LoginModal";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/chat");
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div>
      <nav
        className={`flex justify-between items-center px-6 py-3 sticky top-0 z-30 transition-all duration-300 backdrop-blur-md border-b border-gray-200
        ${scrolled ? "bg-white/80 shadow-md px-20" : "bg-white/40"}`}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-gray-800 transition-colors duration-300"
        >
          <TbBulb className="text-blue-600" size={40} />
          AI Tutor
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            About
          </Link>
          <Button onClick={handleGetStarted}>Get Started 🡪</Button>
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default Navbar;
