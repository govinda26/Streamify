import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyChannelPage from "./pages/MyChannelPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing: Login */}
        <Route path="/" element={<Login />} />
        {/* Auth */}
        <Route path="/register" element={<Register />} />
        {/* Post-login: My Channel */}
        <Route path="/home" element={<MyChannelPage />} />
        <Route path="/my-channel" element={<MyChannelPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
