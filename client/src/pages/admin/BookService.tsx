import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";
import { API_URL, BOOK, BookDto, ColumnProps, SortOrder } from "../../types";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";
import Pagination from "../../components/public/Pagination";

type SortFunctionProps = {
  tableData: BookDto[];
  sortKey: keyof BookDto;
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
  sortKey: keyof BookDto;
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

const columns: ColumnProps<BookDto>[] = [
  {
    Header: "Name",
    value: "title",
  },
  {
    Header: "Code",
    value: "code",
  },
  {
    Header: "Author",
    value: "author",
  },
  {
    Header: "Language",
    value: "language",
  },
  {
    Header: "Description",
    value: "description",
  },
  {
    Header: "Image",
    value: "imageUrl",
  },
  {
    Header: "Downloads",
    value: "numOfDownloads",
  },
  {
    Header: "Views",
    value: "numOfViews",
  },
  {
    Header: "State",
    value: "isPrivate",
  },
  {
    Header: "Category",
    value: "category",
  },
];

const BookService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFold, setIsFold] = useState(false);
  const [data, setData] = useState<BookDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof BookDto>("id");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + BOOK)
      .then((response) => {
        return response.data;
      })
      .then((objectData: BookDto[]) => {
        setData(objectData);
        setTotalCount(Math.ceil(objectData.length / limit));
      })
      .catch((err) => {
        setError("Không có sách nào");
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
    const sortedData = tableData.sort((a: BookDto, b: BookDto) => {
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
  function changeSort(key: keyof BookDto) {
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
      <main className="dashboard">
        <div className="widget-container">
          <div className="dashboard-category-box">
            <h2 className="heading">List of Books</h2>

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
                        <td>{d.title}</td>
                        <td>{d.code}</td>
                        <td>{d.author}</td>
                        <td>{d.language}</td>
                        <td>{d.description}</td>
                        <td>
                          <img src={d.imageUrl} alt="Image Book" />
                        </td>
                        <td>{d.numOfDownloads}</td>
                        <td>{d.numOfViews}</td>
                        <td>{d.isPrivate ? "Private" : "Public"}</td>
                        <td>{d.category}</td>
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
                            to={`/admin/book/read/${d.id}`}
                          >
                            Read
                          </Link>
                          <Link
                            className="bg-orange"
                            to={`/admin/book/edit/${d.id}`}
                          >
                            Edit
                          </Link>
                          <Link
                            className="bg-red"
                            to={`/admin/book/delete/${d.id}`}
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
        <Link to="/admin/book/new" className="create-category-btn">
          <FaPlus />
        </Link>
      </main>
    </div>
  );
};

export default BookService;
