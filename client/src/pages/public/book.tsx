import { useEffect, useState } from "react";
import { API_URL, BOOK, BookDto, FBOOK, WBOOK } from "../../types";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Title from "../../components/public/Title";
import Menu from "../../components/public/Menu";
import SubItem from "../../components/public/SubItem";
import Comment from "../../components/public/Comment";
import { useAppSelector } from "../../store/store";
import toast from "react-hot-toast";
import { IoMdHeart } from "react-icons/io";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";
import { AiOutlineDownload } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";

const shareUrl = window.location.href;
const title = "Share book"

const book = () => {
  const { user, token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [book, setBook] = useState<BookDto>();
  const [error, setError] = useState<string | null>(null);

  const { bookId } = useParams();
  let id=0;
  if (bookId === undefined) {
    id=0;
  } else {
    id=parseInt(bookId);
  }
  useEffect(() => {
    fetchData();
    checkLiked(id, user.email);
    localStorage.setItem("previousUrl", window.location.href);
  }, [token]);

  const fetchData = async () => {
    setIsLoading(true);
    await axios
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

  const checkLiked = async (id: number, email: string) => {
    await axios
      .get(API_URL + FBOOK + `/bookId=${id}/email=${email}`)
      .then((response) => {
        setIsLiked(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const HandleSwapper = async () => {
    if(user.email === "") {
      toast.error("Vui lòng đăng nhập trước khi dùng tính năng yêu thích");
      return;
    }
    if (isLiked) {
      await axios
        .delete(API_URL + FBOOK + `/bookId=${bookId}/email=${user.email}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.status);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .post(
          API_URL + FBOOK,
          {
            email: user.email,
            bookId: parseInt(bookId || "0"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.status);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setIsLiked(!isLiked);
  };

  const HandleDownload = async () => {
    await axios
      .put(
        API_URL + BOOK + "/downloadingbook",
        {
          email: user.email,
          bookId: parseInt(bookId || "0"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.status);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const HandleView = async () => {
    await axios
      .put(API_URL + BOOK + `/readingbook=${bookId}`)
      .then((response) => {
        console.log(response.status);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const HandleAddWatchedBook = async () => {
    await axios
      .post(API_URL + WBOOK, {
          email: user.email,
          bookId: parseInt(bookId || "0"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      .then((response) => {
        console.log(response.status);
      })
      .catch((err) => {
        console.log(err.message);
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
                <div
                  className="mt-2"
                  style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginRight: "2rem" }}>
                    <AiOutlineDownload /> {book?.numOfDownloads}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IoEyeOutline /> {book?.numOfViews}
                  </div>
                </div>
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
                            HandleDownload();
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
                      <button type="button" className="bg-blue" onClick={() => {
                        HandleView();
                        if(token) {
                          console.log(123);
                          HandleAddWatchedBook();
                        }
                      }}>
                        <Link
                          className="text-white"
                          to={`/reading-book/${book?.id}`}
                          style={{display: "block",width: '100%', height: '100%', lineHeight: "32px"}}
                        >
                          Đọc sách
                        </Link>
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-2 social-media-share">
                  <div className="like-icon" onClick={HandleSwapper}>
                    {!isLiked ? (
                      <IoMdHeart
                        size={32}
                        style={{
                          borderRadius: "50%",
                          color: "#000",
                        }}
                      />
                    ) : (
                      <IoMdHeart
                        size={32}
                        style={{
                          borderRadius: "50%",
                          color: "red",
                        }}
                      />
                    )}
                  </div>
                  <div className="social-media-wrapper">
                    <div>
                      <FacebookShareButton url={shareUrl}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                    </div>
                    <div>
                      <TwitterShareButton url={shareUrl} title={title}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                    </div>
                    <div>
                      <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                    </div>
                  </div>
                </div>
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
