import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";
import { API_URL, CATEGORY, CategoryDto, SortOrder } from "../../types";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";

type SortFunctionProps = {
  tableData: CategoryDto[];
  sortKey: keyof CategoryDto;
  reverse: boolean;
};
interface ColumnProps<T extends Object> {
  Header: string;
  value: keyof T;
}

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
    Header: "ID",
    value: "id",
  },
  {
    Header: "Name",
    value: "name",
  },
];

const CategoryService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof CategoryDto>("id");

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
        //console.log(objectData);
      })
      .catch((err) => {
        setError("Không có thể loại nào");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="widget-container">
          <div className="dashboard-category-box">
            <h2 className="heading">List of Categories</h2>

            {isLoading && <span>Loading...</span>}
            {data && (
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.value}>
                        {column.Header}
                        <SortButton
                          columnKey={column.value}
                          onClick={() => changeSort(column.value)}
                          {...{ sortOrder, sortKey }}
                        />
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData().map((d, i) => (
                    <tr key={i}>
                      <td>{d.id}</td>
                      <td>{d.name}</td>
                      <td>
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
            {error && <span className="red">Có lỗi khi tải</span>}
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
