import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "../slices/apiSlice"; // Import the correct mutation
import { setCredentials } from "../slices/authSlice";
import log from "../assets/log.png";
import Logo from "../components/Logo1";
import Loader from "../components/Loader";

function Register() {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [registerUser, { isLoading }] = useRegisterUserMutation(); // Use the correct mutation

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard/board");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await registerUser({
          firstName,
          lastName,
          username,
          email,
          password,
        }).unwrap();

        // Store the accessToken and refreshToken in localStorage
        localStorage.setItem("token", res.bearer.accessToken);
        localStorage.setItem("refreshToken", res.bearer.refreshToken);

        // Store user info
        localStorage.setItem("userInfo", JSON.stringify(res.user));

        // Update Redux store with user info
        dispatch(setCredentials(res.user));

        navigate("/dashboard/board");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <img src={log} alt="Log" className="h-[100%] w-[30%]" />
      <div className="h-[90%] w-[70%] flex flex-col items-center justify-around">
        <div className="w-[60%]">
          <div className="flex items-center justify-between w-[100%]">
            <Logo className="" />
            <p className="text-3xl font-bold">Sign Up</p>
          </div>
        </div>

        <input
          type="text"
          name="firstname"
          placeholder="Firstname"
          className="w-[60%] h-[7%] outline-none border-2 border-slate-400 text-center rounded-xl"
          value={firstName}
          onChange={(e) => setFirstname(e.target.value)}
          autoComplete="given-name"
        />
        <input
          type="text"
          name="lastname"
          placeholder="Lastname"
          className="w-[60%] outline-none border-2 border-slate-400 text-center rounded-xl h-[7%]"
          value={lastName}
          onChange={(e) => setLastname(e.target.value)}
          autoComplete="family-name"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-[60%] outline-none border-2 border-slate-400 text-center rounded-xl h-[7%]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-[60%] outline-none border-2 border-slate-400 text-center rounded-xl h-[7%]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-[60%] outline-none border-2 border-slate-400 text-center rounded-xl h-[7%]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-[60%] outline-none border-2 border-slate-400 text-center rounded-xl h-[7%]"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {isLoading && <Loader />}

        <button
          className="w-[60%] bg-red-500 h-[7%] text-white flex justify-center items-center font-bold rounded-xl"
          onClick={submitHandler}
        >
          Sign Up
        </button>

        <p className="text-xl font-bold">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 no-underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
