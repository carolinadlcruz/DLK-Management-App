import React from "react";
import "../globalStyles/Pagination.css";
// En Pagination.js
export const Pagination = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <nav className="pagination">
      <a onClick={() => handleClick(currentPage - 1)}>&lt;</a>
      <ul>
        {Array.from({ length: totalPages }, (_, index) => (
          <li
            key={index + 1}
            className={currentPage === index + 1 ? "current" : ""}
          >
            <a onClick={() => handleClick(index + 1)}>{index + 1}</a>
          </li>
        ))}
      </ul>
      <a onClick={() => handleClick(currentPage + 1)}>&gt;</a>
    </nav>
  );
};
