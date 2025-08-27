import { LandingPage } from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";

import ChatPage from "./pages/ChatPage";

import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default App;
