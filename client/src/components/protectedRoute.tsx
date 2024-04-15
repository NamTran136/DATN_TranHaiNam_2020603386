import { Outlet, Navigate } from "react-router-dom";

const protectedRoute = () => {
  return localStorage.getItem("token") ? <Outlet /> : <Navigate to="/signin" />;
};

export default protectedRoute;
