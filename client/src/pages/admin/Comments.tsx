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
    Header: "ID",
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
  const { token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CommentDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof CommentDto>("id");

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
      })
      .catch((err) => {
        setError("List of Comments unavailable");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="widget-container">
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
                  {sortedData().map((d, i) => (
                    <tr key={i}>
                      <td>{d.id}</td>
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
                      <td className="btn-wrapper">
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
            {error && <span className="red">Có lỗi khi tải</span>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Comments;
