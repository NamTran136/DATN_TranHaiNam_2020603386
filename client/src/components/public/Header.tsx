import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL, CATEGORY, CategoryDto, User, USER, UserDto } from "../../types";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import { GetUser } from "../../types/tools";
const header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [image, setImage] = useState<string>("");
  const [errorUser, setErrorUser] = useState<string | null>(null);

  const initialUser : UserDto = {
    username: "",
    email: "",
    role: "",
    image: "",
  };

  const [user, setUser] = useState<UserDto>(initialUser);

  

  useEffect(() => {
    fetchData();
    const token = localStorage.getItem("token");
    setUser(GetUser(token))
  }, []);
  console.log(localStorage.getItem("token"));
  console.log(user);
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
  return (
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
        </ul>
        <div className="auth-container">
          <Link to="/profile">
            {user !== initialUser ? (
              <img
                src={user.image}
                alt={user.username}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <button className="bg-[rgb(166,193,238)] text-white md:my-0 my-2 px-5 py-2 rounded-full hover:bg-[rgb(135,172,236)]">
                Đăng nhập
              </button>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default header;
