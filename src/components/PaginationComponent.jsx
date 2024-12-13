import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";

const PaginationComponent = ({ meta, onPageChange }) => {

  const { currentPage, totalPages } = meta;

  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) onPageChange(page);
  };

  return (
    <div className="pagination">
      <button
        className="prev paginate_btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={meta.currentPage === 1}
      >
        <FaChevronLeft />
      </button>
        <ul className="paginate_nums">
           {generatePageNumbers().map((page, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageClick(page)}
                  className={page === currentPage ? "active" : ""}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              </li>
            ))}
        </ul>
      <button
        className="next paginate_btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={meta.currentPage === meta.totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default PaginationComponent;
