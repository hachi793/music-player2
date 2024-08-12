import React from "react";
import { FaChevronRight } from "react-icons/fa";

const SeeMore = ({ type }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="mb-0">{type}</h1>
      <div className="text-uppercase d-flex align-items-center gap-2">
        <div>See more</div>
        <FaChevronRight
          className="rounded-pill"
          style={{ backgroundColor: "#282828" }}
        />
      </div>
    </div>
  );
};

export default SeeMore;
