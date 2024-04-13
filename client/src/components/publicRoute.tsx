import { Outlet, Navigate } from "react-router-dom";
import Header from "./public/Header";
import Introduction from "./public/Introduction";
import Footer from "./public/Footer";
import { useAppSelector } from "../store/store";
const publicRoute = () => {
  const { user } = useAppSelector((state) => state.user);
  return (
    <>
      <Header />
      <Introduction />
      <div className="public-container">
        {user.role !== "Admin" ? <Outlet /> : <Navigate to="/admin" />}
      </div>
      <Footer />
    </>
  );
};

export default publicRoute;
