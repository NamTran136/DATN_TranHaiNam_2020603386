import { useEffect, useState } from "react";
import { API_URL, CATEGORY, CategoryDto } from "../../types";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";

const home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(API_URL + CATEGORY)
      .then((response) => {
        const categories: CategoryDto[] = response.data;
        setData(categories);
        setError(null)
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
    <main className="home-page">
      <h1 className="title">Thư Viện Ebook Miễn Phí</h1>
      <div className="sub-title-1">
        Read Book Free được xây dựng nhằm chia sẻ sách ebook miễn phí cho những
        ai khó khăn, chưa có điều kiện mua sách.
      </div>
      <div className="sub-title-2">
        Nếu Bạn có điều kiện, Hãy mua sách giấy để ủng hộ Tác giả và Nhà xuất
        bản
      </div>
      <hr />
      {isLoading && <span>Loading...</span>}
      <div className="content">
        {data.length > 0 &&
          data.map((category) => (
            <Link
              to={`/books/category/${category.id}`}
              className="content-item"
              key={category.id}
            >
              <FaBookOpen className="content-item-icon" />
              <span>{category.name}</span>
            </Link>
          ))}
        {error && <span className="red">Hiện chưa có thể loại sách nào</span>}
      </div>
    </main>
  );
};

export default home;
