import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice"; // Ensure you're using the correct API slice
import { logout } from "../slices/authSlice"; // Redux action for logging out

export default function Dasheader() {
  const { userInfo } = useSelector((state) => state.auth); // Get userInfo from Redux store

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation(); // Logout mutation hook from the API slice

  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      await logoutApiCall({ token }).unwrap(); // Call the logout API with token
      dispatch(logout()); // Clear user info from Redux store
      localStorage.removeItem("token"); // Ensure token is removed from local storage

      // Redirect to either login or homepage
      if (userInfo?.isAdmin) {
        navigate("/login"); // Redirect admin users to login
      } else {
        navigate("/"); // Redirect normal users to homepage
      }
    } catch (err) {
      console.log(err); // Handle errors
    }
  };

  return (
    <div className="flex items-center justify-between w-[80vw] h-[10vh] bg-white rounded-md shadow-lg px-5 text-black">
      <p className="text-xl font-bold">
        Hello,{" "}
        {userInfo ? (
          <Link to="/dashboard/profile" className="text-red-500 no-underline">
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
