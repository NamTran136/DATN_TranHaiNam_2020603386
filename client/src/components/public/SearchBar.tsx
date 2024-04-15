import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { API_URL, BOOK, BookDto } from "../../types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { searchSetResults, searchSetValue, searchStart } from "../../store/features/searchSlice";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
    const { searchInput } = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();
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

  const fetchResults = (value: string) => {
    const results = data.filter((book) => {
      return (
        value &&
        book &&
        (book.author.toLowerCase().includes(value.toLowerCase()) ||
          book.title.toLowerCase().includes(value.toLowerCase()) ||
          book.category.toLowerCase().includes(value.toLowerCase()))
      );
    });
    dispatch(searchSetResults(results));
  };
  const handleChange = (value: string) => {
    dispatch(searchSetValue(value));
    fetchResults(value);
  };
  console.log(isLoading, error && "error: " + error);
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
