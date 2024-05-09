import { Link, useParams } from "react-router-dom";
import Title from "../../components/public/Title";
import { API_URL, BOOK, BookDto } from "../../types";
import SubItem from "../../components/public/SubItem";
import Menu from "../../components/public/Menu";
import axios from "axios";
import { useEffect, useState } from "react";
import { removeAccents } from "../../utils/appUtils";


const searchPage = () => {
    const { searchValue } = useParams();
    useEffect(() => {
      fetchData();
    }, []);
    const [data, setData] = useState<BookDto[]>([]);
  
    const fetchData = () => {
      axios
        .get(API_URL + BOOK)
        .then((response) => {
          const books: BookDto[] = response.data;
          setData(books);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchResults = (value: string) => {
      return data.filter((book) => {
        return (
          value &&
          book &&
          (removeAccents(book.author.toLowerCase()).includes(
            removeAccents(value.toLowerCase())
          ) ||
            removeAccents(book.title)
              .toLowerCase()
              .includes(removeAccents(value.toLowerCase())) ||
            removeAccents(book.category)
              .toLowerCase()
              .includes(removeAccents(value.toLowerCase())))
        );
      });
    };
  return (
    <div className="allBook-container">
      <div className="allBook-content">
        <Title text={`Sách liên quan đến từ tìm kiếm "${searchValue}"`} />
        <div className="list-book">
          {fetchResults(searchValue || "").length > 0 &&
            fetchResults(searchValue || "").map((book, index) => (
              <div className="book-item" key={index}>
                <Link to={`/book/${book.id}`}>
                  <img src={book.imageUrl} alt={book.title} />
                  <div className="">{book.title}</div>
                </Link>
              </div>
            ))}
        </div>
        {fetchResults(searchValue || "").length === 0 && (
          <span className="red">
            Không tìm thấy sách ứng với từ khóa "{searchValue}"
          </span>
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
}

export default searchPage