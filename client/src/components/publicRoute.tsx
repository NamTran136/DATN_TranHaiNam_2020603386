import { Outlet, Navigate } from "react-router-dom";
import Header from "./public/Header";
import Introduction from "./public/Introduction";
import Footer from "./public/Footer";
import { useAppDispatch, useAppSelector } from "../store/store";
import { signInSuccess, signOut } from "../store/features/userSlice";
import { useEffect, useState } from "react";
import PublicSidebar from "./public/PublicSidebar";

const publicRoute = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  window.addEventListener("resize", ()=>{
    if(window.innerWidth > 960) setIsOpen(false);
  });
  return (
    <>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <Introduction />
      <div className="public-container" onClick={() => setIsOpen(false)}>
        {user.role !== "Admin" ? <Outlet /> : <Navigate to="/admin" />}
      </div>
      <PublicSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Footer />
    </>
  );
};

export default publicRoute;
