import { useEffect, useState } from "react";
import { API_URL, BOOK, BookDto } from "../../../../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";
import toast from "react-hot-toast";

const deleteCategory = () => {
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
    numOfDownloads: 0,
    numOfViews: 0,
    category: "",
  });
  const fetchData = () => {
    axios
      .get(API_URL + BOOK + `/${id}`)
      .then((response) => {
        const book: BookDto = response.data;
        setValue(book);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Có lỗi xảy ra khi tải");
      });
  };
  const { token } = useAppSelector((state) => state.user);
  const handleBack = () => {
    navigate("/admin/books");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .delete(`${API_URL}${BOOK}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          toast.success("Delete this book successfully.");
          setTimeout(() => {
            navigate(`/admin/books`)
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Delete this book unsuccessfully.");
      });
  };
  return (
    <div className="detail-container" onClick={handleBack}>
      <div
        className="detail-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {value && (
          <>
            <h1>Detail of Book</h1>
            <div className="mt-2">
              <strong>Code: </strong>
              {value.code}
            </div>
            <div className="mt-2">
              <strong>Name: </strong>
              {value.title}
            </div>
            <div className="mt-2">
              <strong>Author: </strong>
              {value.author}
            </div>
            <div className="mt-2">
              <strong>Would you like to delete this? </strong>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <div className="btn-wrapper">
            {value && (
              <button type="submit" className="btn-primary">
                Confirm
              </button>
            )}
            <Link to="/admin/books" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default deleteCategory;
