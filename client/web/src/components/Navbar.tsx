import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { TbBulb } from "react-icons/tb";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`flex justify-between items-center px-6 py-3 sticky top-0 z-30 transition-all duration-300 backdrop-blur-md border-b border-gray-200
        ${scrolled ? "bg-white/80 shadow-md px-20" : "bg-white/40"}
      `}
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
        <Link to="/chat">
          <Button>
            Get Started 🡪
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
