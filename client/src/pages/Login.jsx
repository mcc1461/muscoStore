// src/components/Login.jsx

"use strict";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../slices/apiSlice";
import { setCredentials } from "../slices/authSlice";
import log from "../assets/log.png";
import Logo1 from "../components/Logo1";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function Login() {
  const [username, setUsername] = useState(""); // Using username
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.accessToken) {
      navigate("/dashboard/board");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Prepare login data
    const loginData = {
      username,
      password,
    };

    console.log("Submitting login data:", loginData); // Debugging

    try {
      await loginUser(loginData).unwrap();
      // The onQueryStarted in apiSlice.js handles setting credentials and redirect
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.data?.message || "Invalid login credentials");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <img src={log} alt="Logo" className="w-1/3 h-auto" />
      <div className="flex flex-col items-center justify-between h-7/10 w-7/10">
        <div className="w-3/5">
          <div className="flex items-center justify-between w-full">
            <Logo1 />
            <p className="text-3xl font-bold">Login</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-3/5 h-7/10 gap-7">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full text-center border-2 outline-none border-slate-400 rounded-xl h-1/5"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full text-center border-2 outline-none border-slate-400 rounded-xl h-1/5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {isLoading && <Loader />}

          <button
            onClick={submitHandler}
            className="flex items-center justify-center w-full font-bold text-center text-white no-underline bg-red-500 h-1/5 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="w-full">
            <Link to="/forgotPassword" className="text-right underline">
              Forgot Password
            </Link>
          </div>

          <p className="text-xl font-bold">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-500 no-underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
