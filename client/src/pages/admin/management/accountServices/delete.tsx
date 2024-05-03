import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../../store/store";
import { API_URL, USER } from "../../../../types";
import axios from "axios";
import toast from "react-hot-toast";

const accountDelete = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAppSelector((state) => state.user);
  const handleBack = () => {
    navigate("/admin/accounts");
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .delete(`${API_URL}${USER}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data) {
          navigate(`/admin/accounts`);
          toast.success("Delete this account successfully.");
        }
        else {
            console.log(res.status);
            toast.error("Delete this account unsuccessfully.");
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Delete this account unsuccessfully.");
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
        <div className="mt-2">
          <strong>Would you like to delete this account? </strong>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="btn-wrapper">
            <button type="submit" className="btn-primary">
              Confirm
            </button>
            <Link to="/admin/accounts" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default accountDelete;
