import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";

const PaginationComponent = ({ meta, onPageChange }) => {

  const pageNumbers = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="prev paginate_btn"
        onClick={() => onPageChange(meta.currentPage - 1)}
        disabled={meta.currentPage === 1}
      >
        <FaChevronLeft />
      </button>
        <ul className="paginate_nums">
          {pageNumbers.map((page) => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={page === meta.currentPage ? "active" : ""}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      <button
        className="next paginate_btn"
        onClick={() => onPageChange(meta.currentPage + 1)}
        disabled={meta.currentPage === meta.totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default PaginationComponent;
