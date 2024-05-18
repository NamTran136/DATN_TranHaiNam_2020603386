import { useEffect, useState } from "react";
import { API_URL, USER, UserPrivateDto } from "../../../../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../../store/store";

const read = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.user);
  const [data, setData] = useState<UserPrivateDto>({
    id: 0,
    username: "",
    email: "",
    imageUrl: ""
  });
  useEffect(() => {
    fetchData();
  }, []);
  const { id } = useParams();
  const fetchData = () => {
    axios
      .get(API_URL + USER + "/" + id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const user: UserPrivateDto = response.data;
        setData(user);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Có lỗi xảy ra khi tải");
      });
  };
  const handleBack = () => {
    navigate("/admin/accounts");
  };
  return (
    <div className="detail-container" onClick={handleBack}>
      <div
        className="detail-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>Detail of Account</h1>
        <div className="mt-2">
          <strong>ID: </strong>
          {data.id}
        </div>
        <div className="mt-2">
          <strong>Username: </strong>
          {data.username}
        </div>
        <div className="mt-2">
          <strong>Email: </strong>
          {data.email}
        </div>
        <div className="mt-2">
          <div>
            <strong>Avatar: </strong>
          </div>
          <img src={data.imageUrl} alt={data.username} style={{width: "5rem", height: "5rem", borderRadius: "50%", border: "1px solid #ccc"}} />
        </div>
        <div className="btn-wrapper mt-2">
          <Link to={`/admin/account/delete/${id}`} className="btn-primary">
            Delete
          </Link>
          <Link to="/admin/accounts" className="btn-secondary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default read;
