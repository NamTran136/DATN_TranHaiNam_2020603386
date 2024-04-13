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

const booksByCategory = () => {
  const { categoryId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BookDto[]>([]);
  const [category, setCategory] = useState<string>("");
  const [isLoadingCate, setIsLoadingCate] = useState(false);
  const [errorCate, setErrorCate] = useState<string | null>(null);
  useEffect(() => {
    fetchCategory();
    fetchData();
  }, [categoryId]);
  const fetchData = () => {
    setIsLoading(true);
    setData([]);
    axios
      .get(API_URL + BOOK + "/category/" + categoryId)
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
  return (
    <div className="allBook-container">
      <div className="allBook-content">
        {!isLoadingCate && <Title text={errorCate ? errorCate : category} />}
        <div className="list-book">
          {isLoading && <span>Loading...</span>}

          {data.length > 0 &&
            data.map((book, index) => (
              <div className="book-item" key={index}>
                <Link to={`/book/${book.id}`}>
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                  />
                  <div>{book.title}</div>
                </Link>
              </div>
            ))}
        </div>
        {error && (
          <span className="red">Thể loại {category} hiện tại chưa có sách</span>
        )}
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
