import { Outlet, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useEffect } from "react";
import { signInSuccess, signOut } from "../store/features/userSlice";

const protectedRoute = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  console.log(user);
  useEffect(() => {
    var setupTime = localStorage.getItem("setupTime");
    var now = new Date().getTime();
    if (setupTime) {
      if (now - parseInt(setupTime) > 24 * 60 * 60 * 1000) {
        localStorage.clear();
        dispatch(signOut());
      } else {
        localStorage.getItem("token") !== undefined
          ? dispatch(signInSuccess(localStorage.getItem("token")))
          : dispatch(signOut());
      }
    }
  }, []);
  return user.email ? <Outlet /> : <Navigate to="/signin" />;
};

export default protectedRoute;
