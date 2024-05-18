import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { FaPlus, FaRegBell } from "react-icons/fa";
import { API_URL, BLOG, BlogDto } from "../../types";
import axios from "axios";
import toast from "react-hot-toast";
import Pagination from "../../components/public/Pagination";
import { BsSearch } from "react-icons/bs";
import AdminSidebarMobile from "../../components/admin/AdminSidebarMobile";
import { IoMdMenu } from "react-icons/io";

const Blogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFold, setIsFold] = useState(false);
  const [data, setData] = useState<BlogDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + BLOG)
      .then((response) => {
        return response.data;
      })
      .then((objectData: BlogDto[]) => {
        setData(objectData);
        setTotalCount(Math.ceil(objectData.length / limit));
      })
      .catch((err) => {
        setError("List of Blogs unavailable");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
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
  const handleDeleteBlog = async (id: number) => {
    const { status } = await axios.delete(API_URL + BLOG + `/${id}`);
    if (status === 204) {
      toast.success("Deleted this blog successfully");
      fetchData();
    } else {
      toast.error("Deleted unsuccessfully");
    }
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
          <Link
            to="/admin/blog/new"
            className="create-category-btn"
            style={{ top: "4.2rem" }}
          >
            <FaPlus />
          </Link>

          {/* Table  */}
          <div className="table-content">
            <h2 className="heading">List of Blogs</h2>
            {isLoading && <span>Loading...</span>}

            {data && (
              <div className="table-wrapper">
                {/* table  */}
                <table className="shadow">
                  {/* thead  */}
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Thumbnail</th>
                      <th scope="col">Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Date</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  {/* tbody  */}
                  <tbody>
                    {data
                      .slice((page - 1) * limit, (page - 1) * limit + limit)
                      .map((d, i) => (
                        <tr key={i}>
                          {/* S.No   */}
                          <td>{i + 1}</td>
                          {/* Blog Thumbnail  */}
                          <td scope="row">
                            {/* thumbnail  */}
                            <img src={d.fileUrl} alt="thumbnail" />
                          </td>
                          {/* Blog Title  */}
                          <td>{d.title}</td>
                          {/* Blog Category  */}
                          <td>{d.description}</td>
                          {/* Blog Date  */}
                          <td>{d.time}</td>
                          {/* Delete Blog  */}
                          <td>
                            <button onClick={() => handleDeleteBlog(d.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <Pagination
                  totalPages={totalCount}
                  page={page}
                  limit={limit}
                  siblings={1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
            {error && <span className="red">{"..." + error}</span>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blogs;
