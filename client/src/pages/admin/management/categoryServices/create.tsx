import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, CATEGORY, CategoryToEditDto } from "../../../../types";
import axios from "axios";
import { useAppSelector } from "../../../../store/store";

const create = () => {
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.user);
    const [value, setValue] = useState<CategoryToEditDto>({
        name: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
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
            setMessage("Add a category successfully.");
            setError("");
            setValue({...value, name: ""})
        }
      })
      .catch(err => {
        console.log(err.message);
        setError("Add a category unsuccessfully.");
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
        <div className="mt-2">
          {message && <span className="green">{message}</span>}
          {error && <span className="red">{error}</span>}
        </div>
      </div>
    </div>
  );
}

export default create