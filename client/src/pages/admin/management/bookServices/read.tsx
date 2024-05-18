import { useEffect, useState } from "react"
import { API_URL, BOOK, BookDto } from "../../../../types"
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineDownload } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";

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
      numOfDownloads: 0,
      numOfViews: 0,
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
          toast.error("Có lỗi xảy ra khi tải");
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
                <div
                  className="mt-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "2rem",
                    }}
                  >
                    <AiOutlineDownload /> {value?.numOfDownloads}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IoEyeOutline /> {value?.numOfViews}
                  </div>
                </div>
                {value?.isPrivate && (
                  <div className="red book-message">
                    Vui lòng đăng nhập trước khi tải hoặc đọc ebook
                  </div>
                )}
              </div>
            </div>
            <div className="separate">{""}</div>
            <div style={{padding: "2rem 20%"}}>
              <embed
                src={value?.code}
                type="application/pdf"
                width={100 + "%"}
                height={"500px"}
                style={{ textAlign: "center" }}
              />
            </div>
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