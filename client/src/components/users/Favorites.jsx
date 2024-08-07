import React, { useEffect } from "react";
import { useStateValue } from "../../context/stateProvider";
import "../../styles/NavBar.css";
import "../../styles/Favorites.css";
import { FaPlay, FaHeart } from "react-icons/fa";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import {
  addToFavorite,
  removeFromFavorite,
  getFavoriteSongs,
  getAllSongs,
} from "../../api";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [
    { allSongs, isSongPlaying, songIndex, favoriteSongs, user },
    dispatch,
  ] = useStateValue();
  const navigate = useNavigate();
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
    if (user) {
      const fetchFavoriteSongs = async () => {
        try {
          const favoriteSongs = await getFavoriteSongs(user._id);
          dispatch({
            type: actionType.SET_FAVORITE_SONGS,
            favoriteSongs,
          });
        } catch (error) {
          console.error("Error fetching favorite songs:", error);
        }
      };

      fetchFavoriteSongs();
    }
  }, [user, dispatch]);

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
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="playlist-page">
            <div className="main-inner">
              <div className="playlist-page-info mx-3">
                <div className="playlist-page-image">
                  <img src={user.profileImagePath} alt="Playlist Cover" />
                </div>
                <div className="playlist-page-content">
                  <p className="small-textBold">Playlist</p>
                  <h1>Favorites</h1>
                  <p className="small-text">
                    A collection of your favorite songs.
                  </p>
                  <div className="playlist-page-desc d-flex gap-4 align-items-center">
                    <span>Spotify</span>
                    <span className="small-text">Likes</span>
                    <span className="small-text">Hours</span>
                  </div>
                </div>
              </div>
              <div className="playlist-song">
                <div className="icons d-flex align-items-center gap-5 ms-5">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50px",
                      background: "#1db954",
                      paddingLeft: "15px",
                      paddingTop: "8px",
                    }}
                  >
                    <FaPlay />
                  </div>

                  <div className="dots-icon">
                    <CiMenuKebab
                      style={{
                        fontSize: "30px",
                      }}
                    />
                  </div>
                </div>
                <div className="main-content">
                  <div className="d-flex flex-wrap gap-2 w-100">
                    {allSongs &&
                      allSongs
                        .filter((song) => favoriteSongs?.includes(song._id))
                        .map((song, index) => (
                          <motion.div
                            key={song._id}
                            className="position-relative songcard mx-3 my-2 p-2 d-flex align-items-center"
                          >
                            <img
                              src={song.imageURL}
                              style={{ width: "80px", height: "80px" }}
                              alt={`${song.name} cover`}
                              className="col-1 rounded-2 me-2"
                            />
                            <span className="play-song-icon">
                              <FaPlay
                                className="m-auto"
                                onClick={() => addToContext(song, index)}
                              />
                            </span>
                            <div className="song-info text-light col-5 d-flex justify-content-between flex-column">
                              <p className="fw-bold">{song.name}</p>
                              <p
                                style={{ color: "#aaa" }}
                                className="details-link"
                                onClick={() =>
                                  navigate(
                                    `/artistDetails/${song.artistId._id}`
                                  )
                                }
                              >
                                {song.artistId?.name}
                              </p>
                            </div>
                            <p
                              className="col-2 details-link"
                              onClick={() =>
                                navigate(`/albumDetails/${song.albumId._id}`)
                              }
                            >
                              {song.albumId?.name}
                            </p>
                            <p className="col-2">{song.category}</p>
                            <p className="col-1">
                              {formatDuration(song.audioURL?.length || 0)}
                            </p>
                            <p className="col-2">
                              {favoriteSongs?.includes(song._id) ? (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
