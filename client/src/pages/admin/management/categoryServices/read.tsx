import { useEffect, useState } from "react"
import { API_URL, CATEGORY, CategoryDto } from "../../../../types"
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const read = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<CategoryDto>({
        id: 0,
        name: "",
    });
    useEffect(()=>{
        fetchData();
    },[]);
    const {id} = useParams();
    const fetchData = () => {
        axios
          .get(API_URL + CATEGORY + "/" + id)
          .then((response) => {
            const category: CategoryDto = response.data;
            setData(category);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Có lỗi xảy ra khi tải");
          });
    }
    const handleBack = () => {
      navigate("/admin/categories");
    };
  return (
    <div className="detail-container" onClick={handleBack}>
      <div
        className="detail-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>Detail of Category</h1>
        <div className="mt-2">
          <strong>ID: </strong>
          {data.id}
        </div>
        <div className="mt-2">
          <strong>Name: </strong>
          {data.name}
        </div>
        <div className="btn-wrapper mt-2">
          <Link to={`/admin/category/edit/${id}`} className="btn-primary">
            Edit
          </Link>
          <Link to="/admin/categories" className="btn-secondary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default read