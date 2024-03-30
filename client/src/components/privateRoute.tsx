import { Outlet, Navigate } from "react-router-dom";

const privateRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/" />;
  return role == "Admin" && token ? <Outlet /> : <Navigate to="/" />;
};

export default privateRoute;
