import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";
import {
  API_URL,
  ColumnProps,
  SortOrder,
  USER,
  UserPrivateDto,
} from "../../types";
import { Link } from "react-router-dom";
import { FaCircleArrowUp } from "react-icons/fa6";
import { useAppSelector } from "../../store/store";

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
    Header: "ID",
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
  const { token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UserPrivateDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof UserPrivateDto>("id");

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
      })
      .catch((err) => {
        setError("List of Accounts unavailable");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="widget-container">
          <div className="dashboard-category-box">
            <h2 className="heading">List of Accounts</h2>

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
                  {sortedData().map((d, i) => (
                    <tr key={i}>
                      <td>{d.id}</td>
                      <td>{d.username}</td>
                      <td>{d.email}</td>
                      <td>
                        <img style={{borderRadius: "50%"}} src={d.imageUrl} alt={d.username} />
                      </td>
                      <td className="btn-wrapper">
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
            {error && <span className="red">Có lỗi khi tải</span>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountService;
