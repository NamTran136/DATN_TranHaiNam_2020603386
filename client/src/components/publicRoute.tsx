import { Outlet, Navigate } from "react-router-dom";
import Header from "./public/Header";
import Introduction from "./public/Introduction";
import Footer from "./public/Footer";
const publicRoute = () => {
  const role = localStorage.getItem("role");
  return (
    <>
      <Header />
      <Introduction />
      <div className="public-container">
        {role !== "Admin" ? <Outlet /> : <Navigate to="/admin" />}
      </div>
      <Footer />
    </>
  );
};

export default publicRoute;
