import { BsSearch } from "react-icons/bs";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FaRegBell } from "react-icons/fa";


const CategoryService = () => {
  
  return (
    <div className="admin-container">
      <AdminSidebar />
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
        <div className="widget-container">Category</div>
      </main>
    </div>
  );
};

export default CategoryService;
