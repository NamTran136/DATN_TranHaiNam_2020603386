import { useEffect, useState } from "react";
import { API_URL, BookDto, FBOOK } from "../../types";
import axios from "axios";
import SubItem from "../../components/public/SubItem";
import Menu from "../../components/public/Menu";
import Title from "../../components/public/Title";
import { Link } from "react-router-dom";
import Pagination from "../../components/public/Pagination";
import { useAppSelector } from "../../store/store";

const LikedBooks = () => {
  const { user, token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BookDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [books, setBooks] = useState<BookDto[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setBooks(data.slice((page - 1) * limit, (page - 1) * limit + limit));
  }, [data]);
  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + FBOOK + `?email=${user.email}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const books: BookDto[] = response.data;
        setData(books);
        setTotalCount(Math.ceil(books.length / limit));
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

  function handlePageChange(value: number | string) {
    if (value === "&laquo;" || value === "... ") {
      setPage(1);
    } else if (value === "&lsaquo;") {
      if (page !== 1) {
        setPage(page - 1);
      }
    } else if (value === "&rsaquo;") {
      if (page !== totalCount) {
        setPage(page + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setPage(totalCount);
    } else {
      if (typeof value === "number") {
        setPage(value);
      }
    }
  }

  useEffect(() => {
    setBooks(data.slice((page - 1) * limit, (page - 1) * limit + limit));
  }, [page]);
  return (
    <div className="allBook-container">
      <div className="allBook-content">
        <Title text="Sách yêu thích" />
        {isLoading && <span>Loading...</span>}
        {error && (
          <span className="red mt-2">Hiện tại chưa có sách yêu thích</span>
        )}
        <div className="list-book">
          {books.length > 0 &&
            books.map((book, index) => (
              <div className="book-item" key={index}>
                <Link to={`/book/${book.id}`}>
                  <img src={book.imageUrl} alt={book.title} />
                  <div className="">{book.title}</div>
                </Link>
              </div>
            ))}
        </div>
        <Pagination
          totalPages={totalCount}
          page={page}
          limit={limit}
          siblings={1}
          onPageChange={handlePageChange}
        />
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

export default LikedBooks;
