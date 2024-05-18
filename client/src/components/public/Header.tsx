import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL, CATEGORY, CategoryDto } from "../../types";
import axios from "axios";
import { IoIosArrowDown, IoMdHeart, IoMdMenu } from "react-icons/io";
import { useAppSelector } from "../../store/store";
import { BsEyeFill } from "react-icons/bs";
import Search from "./Search";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ isOpen, setIsOpen }: HeaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 960);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth < 960);
  });
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(API_URL + CATEGORY)
      .then((response) => {
        const categories: CategoryDto[] = response.data;
        setData(categories);
        setError(null);
      })
      .catch((err) => {
        setError("Không có thể loại nào");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return !isMobile ? (
    <>
      <header className="header">
        <nav className="topnav">
          <div className="logo">
            <Link to="/">
              <div className="logo-container">
                <img className="logo-image" src="/ICon.png" />
                <h1 className="logo-text orange">Read Book Free</h1>
              </div>
            </Link>
          </div>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/books" className="nav-link">
                <div className="nav-item-text">
                  Thể loại sách
                  <IoIosArrowDown />
                </div>
              </Link>
              <ul className="nav__sub-menu">
                {isLoading && <li>Loading...</li>}
                {data.length > 0 &&
                  data.map((category, index) => (
                    <li key={index}>
                      <Link
                        to={`/books/category/${category.id}`}
                        className="nav__sub-menu-item"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                {error && <li className="red">{error}</li>}
              </ul>
            </li>
            <li className="nav-item">
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
        </nav>
      </header>
      <Search />
    </>
  ) : (
    <header className="header header-mobile">
      <div className="logo">
        <Link to="/">
          <div className="logo-container">
            <img className="logo-image" src="/ICon.png" />
          </div>
        </Link>
      </div>
      <Search />
      <div className="menu-icon">
        <IoMdMenu size={32} onClick={() => setIsOpen(!isOpen)} />
      </div>
    </header>
  );
};

export default Header;