import { Outlet, Navigate } from "react-router-dom";

const protectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default protectedRoute;
