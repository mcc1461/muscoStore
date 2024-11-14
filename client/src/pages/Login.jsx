// src/pages/Login.jsx
import React, { useState } from "react";
import { useLoginUserMutation } from "../features/api/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  // Renamed local state setter to avoid collision with Redux action
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(loginData).unwrap();
      console.log("Login successful:", userData); // Detailed logging

      // Extract user and accessToken from the response
      const { user, bearer } = userData;
      const { accessToken } = bearer;

      // Validate that accessToken exists
      if (accessToken) {
        dispatch(setCredentials({ user, token: accessToken })); // Store user and token
        toast.success("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        console.error("Access token not found in response:", userData);
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      console.error("Failed to login:", err);

      // Handle different error structures
      if (err.data && err.data.msg) {
        toast.error(`Login failed: ${err.data.msg}`);
      } else if (err.error) {
        toast.error(`Login failed: ${err.error}`);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white rounded-lg shadow-lg w-96"
      >
        <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
        {error && (
          <p className="mb-4 text-red-500">
            {error.data && error.data.msg
              ? error.data.msg
              : "Login failed. Please try again."}
          </p>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 text-white rounded-lg ${
            isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
