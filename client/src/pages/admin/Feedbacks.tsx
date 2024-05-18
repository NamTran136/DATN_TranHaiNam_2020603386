import { BsSearch } from "react-icons/bs";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FaRegBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoMdDownload, IoMdMenu } from "react-icons/io";
import { IoTrashBinSharp } from "react-icons/io5";
import axios from "axios";
import { API_URL, FEEDBACK, FeedbackDto } from "../../types";
import Pagination from "../../components/public/Pagination";
import { useAppSelector } from "../../store/store";
import toast from "react-hot-toast";
import { TimeString } from "../../utils/appUtils";
import AdminSidebarMobile from "../../components/admin/AdminSidebarMobile";

const Confirmation = () => {
  const { token } = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFold, setIsFold] = useState(false);
  const [data, setData] = useState<FeedbackDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
    console.log(token);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + FEEDBACK, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((objectData: FeedbackDto[]) => {
        setData(objectData);
        setTotalCount(Math.ceil(objectData.length / limit));
      })
      .catch((err) => {
        setError("List of Feedbacks unavailable");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleDownload = async (id: number) => {
    await axios({
      url: `${API_URL}${FEEDBACK}/DownloadFile/${id}`,
      method: "GET",
      responseType: "blob", // important
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const type = response.data.type.split("/")[1];
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        console.log(url);
        link.setAttribute("download", `${TimeString()}-downloadedFile.${type}`);
        document.body.appendChild(link);
        link.click();
        toast.success("Download file successfully");
      })
      .catch((ex) => {
        console.log(ex);
        toast.error("Download file failed");
      });
    
  }
  function handlePageChange(value: number | string) {
    if (value === "&laquo;" || value === "... ") {
      setPage(1);
    } else if (value === "&lsaquo;") {
      if (page !== 1) {
        setPage(page - 1);
      }
    } else if (value === "&rsaquo;") {
      if (page !== totalCount) {
        setPage(page + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setPage(totalCount);
    } else {
      if (typeof value === "number") {
        setPage(value);
      }
    }
  }

  const handleDeleteFeedback = (id: number) => {
    axios
      .delete(`${API_URL}${FEEDBACK}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          toast.success("Delete this feedback successfully.");
          fetchData();
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Delete this feedback unsuccessfully.");
      });
  }
  const handleActiveFeedback = (id: number) => {
    axios
      .put(`${API_URL}${FEEDBACK}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 204) {
          fetchData();
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Delete this feedback unsuccessfully.");
      });
  };
  return (
    <div
      className="admin-container"
      style={{
        gridTemplateColumns: isFold ? "1fr 15fr" : "1fr 4fr",
        gap: isFold ? "0.5rem" : "2rem",
      }}
    >
      <AdminSidebar isFold={isFold} setIsFold={setIsFold} />
      <AdminSidebarMobile isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="open-menu-icon">
        <IoMdMenu size={24} onClick={() => setIsOpen(!isOpen)} />
      </div>
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPodEp1Zyixlyx1Rrq6JJlPm0hgg1pFeLNrxgt2bkYw&s"
            alt="User"
          />
        </div>
        <div className="table-container">
          <div className="dashboard-category-box">
            <h2 className="heading">Feedback</h2>
            {isLoading && <span>Loading...</span>}
            {data && (
              <div className="feedback-item-list">
                {data
                  .slice((page - 1) * limit, (page - 1) * limit + limit)
                  .map((d, i) => (
                    <div className="feedback-item-container" key={i}>
                      <div className="feedback-item">
                        <div className="user-wrapper">
                          <img src={d.avatar} alt={d.username} />
                          <div className="user-wrapper">
                            <h4>{d.username}</h4>
                            <div>{d.createdAt}</div>
                          </div>
                        </div>
                        <div className="feedback-content">
                          <h3>{d.title}</h3>
                          <div>{d.content}</div>
                          {d.isActive ? (
                            <h4 style={{ color: "blue" }}>Active</h4>
                          ) : (
                            <h4>Proccessing</h4>
                          )}
                        </div>
                      </div>
                      <div className="action-wrapper">
                        <div
                          className="btn-feedback btn-active"
                          style={{
                            opacity: d.isActive ? "0.6" : "1",
                            cursor: d.isActive ? "default" : "pointer",
                          }}
                          onClick={() => {
                            if (!d.isActive) {
                              handleActiveFeedback(d.id);
                            }
                          }}
                        >
                          Process Status
                        </div>
                        <div className="active-feedback">
                          <div
                            className="blue"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: "0.2rem",
                            }}
                          >
                            <IoMdDownload
                              onClick={() => handleDownload(d.id)}
                              size={20}
                            />
                          </div>
                          Download
                        </div>
                        <div className="active-feedback">
                          <div
                            className="red"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: "0.2rem",
                            }}
                          >
                            <IoTrashBinSharp
                              onClick={() => handleDeleteFeedback(d.id)}
                              size={20}
                            />
                          </div>
                          Delete Feedback
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {error && <div className="red">{error}</div>}
            <Pagination
              totalPages={totalCount}
              page={page}
              limit={limit}
              siblings={1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
