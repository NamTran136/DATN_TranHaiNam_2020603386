import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";
import {
  API_URL,
  ColumnProps,
  SortOrder,
  CommentDto,
  COMMENT
} from "../../types";
import { Link } from "react-router-dom";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useAppSelector } from "../../store/store";
import Pagination from "../../components/public/Pagination";
import { FaRegBell } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import AdminSidebarMobile from "../../components/admin/AdminSidebarMobile";
import { IoMdMenu } from "react-icons/io";

type SortFunctionProps = {
  tableData: CommentDto[];
  sortKey: keyof CommentDto;
  reverse: boolean;
};

function SortButton({
  sortOrder,
  columnKey,
  sortKey,
  onClick,
}: {
  sortOrder: SortOrder;
  columnKey: string;
  sortKey: keyof CommentDto;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        sortKey === columnKey && sortOrder === "desc" ? "" : "rotate-180"
      }`}
    >
      <FaCircleArrowUp size={16} />
    </button>
  );
}

const columns: ColumnProps<CommentDto>[] = [
  {
    Header: "S.No",
    value: "id",
  },
  {
    Header: "Content",
    value: "content",
  },
  {
    Header: "Avatar",
    value: "imageUrl",
  },
  {
    Header: "Username",
    value: "username",
  },
  {
    Header: "Book has comments",
    value: "title"
  },
  {
    Header: "Created At",
    value: "timeUp"
  }
];

const Comments = () => {
  const [isFold, setIsFold] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CommentDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof CommentDto>("id");
const [page, setPage] = useState(1);
const [limit] = useState(5);
const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + COMMENT, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((objectData: CommentDto[]) => {
        setData(objectData);
        setTotalCount(Math.ceil(objectData.length / limit));
      })
      .catch((err) => {
        setError("List of Comments unavailable");
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
  function sortData({ tableData, sortKey, reverse }: SortFunctionProps) {
    if (!sortKey) return tableData;
    const sortedData = tableData.sort(
      (a: CommentDto, b: CommentDto) => {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      }
    );
    if (reverse) {
      return sortedData.reverse();
    }
    return sortedData;
  }
  const sortedData = useCallback(
    () => sortData({ tableData: data, sortKey, reverse: sortOrder === "desc" }),
    [data, sortKey, sortOrder]
  );
  function changeSort(key: keyof CommentDto) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  }
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
            <h2 className="heading">List of Comments</h2>

            {isLoading && <span>Loading...</span>}
            {data && (
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.value}>
                        <div className="th-wrapper">
                          {column.Header}
                          <SortButton
                            columnKey={column.value}
                            onClick={() => changeSort(column.value)}
                            {...{ sortOrder, sortKey }}
                          />
                        </div>
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData()
                    .slice((page - 1) * limit, (page - 1) * limit + limit)
                    .map((d, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{d.content}</td>
                        <td>
                          <img
                            style={{ borderRadius: "50%" }}
                            src={d.imageUrl}
                            alt={d.username}
                          />
                        </td>
                        <td>{d.username}</td>
                        <td>{d.title}</td>
                        <td>{d.timeUp}</td>
                        <td
                          className="btn-wrapper"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100px",
                          }}
                        >
                          <Link
                            className="bg-blue"
                            to={`/admin/comment/read/${d.id}`}
                          >
                            Read
                          </Link>
                          <Link
                            className="bg-red"
                            to={`/admin/comment/delete/${d.id}`}
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            <Pagination
              totalPages={totalCount}
              page={page}
              limit={limit}
              siblings={1}
              onPageChange={handlePageChange}
            />
            {error && <span className="red">Có lỗi khi tải</span>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Comments;
