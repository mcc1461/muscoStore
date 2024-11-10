// src/components/Login.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../features/api/apiSlice";
import { setCredentials } from "../features/api/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ username, password }).unwrap();
      dispatch(setCredentials(userData));
      setUsername("");
      setPassword("");
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to login:", err);
      toast.error(err?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-1/3 p-6 bg-white rounded shadow-md"
      >
        <h2 className="mb-4 text-2xl">Login</h2>
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
