import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/store";

const privateRoute = () => {
  const { user } = useAppSelector((state) => state.user);
  console.log(user)
  if (user.role === "") return <Navigate to="/" />;
  return user.role == "Admin" ? <Outlet /> : <Navigate to="/" />;
};

export default privateRoute;
