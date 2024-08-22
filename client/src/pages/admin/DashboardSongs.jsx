import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useStateValue } from "../../context/stateProvider";
import { getAllSongs } from "../../api";
import { actionType } from "../../context/reducer";
import SongCard from "../../components/card/SongCard";
import Search from "../../components/home/Search";
import Pagination from "../../components/home/Pagination";

const DashboardSongs = () => {
  const [songFilter, setSongFilter] = useState("");
  const [{ allSongs }, dispatch] = useStateValue();
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage] = useState(8);
  useEffect(() => {
    if (!allSongs || allSongs.length === 0) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data,
        });
        setFilteredSongs(data);
      });
    } else {
      setFilteredSongs(allSongs);
    }
  }, [allSongs, dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSongFilter(value);

    if (value === "") {
      setFilteredSongs(allSongs);
    } else {
      const filtered = allSongs.filter((song) =>
        song.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  };

  // Pagination
  const indexOfLastPost = currentPage * songsPerPage;
  const indexOfFirstPost = indexOfLastPost - songsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstPost, indexOfLastPost);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-100 vh-200 d-flex flex-column mx-3">
      <div className="position-relative w-100 my-3 p-3 d-flex align-items-center">
        <NavLink to={"/dashboard/newSong"} className="text-light ms-3">
          <IoAdd />
        </NavLink>
        <p className="fw-bold my-auto mx-2">
          <span>Total : </span>
          {allSongs ? allSongs.length : 0}
        </p>
        <Search dataFilter={songFilter} handleSearch={handleSearch} />
      </div>
      {filteredSongs.length === 0 ? (
        <div className="text-center text-light">
          Không có kết quả trùng khớp
        </div>
      ) : (
        <div className="w-100 flex flex-wrap gap-2 justify-content-evenly align-items-center">
          {filteredSongs &&
            currentSongs.map((song, i) => (
              <SongCard key={song._id} data={song} index={i} type="song" />
            ))}
          <Pagination
            length={filteredSongs.length}
            songsPerPage={songsPerPage}
            handlePagination={handlePagination}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardSongs;
