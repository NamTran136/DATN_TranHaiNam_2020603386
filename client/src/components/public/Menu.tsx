import { Link } from "react-router-dom";
import Title from "./Title";
import { useEffect, useState } from "react";
import { API_URL, CATEGORY, CategoryDto } from "../../types";
import axios from "axios";
import { BiCategoryAlt } from "react-icons/bi";

const Menu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="menu">
      <Title text="Thể loại sách" />
      <div className="menu-content">
        {isLoading && <h1>Loading...</h1>}{" "}
        {error && <h3 className="red">Có lỗi xảy ra trong quá trình tải</h3>}
        {data.length > 0 &&
          data.map((category) => (
            <Link
              to={`/books/category/${category.id}`}
              key={category.id}
              className="menu-item"
            >
              <BiCategoryAlt />
              <div className="">{category.name}</div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Menu;
