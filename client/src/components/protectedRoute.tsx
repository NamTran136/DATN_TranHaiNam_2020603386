import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/store";

const protectedRoute = () => {
  const { user } = useAppSelector((state) => state.user);
  return user.username !== "" ? <Outlet /> : <Navigate to="/signin" />;
};

export default protectedRoute;
