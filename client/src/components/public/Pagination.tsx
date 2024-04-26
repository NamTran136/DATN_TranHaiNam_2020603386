import { returnPaginationRange } from '../../utils/appUtils';

interface PaginationProps {
    totalPages: number;
    page: number;
    limit: number;
    siblings: number;
    onPageChange: (value: number | string) => void;
}

export default function Pagination({totalPages, page, limit, siblings, onPageChange} : PaginationProps) {
  let array = returnPaginationRange(totalPages, page, limit, siblings);
    return (
      <ul className="pagination">
        <li className="pagination-item">
          <button
            className="pagination-item__link"
            onClick={() => onPageChange("&laquo;")}
          >
            &laquo;
          </button>
        </li>
        <li className="pagination-item">
          <button
            className="pagination-item__link"
            onClick={() => onPageChange("&lsaquo;")}
          >
            &lsaquo;
          </button>
        </li>
        {array.map((value) => {
          if (value === page) {
            return (
              <li
                key={value}
                className="pagination-item pagination-item--active"
              >
                <button
                  onClick={() => onPageChange(value)}
                  className="pagination-item__link"
                >
                  {value}
                </button>
              </li>
            );
          } else {
            return (
              <li key={value} className="pagination-item">
                <button
                  className="pagination-item__link"
                  onClick={() => onPageChange(value)}
                >
                  {value}
                </button>
              </li>
            );
          }
        })}

        <li className="pagination-item">
          <button
            className="pagination-item__link"
            onClick={() => onPageChange("&rsaquo;")}
          >
            &rsaquo;
          </button>
        </li>
        <li className="pagination-item">
          <button
            className="pagination-item__link"
            onClick={() => onPageChange("&raquo;")}
          >
            &raquo;
          </button>
        </li>
      </ul>
    );
}
