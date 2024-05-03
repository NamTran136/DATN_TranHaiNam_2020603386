import { useEffect, useState } from "react";
import { API_URL, COMMENT, CommentDto } from "../../../../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../../store/store";

const read = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.user);
  const [data, setData] = useState<CommentDto>({
    id: 0,
    content: "",
    timeUp: "",
    username: "",
    imageUrl: "",
    title: ""
  });
  useEffect(() => {
    fetchData();
  }, []);
  const { id } = useParams();
  const fetchData = () => {
    axios
      .get(API_URL + COMMENT + "/" + id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const user: CommentDto = response.data;
        setData(user);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Có lỗi xảy ra khi tải");
      });
  };
  const handleBack = () => {
    navigate("/admin/comments");
  };
  return (
    <div className="detail-container" onClick={handleBack}>
      <div
        className="detail-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>Detail of Comment</h1>
        <div style={{display: "flex", alignItems: "center"}}>
            <div>
              <img style={{borderRadius: "50%", width: "5rem"}} src={`${data?.imageUrl}`} alt="" />
            </div>
            <div>
              <h4>{data.username}</h4>
              {data.content}
              <div>
                <span>{data?.timeUp}</span>
              </div>
            </div>
          </div>
        <div className="btn-wrapper mt-2">
          <Link to={`/admin/comment/delete/${id}`} className="btn-primary">
            Delete
          </Link>
          <Link to="/admin/comments" className="btn-secondary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default read;
