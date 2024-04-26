import { Outlet, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { signInSuccess, signOut } from "../store/features/userSlice";

const privateRoute = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  var setupTime = localStorage.getItem("setupTime");
  var now = new Date().getTime();
  if(setupTime) {
    if(now - parseInt(setupTime) > 3 * 60 * 60 * 1000) {
      localStorage.clear();
      dispatch(signOut());
      return <Navigate to="/" />;
    }
    else{
      localStorage.setItem("setupTime", now.toString());
      localStorage.getItem("token") !== undefined
        ? dispatch(signInSuccess(localStorage.getItem("token")))
        : dispatch(signOut());
      return user.role == "Admin" ? <Outlet /> : <Navigate to="/" />;
    }
  }
  else{
    localStorage.clear();
    dispatch(signOut());
    return <Navigate to="/" />;
  }  
};

export default privateRoute;
