import { Outlet, Navigate } from "react-router-dom";
import Header from "./public/Header";
import Introduction from "./public/Introduction";
import Footer from "./public/Footer";
import { useAppDispatch, useAppSelector } from "../store/store";
import Search from "./public/Search";
import { signInSuccess, signOut } from "../store/features/userSlice";
import { useEffect } from "react";

const publicRoute = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    var setupTime = localStorage.getItem("expiredTime");
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
  return (
    <>
      <Header />
      <Search />
      <Introduction />
      <div className="public-container">
        {user.role !== "Admin" ? <Outlet /> : <Navigate to="/admin" />}
      </div>
      <Footer />
    </>
  );
};

export default publicRoute;
