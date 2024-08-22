import React from "react";

const Pagination = ({
  songsPerPage,
  length,
  handlePagination,
  currentPage,
}) => {
  let paginationNumber = [];
  for (let i = 1; i <= Math.ceil(length / songsPerPage); i++) {
    paginationNumber.push(i);
  }
  return (
    <div className="pagination d-flex gap-5 justify-content-center w-100">
      {paginationNumber.map((data) => (
        <button
          key={data}
          onClick={() => handlePagination(data)}
          className={currentPage === data ? "" : "text-light bg-dark"}
          style={{
            background: "azure",
            width: "2.5rem",
            borderRadius: "50%",
            transition: "0.5s ease-in-out",
          }}
        >
          {data}
        </button>
      ))}
    </div>
  );
};
export default Pagination;
