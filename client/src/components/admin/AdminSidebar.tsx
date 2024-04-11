import { IconType } from "react-icons";
import { FaBookOpen, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { Location, Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../store/features/userSlice";

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      localStorage.clear();
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <aside>
      <div className="logo">
        <img className="logo-image" src="/ICon.png" />
      </div>
      <div className="wrapper">
        <h5>Dashboard</h5>
        <ul>
          <Li
            url="/admin"
            text="Dashboard"
            Icon={RiDashboardFill}
            location={location}
          />
          <Li
            url="/admin/books"
            text="Book"
            Icon={FaBookOpen}
            location={location}
          />
          <Li
            url="/admin/categories"
            text="Category"
            Icon={MdCategory}
            location={location}
          />
          <Li
            url="/admin/users"
            text="User"
            Icon={FaUser}
            location={location}
          />
        </ul>
      </div>
      <div className="wrapper">
        <h5>Website</h5>
        <ul>
          <Li
            url="/admin/comments"
            text="Comments"
            Icon={RiDashboardFill}
            location={location}
          />
          <Li
            url="/admin/advertisement"
            text="Advertisement"
            Icon={FaBookOpen}
            location={location}
          />
          <Li
            url="/admin/confirmation"
            text="Confirmation"
            Icon={MdCategory}
            location={location}
          />
        </ul>
      </div>
      <div className="wrapper">
        <h5>Settings</h5>
        <ul>
          <Li
            url="/admin/settings"
            text="Settings"
            Icon={IoMdSettings}
            location={location}
          />
          <li>
            <button onClick={handleSignOut}>Sign out</button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

interface LiProps {
  url: string;
  text: string;
  location: Location;
  Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url)
        ? "rgba(0, 115, 255, 0.1)"
        : "rgb(255, 255, 255)",
    }}
  >
    <Link
      to={url}
      style={{
        color: location.pathname.includes(url)
          ? "rgb(0, 115, 255)"
          : "rgb(0, 0, 0)",
      }}
    >
      <Icon />
      {text}
    </Link>
  </li>
);

export default AdminSidebar;
