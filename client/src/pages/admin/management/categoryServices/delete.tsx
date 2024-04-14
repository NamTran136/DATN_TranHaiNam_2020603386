import { useEffect, useState } from "react";
import { API_URL, CATEGORY, CategoryDto } from "../../../../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";

const deleteCategory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CategoryDto>({
    id: 0,
    name: "",
  });
  useEffect(() => {
    fetchData();
  }, []);
  const { id } = useParams();
  const { token } = useAppSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fetchData = () => {
    axios
      .get(API_URL + CATEGORY + "/" + id)
      .then((response) => {
        const category: CategoryDto = response.data;
        setData(category);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleBack = () => {
    navigate("/admin/categories");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    axios
      .delete(`${API_URL}${CATEGORY}?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          setMessage("Delete this category successfully.");
          setError("");
          setTimeout(() => {
            navigate(`/admin/categories`)
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setError("Delete this category unsuccessfully.");
        setMessage("");
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
        {data && (
          <>
            <h1>Detail of Category</h1>
            <div className="mt-2">
              <strong>ID: </strong>
              {data.id}
            </div>
            <div className="mt-2">
              <strong>Name: </strong>
              {data.name}
            </div>
            <div className="mt-2">
              <strong>Would you like to delete this? </strong>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <div className="btn-wrapper">
            {data && <button type="submit" className="btn-primary">
              Confirm
            </button>}
            <Link to="/admin/categories" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
        <div className="mt-2">
          {message && <span className="green">{message}</span>}
          {error && <span className="red">{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default deleteCategory;
