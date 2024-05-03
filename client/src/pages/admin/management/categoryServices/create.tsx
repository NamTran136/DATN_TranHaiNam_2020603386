import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, CATEGORY, CategoryToEditDto } from "../../../../types";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";
import toast from "react-hot-toast";

const create = () => {
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.user);
    const [value, setValue] = useState<CategoryToEditDto>({
        name: ""
    });
    const handleBack = () => {
        navigate("/admin/categories");
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      axios.post(`${API_URL}${CATEGORY}`, value, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        }
      }).then(res => {
        if(res.status === 204) {
            toast.success("Add category successfully.");
            setValue({...value, name: ""})
        }
      })
      .catch(err => {
        console.log(err.message);
        toast.error("Add a category unsuccessfully.");
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
        <h1>Add Category</h1>
        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn-primary">Submit</button>
            <Link to="/admin/categories" className="btn-secondary">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default create