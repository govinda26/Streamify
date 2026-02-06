import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyChannelPage from "./pages/MyChannelPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoDetailPage from "./pages/VideoDetailPage";
import PlaylistVideoPage from "./pages/PlaylistVideoPage";
import HomePage from "./pages/HomePage";
import LikedVideos from "./pages/LikedVideos";
import MyPlaylists from "./pages/MyPlaylists";
import MySubscribers from "./pages/MySubscribers";
import "./App.css";

import Layout from "./components/Layout";

const RedirectToChannel = () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/channel/id/${userId}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/channel/:username" element={<MyChannelPage />} />
          <Route path="/channel/id/:channelId" element={<MyChannelPage />} />
          <Route path="/channel/:channelId/playlist/:playlistId" element={<PlaylistVideoPage />} />
          <Route path="/video/:videoId" element={<VideoDetailPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/liked-videos" element={<LikedVideos />} />
          <Route path="/collections" element={<MyPlaylists />} />
          <Route path="/subscribers" element={<MySubscribers />} />
          <Route path="/my-channel" element={<RedirectToChannel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
