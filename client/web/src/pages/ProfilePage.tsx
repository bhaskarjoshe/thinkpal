import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";

const ProfilePage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <button
        className="border border-gray-300 px-3 py-1 rounded cursor-pointer"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
      <Footer />
    </div>
  );
};

export default ProfilePage;
