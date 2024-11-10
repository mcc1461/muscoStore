import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { useLogoutMutation } from "../slices/usersApiSlice"; // Ensure you're using the correct API slice
import { logout } from "../features/api/auth/authSlice"; // Redux action for logging out

export default function Dasheader() {
  const { userInfo } = useSelector((state) => state.auth); // Get userInfo from Redux store

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [logoutApiCall] = useLogoutMutation(); // Logout mutation hook from the API slice

  const logoutHandler = async () => {
    dispatch(logout()); // Clear user info from Redux store

    // Remove tokens and user info from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between lg:w-[80vw] w-[99%] h-[10vh] bg-blue-100 rounded-lg shadow-lg px-5 mx-2 text-black">
      <p className="text-xl font-bold">
        Hello,{" "}
        {userInfo ? (
          <Link to="/dashboard/profile" className="text-red-700 no-underline">
            {userInfo.username} {/* Show user's name */}
          </Link>
        ) : (
          "Guest"
        )}
      </p>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-semibold text-center p-2 no-underline rounded-[50px] w-[100px] transition ease-in-out delay-150 hover:-translate-1 hover:scale-110"
        onClick={logoutHandler}
      >
        Log Out
      </button>
    </div>
  );
}
