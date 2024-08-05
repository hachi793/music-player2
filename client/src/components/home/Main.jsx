import React, { useEffect, useState, useCallback } from "react";
import "../../styles/NavBar.css";
import "../../styles/SongCard.css";
import {
  getAllAlbums,
  getAllArtists,
  getAllSongs,
  addToFavorite,
  removeFromFavorite,
} from "../../api";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/stateProvider";
import { FaChevronRight, FaPlay, FaSearch, FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  const [
    { allArtists, allSongs, allAlbums, isSongPlaying, songIndex, user },
    dispatch,
  ] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [favoriteSongs, setFavoriteSongs] = useState(user.favoriteSongs);

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

  const addToContext = (song, index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_IS_SONG_PLAYING,
        isSongPlaying: true,
      });
    }

    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  const handleFavorite = async (songId) => {
    try {
      let updatedFavorites;

      if (favoriteSongs.includes(songId)) {
        await removeFromFavorite(user._id, songId);
        updatedFavorites = favoriteSongs.filter((id) => id !== songId);
      } else {
        await addToFavorite(user._id, songId);
        updatedFavorites = [...favoriteSongs, songId];
      }

      setFavoriteSongs(updatedFavorites);

      dispatch({
        type: actionType.SET_FAVORITE_SONGS,
        favoriteSongs: updatedFavorites,
      });

      dispatch({
        type: actionType.SET_USER,
        user: { ...user, favoriteSongs: updatedFavorites },
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, favoriteSongs: updatedFavorites })
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

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
                {filteredAlbums.map((album) => (
                  <div
                    className="card"
                    key={album._id}
                    onClick={() => {
                      navigate(`/albumDetails/${album._id}`);
                    }}
                  >
                    <img
                      className="cardImage"
                      src={album.imageURL}
                      alt={album.name}
                    />
                    <h5 className="cardContent">{album.name}</h5>
                    <span className="play-icon">
                      <FaPlay className="m-auto" />
                    </span>
                  </div>
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
                {filteredArtists.slice(0, 5).map((artist) => (
                  <div
                    className="card"
                    key={artist._id}
                    onClick={() => {
                      navigate(`/artistDetails/${artist._id}`);
                    }}
                  >
                    <img
                      className="cardImage"
                      style={{ borderRadius: "50%" }}
                      src={artist.imageURL}
                      alt={artist.name}
                    />
                    <h5 className="cardContent">{artist.name}</h5>
                    <p className="sub-text-small">
                      {artist.description && artist.description.length > 20
                        ? artist.description.slice(0, 45) + "..."
                        : artist.description || ""}
                    </p>
                    <span className="play-icon">
                      <FaPlay className="m-auto" />
                    </span>
                  </div>
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
                  <motion.div
                    key={song._id}
                    className="position-relative songcard mx-3 my-2 p-2 d-flex align-items-center"
                  >
                    <img
                      src={song.imageURL}
                      style={{ width: "80px", height: "80px" }}
                      alt={song.name}
                      className="col-1 rounded-2 me-2"
                    />
                    <span className="play-song-icon">
                      <FaPlay
                        className="m-auto"
                        onClick={() => addToContext(song, index)}
                      />
                    </span>
                    <div className="song-info text-light col-4 d-flex justify-content-between flex-column">
                      <p className="fw-bold mb-1">{song.name}</p>
                      <p
                        className="details-link"
                        style={{ color: "#aaa" }}
                        onClick={() => {
                          navigate(`/artistDetails/${song.artistId._id}`);
                        }}
                      >
                        {song.artistId.name}
                      </p>
                    </div>
                    <p
                      className="col-3 info details-link"
                      onClick={() => {
                        navigate(`/albumDetails/${song.albumId._id}`);
                      }}
                    >
                      {song.albumId.name}
                    </p>
                    <p className="col-1 info">{song.category}</p>
                    <p className="col-2 info">
                      {song.audioURL.length
                        ? formatDuration(song.audioURL.length)
                        : "00:00"}
                    </p>
                    <p className="col-1">
                      {favoriteSongs.includes(song._id) ? (
                        <FaHeart
                          className="fs-5"
                          style={{ color: "#0FFF50" }}
                          onClick={() => handleFavorite(song._id)}
                        />
                      ) : (
                        <CiHeart
                          className="fs-4"
                          onClick={() => handleFavorite(song._id)}
                        />
                      )}
                    </p>
                  </motion.div>
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
