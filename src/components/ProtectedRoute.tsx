import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if token exists
  const token = localStorage.getItem("authToken");

  // If no token, redirect to Login (Index)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render the child route (Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;