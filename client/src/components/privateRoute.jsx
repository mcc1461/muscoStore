import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  // Fetch userInfo from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Bypass authentication in development mode
  if (process.env.NODE_ENV === "development") {
    return <Outlet />;
  }

  // In production, check if user is authenticated
  return userInfo ? <Outlet /> : <Navigate to="/Signup" replace />;
};

export default PrivateRoute;
