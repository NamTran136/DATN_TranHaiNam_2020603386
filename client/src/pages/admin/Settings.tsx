import { BsSearch } from "react-icons/bs";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FaRegBell } from "react-icons/fa";
import { useState } from "react";
import AdminSidebarMobile from "../../components/admin/AdminSidebarMobile";
import { IoMdMenu } from "react-icons/io";


const Settings = () => {
  const [isFold, setIsFold] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="admin-container"
      style={{
        gridTemplateColumns: isFold ? "1fr 15fr" : "1fr 4fr",
        gap: isFold ? "0.5rem" : "2rem",
      }}
    >
      <AdminSidebar isFold={isFold} setIsFold={setIsFold} />
      <AdminSidebarMobile isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="open-menu-icon">
        <IoMdMenu size={24} onClick={() => setIsOpen(!isOpen)} />
      </div>
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPodEp1Zyixlyx1Rrq6JJlPm0hgg1pFeLNrxgt2bkYw&s"
            alt="User"
          />
        </div>
        <div className="widget-container">Settings</div>
      </main>
    </div>
  );
};

export default Settings;
