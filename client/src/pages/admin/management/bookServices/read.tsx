import { useEffect, useState } from "react"
import { API_URL, BOOK, BookDto } from "../../../../types"
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const read = () => {
    const navigate = useNavigate();
    useEffect(() => {
      fetchData();
    }, []);
    const { id } = useParams();
    const [value, setValue] = useState<BookDto>({
      id: 0,
      code: "",
      title: "",
      description: "",
      author: "",
      language: "",
      imageUrl: "",
      isPrivate: false,
      categoryId: 0,
      category: "",
    });
    const fetchData = () => {
      axios
        .get(API_URL + BOOK + "/" + id)
        .then((response) => {
          const book: BookDto = response.data;
          setValue(book);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const handleBack = () => {
      navigate("/admin/books");
    };
  return (
    <div className="detail-container" onClick={handleBack}>
      <div
        className="detail-content book-service"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {value && (
          <div className="book-wrapper">
            <div className="book-image-wrapper">
              <div className="book-image">
                <img
                  src={value?.imageUrl}
                  alt={value?.title}
                  className="mx-auto w-max-width h-auto"
                />
                {localStorage.getItem("token") === null && value?.isPrivate && (
                  <div className="book-image-subitem">Cần đăng nhập</div>
                )}
              </div>
              <div className="book-detail">
                <div className="book-title">{value?.title}</div>
                <div className="mt-2">Tác giả: {value?.author}</div>
                <div className="mt-2">Thể loại: {value?.category}</div>
                <div className="mt-2">Ngôn ngữ: {value?.language}</div>

                { value?.isPrivate && (
                  <div className="red book-message">
                    Vui lòng đăng nhập trước khi tải hoặc đọc ebook
                  </div>
                )}
              </div>
            </div>
            <div className="separate">{""}</div>
            <iframe
              src={`https://drive.google.com/file/d/${value.code}/preview`}
              allow="autoplay"
            ></iframe>
            <div className="separate">{""}</div>
            <div className="book-description-wrapper">
              <div className="book-description-title">{value?.title}</div>
              <p>{value?.description}</p>
            </div>
          </div>
        )}
        <div className="btn-wrapper mt-2">
          <Link to={`/admin/book/edit/${id}`} className="btn-primary">
            Edit
          </Link>
          <Link to="/admin/books" className="btn-secondary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default read