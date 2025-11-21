import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyChannelPage from "./pages/MyChannelPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoDetailPage from "./pages/VideoDetailPage";
import "./App.css";

const RedirectToChannel = () => {
  const username = localStorage.getItem("username");
  if (!username) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/channel/${username}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/channel/:username" element={<MyChannelPage />} />
        <Route path="/video/:videoId" element={<VideoDetailPage />} />
        <Route path="/home" element={<RedirectToChannel />} />
        <Route path="/my-channel" element={<RedirectToChannel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
