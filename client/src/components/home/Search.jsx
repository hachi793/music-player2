import React from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ dataFilter, handleSearch }) => {
  return (
    <div className="search-bar bg-white d-flex align-items-center rounded-pill mt-0 ms-3">
      <FaSearch className="text-dark" />
      <input
        type="text"
        placeholder="Search here"
        value={dataFilter}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
