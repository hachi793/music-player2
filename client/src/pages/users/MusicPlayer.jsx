import React, { useEffect, useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import { RiPlayListFill } from "react-icons/ri";
import { motion } from "framer-motion";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { addToFavorite, getAllSongs, removeFromFavorite } from "../../api";
import { actionType } from "../../context/reducer";
import { IoClose, IoMusicalNote } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import "../../styles/MusicPlayer.css";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const MusicPlayer = () => {
  const [{ allSongs, songIndex, user, favoriteSongs }, dispatch] =
    useStateValue();
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsPlaying(true);
  }, [allSongs, songIndex]);

  useEffect(() => {
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        dispatch({
          type: actionType.SET_USER,
          user: storedUser,
        });
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate, dispatch]);

  const nextTrack = () => {
    if (allSongs && allSongs.length > 0) {
      if (songIndex >= allSongs.length - 1) {
        dispatch({
          type: actionType.SET_SONG_INDEX,
          songIndex: 0,
        });
      } else {
        dispatch({
          type: actionType.SET_SONG_INDEX,
          songIndex: songIndex + 1,
        });
      }
    }
  };

  const previousTrack = () => {
    if (allSongs && allSongs.length > 0) {
      if (songIndex === 0) {
        dispatch({
          type: actionType.SET_SONG_INDEX,
          songIndex: allSongs.length - 1,
        });
      } else {
        dispatch({
          type: actionType.SET_SONG_INDEX,
          songIndex: songIndex - 1,
        });
      }
    }
  };

  const closePlayer = () => {
    dispatch({
      type: actionType.SET_IS_SONG_PLAYING,
      isSongPlaying: false,
    });
  };

  const currentSong = allSongs[songIndex] || {};

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
    <>
      {user ? (
        <div
          className="w-100 d-flex justify-content-center align-items-center gap-2"
          style={{ height: "90px" }}
        >
          <div className="w-100 d-flex align-items-center  position-relative gap-2">
            {allSongs && (
              <>
                <img
                  src={currentSong.imageURL}
                  alt={currentSong.name}
                  className="object-fit-cover rounded-2 ms-2"
                  style={{ width: "5%", height: "8%" }}
                />

                <div className="d-flex align-items-start flex-column ">
                  <p className="fw-semibold mb-0">
                    {`${
                      currentSong.name.length > 20
                        ? currentSong.name.slice(0, 20)
                        : currentSong.name
                    }`}
                    <span>({currentSong.albumId.name})</span>
                  </p>
                  <p style={{ fontSize: "14px", margin: "-5px 2px -1px" }}>
                    {currentSong.artistId.name}
                  </p>

                  <div className="d-flex align-items-center gap-2">
                    <motion.i onClick={() => setIsPlaylist(!isPlaylist)}>
                      <RiPlayListFill className="fs-5" />
                    </motion.i>
                    <p className="mb-0">
                      {favoriteSongs?.includes(currentSong._id) ? (
                        <FaHeart
                          className="fs-5"
                          style={{ color: "#0FFF50" }}
                          onClick={() => handleFavorite(currentSong._id)}
                        />
                      ) : (
                        <CiHeart
                          className="fs-4"
                          onClick={() => handleFavorite(currentSong._id)}
                        />
                      )}
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-grow-1">
                  <AudioPlayer
                    style={{ background: "#323232", color: "#7c7c7c" }}
                    src={currentSong.audioURL}
                    autoPlay={isPlaying}
                    showSkipControls={true}
                    onClickNext={nextTrack}
                    onClickPrevious={previousTrack}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>
                {isPlaylist && (
                  <div>
                    <PlaylistCard />
                  </div>
                )}
              </>
            )}

            <IoClose
              onClick={closePlayer}
              className="position-absolute rounded-pill"
              style={{
                top: "8%",
                right: "1%",
                backgroundColor: "#aaa",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      ) : (
        navigate("/login")
      )}
    </>
  );
};

export const PlaylistCard = () => {
  const [{ allSongs, songIndex, isSongPlaying }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data,
        });
      });
    }
  }, [allSongs, dispatch]);

  const setCurrentPlaySong = (index) => {
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

  return (
    <div
      className=" position-absolute gap-2 py-2 d-flex flex-column overflow-y-scroll rounded-1 "
      style={{
        left: "1%",
        bottom: "28%",
        zIndex: "2",
        width: "350px",
        maxWidth: "350px",
        height: "510px",
        maxHeight: "510px",
        backgroundColor: "#323232",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none",
      }}
    >
      {allSongs && allSongs.length > 0 ? (
        allSongs.map((music, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="w-100 h-100 p-3 d-flex gap-2 align-items-center bg-transparent music-card"
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentPlaySong(index)}
          >
            <IoMusicalNote style={{ cursor: "pointer" }} />

            <div className="d-flex align-items-start flex-column ">
              <p className="fw-semibold">
                {`${
                  music.name.length > 20 ? music.name.slice(0, 20) : music.name
                }`}
                <span>({music.albumId ? "Album" : "Unknown Album"})</span>
              </p>
              <p style={{ fontSize: "14px", margin: "-5px 2px -1px" }}>
                {music.artistId ? "Artist Name" : "Unknown Artist"}
              </p>
            </div>
          </motion.div>
        ))
      ) : (
        <p>No songs available</p>
      )}
    </div>
  );
};

export default MusicPlayer;
