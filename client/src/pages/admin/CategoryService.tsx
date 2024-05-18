import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";
import { API_URL, CATEGORY, CategoryDto, ColumnProps, SortOrder } from "../../types";
import { Link } from "react-router-dom";
import { FaPlus, FaRegBell } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";
import Pagination from "../../components/public/Pagination";
import { BsSearch } from "react-icons/bs";
import AdminSidebarMobile from "../../components/admin/AdminSidebarMobile";
import { IoMdMenu } from "react-icons/io";

type SortFunctionProps = {
  tableData: CategoryDto[];
  sortKey: keyof CategoryDto;
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
  sortKey: keyof CategoryDto;
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

const columns: ColumnProps<CategoryDto>[] = [
  {
    Header: "S.No",
    value: "id",
  },
  {
    Header: "Name",
    value: "name",
  },
];

const CategoryService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFold, setIsFold] = useState(false);
  const [data, setData] = useState<CategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof CategoryDto>("id");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(API_URL + CATEGORY)
      .then((response) => {
        return response.data;
      })
      .then((objectData: CategoryDto[]) => {
        setData(objectData);
        setTotalCount(Math.ceil(objectData.length / limit));
      })
      .catch((err) => {
        setError("List of Categories unavailable");
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
    const sortedData = tableData.sort((a: CategoryDto, b: CategoryDto) => {
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
  function changeSort(key: keyof CategoryDto) {
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
            <h2 className="heading">List of Categories</h2>

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
                        <td>{d.name}</td>
                        <td className="btn-wrapper">
                          <Link
                            className="bg-blue"
                            to={`/admin/category/read/${d.id}`}
                          >
                            Read
                          </Link>
                          <Link
                            className="bg-orange"
                            to={`/admin/category/edit/${d.id}`}
                          >
                            Edit
                          </Link>
                          <Link
                            className="bg-red"
                            to={`/admin/category/delete/${d.id}`}
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
            {error && <div className="red">{error}</div>}
          </div>
        </div>
        <Link to="/admin/category/new" className="create-category-btn">
          <FaPlus />
        </Link>
      </main>
    </div>
  );
};

export default CategoryService;
