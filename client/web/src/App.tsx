import { LandingPage } from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";

import ChatPage from "./pages/ChatPage";

import ProfilePage from "./pages/ProfilePage";

import LoginModal from "./components/LoginModal";
import { useUIStore } from "./store/uiStore";
import SignupModal from "./components/RegistrationModal";

const App = () => {
  const { showLoginModal, showSignupModal } = useUIStore();
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      {showLoginModal && <LoginModal />}
      {showSignupModal && <SignupModal />}
    </>
  );
};

export default App;
