import React, { useEffect, useState, useCallback } from "react";
import "../../styles/NavBar.css";
import "../../styles/SongCard.css";
import { getAllAlbums, getAllArtists, getAllSongs } from "../../api";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/stateProvider";
import { FaChevronRight, FaSearch } from "react-icons/fa";

import UserSongCard from "../users/UserSongCard";
import UserArtistCard from "../users/UserArtistCard";
import UserAlbumCard from "../users/UserAlbumCard";

const Main = () => {
  const [{ allArtists, allSongs, allAlbums }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    if (!allArtists || allArtists.length === 0) {
      getAllArtists()
        .then((data) => {
          dispatch({
            type: actionType.SET_ALL_ARTISTS,
            allArtists: data,
          });
        })
        .catch((error) => console.error("Error fetching artists:", error));
    }
  }, [allArtists, dispatch]);

  useEffect(() => {
    if (!allAlbums || allAlbums.length === 0) {
      getAllAlbums()
        .then((data) => {
          dispatch({
            type: actionType.SET_ALL_ALBUMS,
            allAlbums: data,
          });
        })
        .catch((error) => console.error("Error fetching albums:", error));
    }
  }, [allAlbums, dispatch]);

  useEffect(() => {
    if (!allSongs || allSongs.length === 0) {
      getAllSongs()
        .then((data) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data,
          });
        })
        .catch((error) => console.error("Error fetching songs:", error));
    }
  }, [allSongs, dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filterResults = useCallback((list, searchTerm) => {
    const regex = new RegExp(searchTerm, "i");
    return list.filter((item) => {
      const nameIncludes = regex.test(item.name);
      if (item.artist) {
        const artistIncludes = regex.test(item.artist);
        const albumIncludes = regex.test(item.album);
        return nameIncludes || artistIncludes || albumIncludes;
      }
      return nameIncludes;
    });
  }, []);

  const filteredArtists = filterResults(allArtists || [], debouncedSearchTerm);
  const filteredAlbums = filterResults(allAlbums || [], debouncedSearchTerm);
  const filteredSongs = filterResults(allSongs || [], debouncedSearchTerm);

  return (
    <div
      className="main"
      style={{
        backgroundColor: "#191919",
        minWidth: "85%",
        position: "relative",
        height: "100vh",
      }}
    >
      <div className="search-bar bg-white d-flex align-items-center rounded-pill mt-5 ms-3">
        <FaSearch className="text-dark" />
        <input
          type="text"
          placeholder="Artists, songs, musics"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-100"
        />
      </div>

      {filteredArtists.length === 0 &&
      filteredAlbums.length === 0 &&
      filteredSongs.length === 0 ? (
        <div className="main-content">
          <p>Không có dữ liệu trùng khớp</p>
        </div>
      ) : (
        <>
          {/* Album */}
          {filteredAlbums.length > 0 && (
            <div className="main-content">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-0">Albums</h1>
                <div className="text-uppercase d-flex align-items-center gap-2">
                  <div>See more</div>
                  <FaChevronRight
                    className="rounded-pill"
                    style={{ backgroundColor: "#282828" }}
                  />
                </div>
              </div>
              <div className="card-wrap gap-2">
                {filteredAlbums.map((album, index) => (
                  <UserAlbumCard data={album} index={index} type={album} />
                ))}
              </div>
            </div>
          )}

          {/* Artist */}
          {filteredArtists.length > 0 && (
            <div className="main-content">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-0">Artists</h1>
                <div className="text-uppercase d-flex align-items-center gap-2">
                  <div>See more</div>
                  <FaChevronRight
                    className="rounded-pill"
                    style={{ backgroundColor: "#282828" }}
                  />
                </div>
              </div>
              <div className="card-wrap gap-2">
                {filteredArtists.slice(0, 5).map((artist, index) => (
                  <UserArtistCard data={artist} index={index} type={artist} />
                ))}
              </div>
            </div>
          )}

          {/* Song */}
          {filteredSongs.length > 0 && (
            <div className="main-content">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-0">Songs</h1>
                <div className="text-uppercase d-flex align-items-center gap-2">
                  <div>See more</div>
                  <FaChevronRight
                    className="rounded-pill"
                    style={{ backgroundColor: "#282828" }}
                  />
                </div>
              </div>
              <div className="sub-text">What's your taste?</div>
              <div className="d-flex flex-wrap gap-2 w-100">
                {filteredSongs.map((song, index) => (
                  <UserSongCard
                    key={song._id}
                    data={song}
                    index={index}
                    type={song}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Main;
