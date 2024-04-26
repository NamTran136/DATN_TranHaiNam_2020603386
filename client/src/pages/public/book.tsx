import { useEffect, useState } from "react";
import { API_URL, BOOK, BookDto, COMMENT, CommentDto } from "../../types";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Title from "../../components/public/Title";
import Menu from "../../components/public/Menu";
import SubItem from "../../components/public/SubItem";
import { useAppSelector } from "../../store/store";

const book = () => {
  const { user } = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<BookDto>();
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentDto[]>();
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [errorComment, setErrorComment] = useState<string | null>(null);
  const { bookId } = useParams();
  useEffect(() => {
    fetchData();
  }, [bookId]);

  useEffect(() => {
    fetchComment();
  }, []);
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
  const fetchComment = () => {
    setIsLoadingComment(true);
    axios
      .get(API_URL + COMMENT + "/book=" + bookId)
      .then((response) => {
        setComments(response.data);
        setErrorComment(null);
      })
      .catch((err) => {
        setErrorComment("Có lỗi xảy ra khi tải.");
        console.log(err);
      })
      .finally(() => {
        setIsLoadingComment(false);
      });
  };
  function getTime(data: string) {
    var time = new Date(data);
    var now = new Date();
    if (!isNaN(time.getTime())) {
      return (now.getTime() - time.getTime()) / (1000 * 60);
    }
    else{
      return "";
    }
  }
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
                      <button type="button" className="bg-red">
                        <Link
                          className="text-white"
                          to={`https://drive.google.com/uc?export=download&id=${book?.code}`}
                        >
                          Tải PDF
                        </Link>
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
      <div className="comment">
        <Title text="Bình luận" />
        <div>
          <div className="comment-list">
            {isLoadingComment && <div>Loading...</div>}
            {comments &&
              comments?.map((comment, index) => (
                <div className="comment-list-item" key={index}>
                  <div className="user-comment">
                    <div className="user-comment-img">
                      <img src={`${comment.imageUrl}`} alt="" />
                    </div>
                    <p>
                      <h4>{comment.username}</h4>
                      {comment.content}
                      <div className="time-comment">
                        <span>{""+getTime(comment.timeUp)}</span>
                      </div>
                    </p>
                  </div>
                </div>
              ))}
            {errorComment && (
              <div className="red book-message">
                <span>{""+errorComment}</span>
              </div>
            )}
          </div>
          <form>
            <div className="comment-form">
              <div className="comment-form-input">
                <label htmlFor="comment">Bình luận của bạn</label>
                <textarea
                  id="comment"
                  rows={2}
                  className=""
                  placeholder="Write a comment..."
                  required
                  defaultValue={""}
                />
              </div>
              <div className="btn-submit">
                <button
                  type="button"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                >
                  Post comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default book;
