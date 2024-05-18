import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, CATEGORY, CategoryDto } from "../../types";
import { BsEyeFill } from "react-icons/bs";
import { IoMdHeart } from "react-icons/io";

interface PublicSidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PublicSidebar = ({ isOpen, setIsOpen }: PublicSidebarProps) => {
  const { user } = useAppSelector((state) => state.user);
  const [data, setData] = useState<CategoryDto[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    axios
      .get(API_URL + CATEGORY)
      .then((response) => {
        const categories: CategoryDto[] = response.data;
        setData(categories);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(isOpen);
  return isOpen ? (
    <div className="menu-mobile-wrapper">
      <ul className="public-sidebar">
        <li onClick={() => setIsOpen(!open)}>
          <Link to="/" className="nav-link">
            Trang chủ
          </Link>
        </li>
        <li onClick={() => setIsOpen(!open)}>
          <Link to="/books" className="nav-link">
            <div className="nav-item-text">Thể loại sách</div>
          </Link>
          <ul>
            {data.length > 0 &&
              data.map((category, index) => (
                <li key={index} onClick={() => setIsOpen(!open)}>
                  <Link
                    to={`/books/category/${category.id}`}
                    className="nav__sub-menu-item"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
          </ul>
        </li>
        <li onClick={() => setIsOpen(!open)}>
          <Link to="/review" className="nav-link">
            Góc review
          </Link>
        </li>
      </ul>
      <div className="auth-container">
        {user.username !== "" && (
          <Link to="/favouritebooks">
            <IoMdHeart
              size={28}
              style={{
                borderRadius: "50%",
                color: "red",
                cursor: "pointer",
                marginRight: "12px",
              }}
            />
          </Link>
        )}
        {user.username !== "" && (
          <Link to="/watchedbooks">
            <BsEyeFill
              size={28}
              style={{
                borderRadius: "50%",
                color: "green",
                cursor: "pointer",
                marginRight: "12px",
              }}
            />
          </Link>
        )}
        <Link to="/profile">
          {user.username !== "" ? (
            <img src={user.image} alt={user.username} className="avatar" />
          ) : (
            <button
              className="btn-signin"
              onClick={() => {
                localStorage.setItem("previousUrl", window.location.href);
              }}
            >
              Đăng nhập
            </button>
          )}
        </Link>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default PublicSidebar