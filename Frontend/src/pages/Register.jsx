import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

function Register() {
  const navigate = useNavigate();

  // state for required text fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // state for files
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!avatar || !coverImage) {
        setError("Please select both avatar and cover image");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);
      if (coverImage) formData.append("coverImage", coverImage);

      // Debugging: log fields and files before sending
      console.log("Register payload (pre-send):", {
        fullName,
        email,
        username,
        passwordLength: password?.length ?? 0,
        avatar: avatar ? { name: avatar.name, type: avatar.type, size: avatar.size } : null,
        coverImage: coverImage ? { name: coverImage.name, type: coverImage.type, size: coverImage.size } : null,
      });
      for (const [key, val] of formData.entries()) {
        if (val instanceof File) {
          console.log(`FormData[${key}] -> File`, { name: val.name, type: val.type, size: val.size });
        } else {
          console.log(`FormData[${key}] ->`, val);
        }
      }

      const response = await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Registration success:", response?.data);
      navigate("/home");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white">
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block w-16">
          {/* SVG logo placeholder */}
        </div>
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">Play</div>

        <form onSubmit={onSubmit} className="flex flex-col">
          {/* full name */}
          <label htmlFor="fullName" className="mb-1 inline-block text-gray-300">Full Name*</label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* username */}
          <label htmlFor="username" className="mb-1 inline-block text-gray-300">Username*</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* email (original markup) */}
          <label htmlFor="email" className="mb-1 inline-block text-gray-300">Email*</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* password */}
          <label htmlFor="password" className="mb-1 inline-block text-gray-300">Password*</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* avatar (required) */}
          <label htmlFor="avatar" className="mb-1 inline-block text-gray-300">Avatar*</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            onChange={(e) => setAvatar(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            required
          />

          {/* cover image (optional) */}
          <label htmlFor="coverImage" className="mb-1 inline-block text-gray-300">Cover Image*</label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            onChange={(e) => setCoverImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            required
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ae7aff] px-4 py-3 text-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Loading…" : "Sign up with Email"}
            </button>
          </div>

          {error ? <div className="mt-2 text-sm text-red-400">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}

export default Register;


