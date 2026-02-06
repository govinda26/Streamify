import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      console.log("Login success:", res?.data);
      const token =
        res.data?.data?.accessToken || res.data?.accessToken || res.data?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      const userPayload = res.data?.data?.user || res.data?.user;
      if (userPayload?._id) {
        localStorage.setItem("user_id", userPayload._id);
      }
      if (userPayload?.username) {
        localStorage.setItem("username", userPayload.username);
      }
      if (userPayload?.fullName) {
        localStorage.setItem("full_name", userPayload.fullName);
      }
      if (userPayload?.avatar) {
        localStorage.setItem("avatar", userPayload.avatar);
      }

      let redirectUserId = userPayload?._id;

      await api
        .get("/users/current-user")
        .then((me) => {
          const currentUser = me.data?.data || me.data;
          const userId = currentUser?._id;
          if (userId) {
            localStorage.setItem("user_id", userId);
            redirectUserId = userId;
          }
          if (currentUser?.username) {
            localStorage.setItem("username", currentUser.username);
          }
          if (currentUser?.fullName) {
            localStorage.setItem("full_name", currentUser.fullName);
          }
          if (currentUser?.avatar) {
            localStorage.setItem("avatar", currentUser.avatar);
          }
        })
        .catch(() => { });

      if (redirectUserId) {
        navigate("/home", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || err.message || "Login failed");
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
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
          Play
        </div>

        <form onSubmit={onSubmit} className="flex flex-col">
          <label htmlFor="email" className="mb-1 inline-block text-gray-300">
            Email*
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="mb-1 inline-block text-gray-300">
            Password*
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="mb-4 block w-full rounded-lg border bg-transparent px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ae7aff] px-4 py-3 text-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Loading…" : "Log in"}
            </button>
          </div>

          {error ? <div className="mt-2 text-sm text-red-400">{error}</div> : null}
        </form>

        <p className="mt-4 text-gray-400 text-center text-sm">
          Don’t have an account?
          <Link to="/register" className="text-[#ae7aff] hover:underline">
            {" "}
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
