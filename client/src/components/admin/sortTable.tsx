import { FaCircleArrowUp } from "react-icons/fa6";
import { SortOrder } from "../../types";
import { MouseEventHandler, useCallback, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";

type SortFunctionProps<T> = {
  tableData: T[];
  sortKey: keyof T;
  reverse: boolean;
};
export type HeaderProps<T> = {
  key: keyof T;
  value: string;
};
type SortTableProps<T> = {
  data: T[];
  headers: HeaderProps<T>[];
  isAddBtn?: boolean;
  isEditBtn?: boolean;
  isDeleteBtn?: boolean;
  isViewBtn?: boolean;
};
function SortButton<T>({
  sortOrder,
  columnKey,
  sortKey,
  onClick,
}: {
  sortOrder: SortOrder;
  columnKey: keyof T;
  sortKey: keyof T;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        sortKey === columnKey && sortOrder === "desc" ? "rotate-180" : ""
      }`}
    >
      <FaCircleArrowUp size={16} />
    </button>
  );
}
function getValueByKey<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
function sortTable<T>({
  data,
  headers,
  isAddBtn,
  isEditBtn,
  isDeleteBtn,
  isViewBtn,
}: SortTableProps<T>) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortKey, setSortKey] = useState<keyof T>("id" as keyof T);
  function sortData({ tableData, sortKey, reverse }: SortFunctionProps<T>) {
    if (!sortKey) return tableData;
    const sortedData = tableData.sort((a: T, b: T) => {
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
  function changeSort(key: keyof T) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-fixed">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {headers.map((col, index) => (
              <th scope="col" className="px-6 py-3" key={index}>
                <div className="flex items-center">
                  <span className="mr-2">{col.value}</span>
                  <SortButton
                    columnKey={col.key}
                    onClick={() => changeSort(col.key)}
                    {...{ sortOrder, sortKey }}
                  />
                </div>
              </th>
            ))}
            <th scope="col" className="px-6 py-3">
              {isAddBtn && (
                <div className="cursor-pointer" onClick={() => {}}>
                  <IoMdAddCircle color="blue" size={26} />
                </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData().map((item, index) => {
            return (
              <tr key={`row-${index}`}>
                {headers.map((header, index2) => {
                  return (
                    <td key={`cell-${index2}`}>
                      {item[header.key]+''}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default sortTable;
