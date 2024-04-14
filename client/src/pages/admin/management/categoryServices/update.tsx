import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL, CATEGORY, CategoryDto } from "../../../../types";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";

const update = () => {
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);
  const { id } = useParams();
  const [value, setValue] = useState<CategoryDto>({
    id: 0,
    name: "",
  });
  const fetchData = () => {
    axios
      .get(API_URL + CATEGORY + "/" + id)
      .then((response) => {
        const category: CategoryDto = response.data;
        setValue(category);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const { token } = useAppSelector((state) => state.user);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleBack = () => {
    navigate("/admin/categories");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    axios
      .put(`${API_URL}${CATEGORY}`, value, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          setMessage("Edit a category successfully.");
          setError("");
        }
      })
      .catch((err) => {
        console.log(err.message);
        setError("Edit a category unsuccessfully.");
        setMessage("");
      });
  };
  return (
    <div className="create-container" onClick={handleBack}>
      <div
        className="create-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>Edit Category</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="id">ID</label>
            <input
              value={value.id}
              type="text"
              name="id"
              readOnly
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="name">Name</label>
            <input
              value={value.name}
              type="text"
              name="name"
              onChange={(e) => setValue({ ...value, name: e.target.value })}
            />
          </div>
          <div className="btn-wrapper">
            <button type="submit" className="btn-primary">
              Submit
            </button>
            <Link to="/admin/categories" className="btn-secondary">
              Back
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

export default update;
