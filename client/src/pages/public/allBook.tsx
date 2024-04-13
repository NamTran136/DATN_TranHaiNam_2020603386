import { useEffect, useState } from "react";
import { API_URL, BOOK, BookDto } from "../../types";
import axios from "axios";
import SubItem from "../../components/public/SubItem";
import Menu from "../../components/public/Menu";
import Title from "../../components/public/Title";
import { Link } from "react-router-dom";

const allBook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BookDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(API_URL + BOOK)
      .then((response) => {
        const books: BookDto[] = response.data;
        setData(books);
        setError(null);
      })
      .catch((err) => {
        setError("Không có sách nào");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="allBook-container">
      <div className="allBook-content">
        <Title text="Tất cả sách" />
        <div className="list-book">
          {isLoading && <span>Loading...</span>}
          {error && <span>Có lỗi xảy ra trong quá trình tải</span>}
          {data.length > 0 &&
            data.map((book, index) => (
              <div className="book-item" key={index}>
                <Link to={`/book/${book.id}`}>
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                  />
                  <div className="">{book.title}</div>
                </Link>
              </div>
            ))}
        </div>
      </div>
      <div className="sub-item-container">
        <SubItem />
      </div>
      <div className="menu-container">
        <Menu />
      </div>
    </div>
  );
};

export default allBook;
