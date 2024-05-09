import { IconType } from "react-icons";
import { FaBlogger, FaBookOpen, FaCommentDots, FaUser } from "react-icons/fa";
import { IoMdExit, IoMdSettings } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { RiDashboardFill, RiFeedbackFill, RiMenuUnfoldFill } from "react-icons/ri";
import { Location, Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../store/features/userSlice";
import { RiMenuFoldFill } from "react-icons/ri";

interface AdminSidebarProps {
  isFold: boolean;
  setIsFold: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar = ({ isFold, setIsFold }: AdminSidebarProps) => {
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
    <aside style={{ padding: isFold ? "0" : "1rem" }}>
      <div className="logo" style={{ display: isFold ? "none" : "block" }}>
        <img className="logo-image" src="/ICon.png" />
      </div>
      {!isFold ? (
        <RiMenuFoldFill
          size={32}
          className="menu-icon"
          onClick={() => setIsFold(!isFold)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        />
      ) : (
        <RiMenuUnfoldFill
          size={32}
          className="menu-icon"
          onClick={() => setIsFold(!isFold)}
          style={{
            display: "block",
            margin: "1rem auto",
          }}
        />
      )}

      <div
        className="wrapper"
        style={{
          margin: isFold ? "1rem" : "2rem 1rem",
        }}
      >
        <h5 style={{ display: isFold ? "none" : "block" }}>Dashboard</h5>
        <ul>
          <Li
            url="/admin/dashboard"
            text="Dashboard"
            Icon={RiDashboardFill}
            location={location}
            isFold={isFold}
          />
          <Li
            url="/admin/books"
            text="Book"
            Icon={FaBookOpen}
            location={location}
            isFold={isFold}
          />
          <Li
            url="/admin/categories"
            text="Category"
            Icon={MdCategory}
            location={location}
            isFold={isFold}
          />
          <Li
            url="/admin/accounts"
            text="User"
            Icon={FaUser}
            location={location}
            isFold={isFold}
          />
        </ul>
      </div>
      <div className="wrapper">
        <h5 style={{ display: isFold ? "none" : "block" }}>Website</h5>
        <ul>
          <Li
            url="/admin/comments"
            text="Comments"
            Icon={FaCommentDots}
            location={location}
            isFold={isFold}
          />
          <Li
            url="/admin/blogs"
            text="Blogs"
            Icon={FaBlogger}
            location={location}
            isFold={isFold}
          />
          <Li
            url="/admin/feedbacks"
            text="Feedbacks"
            Icon={RiFeedbackFill}
            location={location}
            isFold={isFold}
          />
        </ul>
      </div>
      <div className="wrapper">
        <h5 style={{ display: isFold ? "none" : "block" }}>Settings</h5>
        <ul>
          <Li
            url="/admin/settings"
            text="Settings"
            Icon={IoMdSettings}
            location={location}
            isFold={isFold}
          />
          <li
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button onClick={handleSignOut}>
              {isFold ? <IoMdExit size={20} /> : <span>Sign out</span>}
            </button>
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
  isFold: boolean;
}

const Li = ({ url, text, location, Icon, isFold }: LiProps) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url)
        ? "rgba(0, 115, 255, 0.1)"
        : "rgb(255, 255, 255)",
      margin: isFold ? "0" : "",
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
      {isFold ? "" : text}
    </Link>
  </li>
);

export default AdminSidebar;
