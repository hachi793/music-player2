import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import "./../../styles/FilterButtons.css";

const FilterButtons = ({ filterData, flag }) => {
  const [filterName, setFilterName] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);
  const [{ filterTerm, languageFilter, artistFilter, albumFilter }, dispatch] =
    useStateValue();

  const updateFilterButton = (name) => {
    setFilterName(name);
    if (flag === "Artist") {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: name });
    } else if (flag === "Album") {
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: name });
    } else if (flag === "Language") {
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: name });
    } else if (flag === "Category") {
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: name });
    }
  };

  const toggleFilterMenu = () => {
    setFilterMenu(!filterMenu);
  };

  return (
    <div
      className="filter rounded-2 px-3 btn text-light"
      style={{ backgroundColor: "#323232", border: "none", outline: "none" }}
    >
      <p
        className={`d-flex align-items-center my-0 ${
          filterMenu ? "rotate-180" : "rotate-0"
        }`}
        onClick={toggleFilterMenu}
      >
        {!filterName && flag}
        {filterName && (
          <>
            {filterName.length > 15
              ? `${filterName.slice(0, 15)}...`
              : filterName}
          </>
        )}
        <IoChevronDown
          className="ms-2"
          style={{
            transition: "ease-in-out",
            transform: filterMenu ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </p>

      {filterData && filterMenu && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="filter-menu z-2 py-2 rounded-2 position-absolute left-0 text-light"
          style={{
            maxHeight: "44%",
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            backgroundColor: "#7a7a7a",
            width: flag === "Artist" || flag === "Album" ? "200px" : "100px",
          }}
        >
          {filterData.map((data) => (
            <div
              key={data.name}
              className="filter-content d-flex align-items-center gap-2 px-2 py-1 text-light"
              style={{ backgroundColor: "#7a7a7a", cursor: "pointer" }}
              onClick={() => {
                updateFilterButton(data.name);
                setFilterMenu(false);
              }}
            >
              {(flag === "Artist" || flag === "Album") && (
                <img
                  src={data.imageURL}
                  className="rounded-5 object-fit-cover"
                  style={{ width: "20%", minHeight: "32px", height: "8%" }}
                  alt={data.name}
                />
              )}
              <p className="text-left m-0">
                {data.name.length > 15
                  ? `${data.name.slice(0, 14)}...`
                  : data.name}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FilterButtons;
