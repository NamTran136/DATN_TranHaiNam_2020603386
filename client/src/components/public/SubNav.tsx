import { Link, Location, useLocation } from "react-router-dom";

const SubNav = () => {
  const location = useLocation();
  return (
      <ul className="subnav">
        <Li url="/profile" text="Thiết lập tài khoản" location={location} />
        <li>/</li>
        <Li url="/feedback" text="Phản hồi - Đóng góp" location={location} />
      </ul>
  );
};

interface LiProps {
  url: string;
  text: string;
  location: Location;
}

const Li = ({ url, text, location }: LiProps) => (
  <li>
    <Link
      to={url}
      style={{
        color: location.pathname.includes(url)
          ? "rgb(234, 67, 53)"
          : "rgb(0, 0, 0)",
      }}
    >
      <h2>{text}</h2>
    </Link>
  </li>
);

export default SubNav;
