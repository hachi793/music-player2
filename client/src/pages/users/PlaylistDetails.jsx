import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllSongs, getPlaylistById } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import PlaylistImage from "../../components/card/PlaylistImage";
import Search from "../../components/home/Search";
import UpdatePlaylistInfo from "./UpdatePlaylistInfo";
import { motion } from "framer-motion";
import PlaylistSongCard from "../../components/card/PlaylistSongCard";
import Pagination from "../../components/home/Pagination";

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songFilter, setSongFilter] = useState("");
  const [{ allSongs }] = useStateValue();
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isPlaylistUpdate, setPlaylistUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage] = useState(5);

  const fetchPlaylist = async (id) => {
    const playlist = await getPlaylistById(id);
    setPlaylist(playlist);
  };

  useEffect(() => {
    fetchPlaylist(id);
  }, [id]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSongFilter(value);

    if (value === "") {
      setFilteredSongs([]);
    } else {
      const filtered = allSongs
        .filter((song) => song.name.toLowerCase().includes(value.toLowerCase()))
        .filter((song) => !playlist.songs.some((s) => s._id === song._id));
      setFilteredSongs(filtered);
    }
  };

  const handleClickOutside = (e) => {
    if (isPlaylistUpdate && !e.target.closest(".modal-content")) {
      setPlaylistUpdate(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isPlaylistUpdate]);

  // Pagination
  const indexOfLastPost = currentPage * songsPerPage;
  const indexOfFirstPost = indexOfLastPost - songsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstPost, indexOfLastPost);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="detail-page">
            <div className="main-inner">
              {playlist ? (
                <>
                  <div onClick={() => setPlaylistUpdate(true)}>
                    <PlaylistImage playlist={playlist} />
                  </div>

                  {isPlaylistUpdate && (
                    <motion.div
                      className="modal-content"
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <UpdatePlaylistInfo playlist={playlist} />
                    </motion.div>
                  )}

                  <div className="main-content">
                    {playlist.songs.length === 0 ? (
                      <p className="no-songs-message text-center">
                        Hiện không có bài hát nào thuộc playlist này
                      </p>
                    ) : (
                      <div className="d-flex flex-wrap gap-2 w-100">
                        {playlist.songs
                          .sort(
                            (a, b) =>
                              new Date(b.updatedAt) - new Date(a.updatedAt)
                          )
                          .map((song, index) => (
                            <PlaylistSongCard
                              key={song._id}
                              playlist={playlist}
                              data={song}
                              index={index}
                              fetchPlaylist={fetchPlaylist}
                            />
                          ))}
                      </div>
                    )}

                    <div className="my-5">
                      <h2 className="my-3">Find songs to add playlist</h2>
                      <Search
                        dataFilter={songFilter}
                        handleSearch={handleSearch}
                      />
                      <div className="w-100 flex flex-wrap gap-2 justify-content-evenly align-items-center">
                        {songFilter && filteredSongs.length > 0
                          ? currentSongs.map((song, i) => (
                              <PlaylistSongCard
                                key={song._id}
                                playlist={playlist}
                                data={song}
                                index={i}
                                fetchPlaylist={fetchPlaylist}
                              />
                            ))
                          : songFilter && <p className="p-3">No songs found</p>}
                        {filteredSongs.length > 0 && (
                          <Pagination
                            length={filteredSongs.length}
                            songsPerPage={songsPerPage}
                            handlePagination={handlePagination}
                            currentPage={currentPage}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;
