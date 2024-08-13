import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/stateProvider";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { addToFavorite, removeFromFavorite } from "../api";
import { IoClose } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import "./../styles/MusicPlayer.css";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { actionType } from "../context/reducer";

const MusicPlayer = () => {
  const [{ allSongs, songIndex, user, favoriteSongs }, dispatch] =
    useStateValue();
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

export default MusicPlayer;
