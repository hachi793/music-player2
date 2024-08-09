import React, { useEffect, useState } from "react";
import { getAllAlbums } from "../../api";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/stateProvider";
import { NavLink } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import AlbumCard from "./AlbumCard";

const DashboardAlbums = () => {
  const [{ allAlbums }, dispatch] = useStateValue();
  const [albumFilter, setAlbumFilter] = useState("");
  const [filteredAlbums, setFilteredAlbums] = useState([]);

  useEffect(() => {
    if (!allAlbums || allAlbums.length === 0) {
      getAllAlbums().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data,
        });
        setFilteredAlbums(data);
      });
    } else {
      setFilteredAlbums(allAlbums);
    }
  }, [allAlbums, dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setAlbumFilter(value);

    if (value === "") {
      setFilteredAlbums(allAlbums);
    } else {
      const filtered = allAlbums.filter((album) =>
        album.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAlbums(filtered);
    }
  };

  return (
    <>
      <div className="w-100 vh-200 d-flex flex-column mx-3">
        <div className="position-relative w-100 my-3 p-3 d-flex align-items-center">
          <NavLink to={"/dashboard/newAlbum"} className="text-light ms-3">
            <IoAdd />
          </NavLink>
          <p className="fw-bold my-auto mx-2">
            <span>Total : </span>
            {allAlbums ? allAlbums.length : 0}
          </p>
          <div className="search-bar bg-white d-flex align-items-center rounded-pill mt-0 ms-3">
            <FaSearch className="text-dark" />
            <input
              type="text"
              placeholder="Search here"
              value={albumFilter}
              onChange={handleSearch}
            />
          </div>
        </div>
        <AlbumContainer data={filteredAlbums} />
      </div>
    </>
  );
};

export const AlbumContainer = ({ data }) => {
  return (
    <>
      <div className="d-flex flex-wrap gap-2 justify-content-center ">
        {data && data.length > 0 ? (
          data.map((album, i) => (
            <AlbumCard key={album._id} data={album} index={i} type="album" />
          ))
        ) : (
          <p className="text-light">Không có kết quả trùng khớp</p>
        )}
      </div>
    </>
  );
};

export default DashboardAlbums;
