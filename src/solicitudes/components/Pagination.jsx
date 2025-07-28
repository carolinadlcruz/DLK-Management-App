import React from "react";
import "../styles/Pagination.css";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(currentPage + 2, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 2) {
      pageNumbers.unshift("...");
      pageNumbers.unshift(1);
    } else if (startPage === 2) {
      pageNumbers.unshift(1);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (endPage === totalPages - 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {getPageNumbers().map((number, index) => (
          <li
            key={index}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <button
              className={`page-link ${
                number === currentPage ? "active-page" : ""
              }`}
              onClick={() => typeof number === "number" && onPageChange(number)}
              disabled={typeof number !== "number"}
            >
              {number}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
