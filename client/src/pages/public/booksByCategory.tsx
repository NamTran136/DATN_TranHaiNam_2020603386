import { useEffect, useState } from "react";
import {
  API_URL,
  BOOK,
  BookDto,
  CATEGORY,
  CategoryDto,
} from "../../types";
import axios from "axios";
import SubItem from "../../components/public/SubItem";
import Menu from "../../components/public/Menu";
import Title from "../../components/public/Title";
import { Link, useParams } from "react-router-dom";
import Pagination from "../../components/public/Pagination";

const booksByCategory = () => {
  const { categoryId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BookDto[]>([]);
  const [category, setCategory] = useState<string>("");
  const [isLoadingCate, setIsLoadingCate] = useState(false);
  const [errorCate, setErrorCate] = useState<string | null>(null);
  
  const [books, setBooks] = useState<BookDto[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    fetchCategory();
    fetchData();
  }, [categoryId]);

  useEffect(() => {
    setBooks(data.slice((page - 1) * limit, (page - 1) * limit + limit));
  }, [data]);
  const fetchData = () => {
    setIsLoading(true);
    setData([]);
    axios
      .get(API_URL + BOOK + "/category/" + categoryId)
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
  const fetchCategory = () => {
    setIsLoadingCate(true);
    setCategory("");
    axios
      .get(API_URL + CATEGORY + "/" + categoryId)
      .then((response) => {
        const category: CategoryDto = response.data;
        setCategory(category.name);
        setErrorCate(null);
      })
      .catch((err) => {
        setErrorCate("Không có thể loại nào tương ứng với ID" + categoryId);
        console.log(err);
      })
      .finally(() => {
        setIsLoadingCate(false);
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
        {!isLoadingCate && <Title text={errorCate ? errorCate : category} />}
        <div className="list-book">
          {isLoading && <span>Loading...</span>}

          {books.length > 0 &&
            books.map((book, index) => (
              <div className="book-item" key={index}>
                <Link to={`/book/${book.id}`}>
                  <img src={book.imageUrl} alt={book.title} />
                  <div>{book.title}</div>
                </Link>
              </div>
            ))}
        </div>
        {error && (
          <span className="red">Thể loại {category} hiện tại chưa có sách</span>
        )}
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

export default booksByCategory;
