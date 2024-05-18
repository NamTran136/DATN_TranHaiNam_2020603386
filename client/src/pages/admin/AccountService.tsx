import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";
import {
  API_URL,
  ColumnProps,
  COMMON,
  SortOrder,
  USER,
  UserPrivateDto,
} from "../../types";
import { Link } from "react-router-dom";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useAppSelector } from "../../store/store";
import Pagination from "../../components/public/Pagination";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";

type SortFunctionProps = {
  tableData: UserPrivateDto[];
  sortKey: keyof UserPrivateDto;
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
  sortKey: keyof UserPrivateDto;
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

const columns: ColumnProps<UserPrivateDto>[] = [
  {
    Header: "S.No",
    value: "id",
  },
  {
    Header: "Username",
    value: "username",
  },
  {
    Header: "Email",
    value: "email",
  },
  {
    Header: "Avatar",
    value: "imageUrl",
  }
];

const AccountService = () => {
  const [isFold, setIsFold] = useState(false);
  const { token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UserPrivateDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof UserPrivateDto>("id");

  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + USER, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .then((objectData: UserPrivateDto[]) => {
        setData(objectData);
        setTotalCount(Math.ceil(objectData.length / limit));
      })
      .catch((err) => {
        setError("List of Accounts unavailable");
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
    const sortedData = tableData.sort((a: UserPrivateDto, b: UserPrivateDto) => {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    });
    if (reverse) {
      return sortedData.reverse();
    }
    return sortedData;
  }
  const sortedData = useCallback(
    () => sortData({ tableData: data, sortKey, reverse: sortOrder === "desc" }),
    [data, sortKey, sortOrder]
  );
  function changeSort(key: keyof UserPrivateDto) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  }
  const [searchInput, setSearchInput] = useState({
    input: "",
    index: "1",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, status } = await axios.get(
      API_URL +
        COMMON +
        `/searchuser=${searchInput.input}/${searchInput.index}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (status === 200) {
      setData(data);
      setSearchInput({
        input: "",
        index: "1",
      });
    } else {
      console.log("An error occurred!");
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
      <main className="dashboard">
        <div className="bar">
          <form onSubmit={handleSubmit}>
            <button type="submit">
              <BsSearch />
            </button>
            <input
              type="text"
              placeholder="Search for data, users, docs"
              value={searchInput.input}
              onChange={(e) =>
                setSearchInput({ ...searchInput, input: e.target.value })
              }
            />
            <div className="select-container">
              <label htmlFor="select">Search By:</label>
              <select
                value={searchInput.index}
                id="select"
                onChange={(e) =>
                  setSearchInput({ ...searchInput, index: e.target.value })
                }
              >
                <option value={1}>Username</option>
                <option value={2}>Email</option>
              </select>
            </div>
          </form>
          <FaRegBell />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPodEp1Zyixlyx1Rrq6JJlPm0hgg1pFeLNrxgt2bkYw&s"
            alt="User"
          />
        </div>
        <div className="table-container">
          <div className="dashboard-category-box">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 className="heading">List of Accounts</h2>
              <button
                style={{
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "rgb(0,115,255)",
                }}
                onClick={fetchData}
              >
                Refresh
              </button>
            </div>

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
                        <td>{d.username}</td>
                        <td>{d.email}</td>
                        <td>
                          <img
                            style={{ borderRadius: "50%" }}
                            src={d.imageUrl}
                            alt={d.username}
                          />
                        </td>
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
                            to={`/admin/account/read/${d.id}`}
                          >
                            Read
                          </Link>
                          <Link
                            className="bg-red"
                            to={`/admin/account/delete/${d.id}`}
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

export default AccountService;
