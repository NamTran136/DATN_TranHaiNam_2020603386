import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL, CATEGORY, CategoryDto } from "../../../../types";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";
import toast from "react-hot-toast";

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

  const handleBack = () => {
    navigate("/admin/categories");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          toast.success("Edit a category successfully.");
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Edit a category unsuccessfully.");
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
      </div>
    </div>
  );
};

export default update;
