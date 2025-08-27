import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import { getUserData } from "../api/user";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto my-6 p-4 border rounded shadow">
        {userData ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p><span className="font-semibold">Name:</span> {userData.name}</p>
            <p><span className="font-semibold">Email:</span> {userData.email}</p>
            <p><span className="font-semibold">Semester:</span> {userData.semester || "N/A"}</p>
            <p><span className="font-semibold">Skills:</span> {userData.skills?.join(", ") || "N/A"}</p>
            <p><span className="font-semibold">Interests:</span> {userData.interests?.join(", ") || "N/A"}</p>
            <p><span className="font-semibold">Programming Languages:</span> {userData.programming_languages?.join(", ") || "N/A"}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="border border-gray-300 px-3 py-1 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
