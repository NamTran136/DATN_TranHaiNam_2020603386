import { useEffect, useState } from "react";
import { API_URL, BOOK, BookDto, IMAGE_URL } from "../../types";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Title from "../../components/public/Title";
import Menu from "../../components/public/Menu";
import SubItem from "../../components/public/SubItem";

const book = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<BookDto>();
  const [error, setError] = useState<string | null>(null);

  const { bookId } = useParams();
  useEffect(() => {
    fetchData();
  }, [bookId]);

  const [hour, setHour] = useState(0);
  const [day, setDay] = useState(0);
  const mocThoiGian = new Date("2024-03-30T12:00:21");
  useEffect(() => {
    const currentTime = new Date();
    const distance = currentTime.getTime() - mocThoiGian.getTime();
    const gio = Math.round(distance / (1000 * 60 * 60));
    const day = Math.round(distance / (1000 * 60 * 60 * 24));
    setHour(gio);
    setDay(day);
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
                  src={`${IMAGE_URL}${book?.code}/image.png`}
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
            <div className="comment-list-item">
              <div className="user-comment">
                <div className="user-comment-img">
                  <img
                    src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                    alt=""
                  />
                </div>
                <p>
                  <h4>Tran Hai Nam</h4>
                  Hello world!
                  <div className="time-comment">
                    {day < 1 ? `${hour} giờ` : `${day} ngày`}
                  </div>
                </p>
              </div>
            </div>
            <div className="comment-list-item">
              <div className="user-comment">
                <div className="user-comment-img">
                  <img
                    src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                    alt=""
                  />
                </div>
                <p>
                  <h4>Tran Hai Nam</h4>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Maxime in, deleniti, consequatur reiciendis dolorem dolorum
                  voluptatum libero et magni quidem impedit sequi voluptates!
                  Labore omnis maxime aut distinctio placeat qui! Fuga dolores,
                  et iste temporibus doloribus velit non aspernatur cum neque
                  animi eligendi aliquam earum vero nihil enim odio possimus eum
                  sunt nesciunt harum? Vero accusamus vel illum nihil corporis!
                  Ipsa commodi ad provident, eius modi quos unde quibusdam
                  dignissimos inventore eos, aliquam saepe nostrum temporibus
                  vitae atque incidunt excepturi sequi voluptatibus nisi
                  voluptatem accusamus sed consequatur aspernatur? Qui, ipsam.
                  Nesciunt repellendus quia itaque, autem, similique a quod
                  beatae cumque nihil minus, delectus quisquam perspiciatis
                  ipsum optio. Repellendus quod voluptas eos, aspernatur quidem
                  ipsum at necessitatibus, rerum quo dolore autem. Pariatur id,
                  debitis magni impedit tempora voluptatem nulla atque, rem eos
                  labore perferendis officia esse. Culpa dolor neque, quas
                  ipsam, quos suscipit omnis accusantium reiciendis expedita
                  vitae similique cupiditate itaque! Repudiandae corrupti quos
                  eveniet iste, perferendis sit vero quis voluptatum cum minus
                  est error earum distinctio voluptates tenetur in. Animi minus
                  nostrum minima ipsum natus reprehenderit veniam aut nisi
                  possimus?
                  <div className="time-comment">
                    {day < 1 ? `${hour} giờ` : `${day} ngày`}
                  </div>
                </p>
              </div>
            </div>
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
