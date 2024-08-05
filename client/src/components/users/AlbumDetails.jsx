import React, { useState, useEffect } from "react";
import { useStateValue } from "../../context/stateProvider";
import "../../styles/AlbumDetails.css";
import { getAlbumById, getAllSongs, removeFromFavorite } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlay, FaHeart } from "react-icons/fa";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { motion } from "framer-motion";
import { actionType } from "../../context/reducer";

const AlbumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [{ allSongs, isSongPlaying, songIndex, user }, dispatch] =
    useStateValue();
  const [favoriteSongs, setFavoriteSongs] = useState(user.favoriteSongs);

  useEffect(() => {
    const fetchAlbum = async () => {
      const album = await getAlbumById(id);
      setAlbum(album);
    };
    fetchAlbum();
  }, [id]);

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.song,
        });
      });
    }
  }, [allSongs, dispatch]);

  if (!album) {
    return <div>Loading...</div>;
  }

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
        await addToContext(user._id, songId);
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

  const filteredSongs = allSongs
    ? allSongs.filter((song) => song.albumId.name === album.name)
    : [];

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="album-detail-page">
            <div className="main-inner">
              {album ? (
                <>
                  <div className="details-page-info">
                    <div className="details-info-img">
                      <img src={album.imageURL} alt={album.name} />
                    </div>
                    <div className="details-page-content">
                      <p className="small-textBold">Album</p>
                      <h1>{album.name}</h1>
                      <p className="small-text">
                        {album.description.length > 300
                          ? `${album.description.slice(0, 300)}...`
                          : album.description}
                      </p>
                    </div>
                  </div>

                  <div className="album-song">
                    <div className="icons d-flex align-items-center gap-5 ms-5 mt-3">
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
                      <div className="heart-icon">
                        <CiHeart
                          style={{
                            fontSize: "40px",
                          }}
                        />
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
                      {filteredSongs.length === 0 ? (
                        <p className="no-songs-message text-center">
                          Hiện không có bài hát nào thuộc album này
                        </p>
                      ) : (
                        <div className="d-flex flex-wrap gap-2 w-100">
                          {filteredSongs.map((song, index) => (
                            <motion.div
                              key={song._id}
                              className="position-relative songcard mx-3 my-2 p-2 d-flex align-items-center"
                            >
                              <img
                                src={song.imageURL}
                                style={{ width: "80px", height: "80px" }}
                                alt=""
                                className="col-1 rounded-2 me-2"
                              />
                              <span className="play-song-icon">
                                <FaPlay
                                  className="m-auto"
                                  onClick={() => addToContext(song, index)}
                                />
                              </span>
                              <div className="song-info text-light col-5 d-flex justify-content-between flex-column">
                                <p className="fw-bold ">{song.name}</p>
                                <p
                                  className="details-link"
                                  style={{ color: "#aaa" }}
                                  onClick={() => {
                                    navigate(
                                      `/artistDetails/${song.artistId._id}`
                                    );
                                  }}
                                >
                                  {song.artistId.name}
                                </p>
                              </div>
                              <p className="col-2">{song.albumId.name}</p>
                              <p className="col-1">{song.category}</p>
                              <p className="col-2">
                                {formatDuration(song.audioURL.length)}
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
                      )}
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

export default AlbumDetails;
