import { IconType } from "react-icons";
import { FaBlogger, FaBookOpen, FaCommentDots, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { RiDashboardFill, RiFeedbackFill} from "react-icons/ri";
import { Location, Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../store/features/userSlice";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebarMobile = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
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
  return isOpen ? (
    <div className="admin-sidebar-mobile">
      
      <div className="logo">
        <img className="logo-image" src="/ICon.png" />
      </div>

      <div className="wrapper">
        <h5>Dashboard</h5>
        <ul>
          <Li
            url="/admin/dashboard"
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
            url="/admin/accounts"
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
            Icon={FaCommentDots}
            location={location}
          />
          <Li
            url="/admin/blogs"
            text="Blogs"
            Icon={FaBlogger}
            location={location}
          />
          <Li
            url="/admin/feedbacks"
            text="Feedbacks"
            Icon={RiFeedbackFill}
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
          <li
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button onClick={handleSignOut}>
              <span>Sign out</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ backgroundColor: "red", color: "#fff", fontWeight: "bold" }} 
            >
              <span>Exit</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <></>
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
      padding: "0.5rem 1rem",
      width: "100%",
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
      <Icon size={22} />
      {text}
    </Link>
  </li>
);

export default AdminSidebarMobile;
