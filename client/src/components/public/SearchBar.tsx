import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { API_URL, BOOK, BookDto } from "../../types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { searchSetResults, searchSetValue, searchStart } from "../../store/features/searchSlice";
import { useNavigate } from "react-router-dom";
import { removeAccents } from "../../utils/appUtils";

const SearchBar = () => {
  const navigate = useNavigate();
    const { searchInput } = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<BookDto[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

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
    const results = data.filter((book) => {
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
    dispatch(searchSetResults(results));
  };
  const handleChange = (value: string) => {
    dispatch(searchSetValue(value));
    fetchResults(value);
  };
  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" onClick={() => {
        navigate(`/books/search/${searchInput}`)
        dispatch(searchStart());
        }} />
      <input
        type="text"
        placeholder="Tìm kiếm sách"
        value={searchInput}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
