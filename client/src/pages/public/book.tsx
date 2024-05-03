import { useEffect, useState } from "react";
import { API_URL, BOOK, BookDto } from "../../types";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Title from "../../components/public/Title";
import Menu from "../../components/public/Menu";
import SubItem from "../../components/public/SubItem";
import Comment from "../../components/public/Comment";
import { useAppSelector } from "../../store/store";
import toast from "react-hot-toast";

const book = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<BookDto>();
  const [error, setError] = useState<string | null>(null);

  const { bookId } = useParams();
  let id;
  if (bookId === undefined) {
    id = 0;
  } else {
    id = parseInt(bookId);
  }
  useEffect(() => {
    fetchData();
  }, [bookId]);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(API_URL + BOOK + "/" + bookId)
      .then((response) => {
        const book: BookDto = response.data;
        setBook(book);
        setError(null);
      })
      .catch((err) => {
        setError("Không có sách nào có ID = " + bookId);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="allBook-container">
      <div className="allBook-content">
        {isLoading && <span>Loading...</span>}
        {error && (
          <span className="red">Có lỗi xảy ra trong quá trình tải</span>
        )}
        {book && (
          <div className="book-wrapper">
            <Title text={`${book.category} > ${book.title}`} />
            <div className="book-image-wrapper">
              <div className="book-image">
                <img
                  src={book?.imageUrl}
                  alt={book?.title}
                  className="mx-auto w-max-width h-auto"
                />
                {localStorage.getItem("token") === null && book?.isPrivate && (
                  <div className="book-image-subitem">Cần đăng nhập</div>
                )}
              </div>
              <div className="book-detail">
                <div className="book-title">{book?.title}</div>
                <div className="mt-2">Tác giả: {book?.author}</div>
                <div className="mt-2">
                  Thể loại:{" "}
                  <Link
                    to={`/Books/category/${book?.categoryId}`}
                    className="book-title-link"
                  >
                    {book?.category}
                  </Link>
                </div>
                <div className="mt-2">Ngôn ngữ: {book?.language}</div>

                {localStorage.getItem("token") === null && book?.isPrivate && (
                  <div className="red book-message">
                    Vui lòng đăng nhập trước khi tải hoặc đọc ebook
                  </div>
                )}
                {((localStorage.getItem("token") !== null && book?.isPrivate) ||
                  !book?.isPrivate) && (
                  <>
                    <div className="green book-message">
                      Vui lòng chọn tải file hoặc đọc online
                    </div>
                    <div className="book-btn-wrapper">
                      <button
                        type="button"
                        className="bg-red text-white"
                        onClick={() => {
                          if (user.email) {
                            window.location.href = `https://drive.google.com/uc?export=download&id=${book?.code}`;
                          } else {
                            toast.error(
                              "Vui lòng đăng nhập trước khi tải sách"
                            );
                          }
                        }}
                      >
                        Tải PDF
                      </button>
                      <button type="button" className="bg-blue">
                        <Link
                          className="text-white"
                          to={`/reading-book/${book?.id}`}
                        >
                          Đọc sách
                        </Link>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="separate">{""}</div>
            <div className="book-description-wrapper">
              <div className="book-description-title">{book?.title}</div>
              <p>{book?.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="sub-item-container">
        <SubItem />
      </div>
      <div className="menu-container">
        <Menu />
      </div>
      <Comment bookId={id} email={user?.email || ""} />
    </div>
  );
};

export default book;
