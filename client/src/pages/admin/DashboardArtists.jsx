import React, { useEffect, useState } from "react";
import { getAllArtists } from "../../api";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/stateProvider";
import ArtistCard from "../../components/card/ArtistCard";
import { NavLink } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import Search from "../../components/home/Search";

const DashboardArtists = () => {
  const [{ allArtists }, dispatch] = useStateValue();
  const [artistFilter, setArtistFilter] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);

  useEffect(() => {
    if (!allArtists || allArtists.length === 0) {
      getAllArtists().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data,
        });
        setFilteredArtists(data);
      });
    } else {
      setFilteredArtists(allArtists);
    }
  }, [allArtists, dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setArtistFilter(value);

    if (value === "") {
      setFilteredArtists(allArtists);
    } else {
      const filtered = allArtists.filter((artist) =>
        artist.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  };

  return (
    <div className="w-100 d-flex justify-content-center align-items-center flex-column">
      <div className="position-relative w-100 my-3 p-3 d-flex align-items-center">
        <NavLink to={"/dashboard/newArtist"} className="text-light ms-3">
          <IoAdd />
        </NavLink>
        <p className="fw-bold my-auto mx-2">
          <span>Total : </span>
          {allArtists ? allArtists.length : 0}
        </p>
        <Search dataFilter={artistFilter} handleSearch={handleSearch} />
      </div>
      <div className="w-100 d-flex flex-wrap gap-2 justify-content-center">
        {filteredArtists &&
          filteredArtists.map((artist, i) => (
            <ArtistCard
              key={artist._id}
              data={artist}
              index={i}
              type="artist"
            />
          ))}
      </div>
    </div>
  );
};

export default DashboardArtists;
