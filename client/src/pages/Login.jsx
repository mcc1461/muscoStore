import { setCredentials } from "../features/api/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../components/Logo1";
import { useLoginUserMutation } from "../features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password }).unwrap();
      console.log("Login response:", res);

      // Check if the response contains bearer and user data
      if (!res.bearer || !res.user) {
        console.error("Bearer token or user data is missing in response.");
        toast.error("Login failed. Please try again.");
        return;
      }

      // Extract accessToken and user data
      const { accessToken } = res.bearer;
      const user = res.user;

      // Combine token and user info
      const userInfoWithToken = {
        ...user,
        token: accessToken,
      };

      // Store combined userInfo in localStorage
      localStorage.setItem("userInfo", JSON.stringify(userInfoWithToken));

      // Update Redux state
      dispatch(setCredentials(userInfoWithToken));

      setUsername("");
      setPassword("");
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to login:", err);
      toast.error(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-1/3 p-6 bg-white rounded shadow-md"
      >
        {/* Logo at the top */}
        <div className="flex justify-center mb-4">
          <Logo />
        </div>

        <h2 className="mb-4 text-2xl text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        {/* Password input with show/hide functionality using emojis */}
        <div className="relative w-full mb-6">
          <label className="block mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border-2 border-slate-400 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          <div
            className="absolute my-3 right-4 top-[50%] transform -translate-y-[50%] cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            style={{ fontSize: "1.5em" }}
          >
            {showPassword ? "🙈" : "👁️"}
          </div>
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
