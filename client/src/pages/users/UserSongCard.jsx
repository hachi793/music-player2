import React, { useEffect, useState } from "react";
import "../../styles/SongCard.css";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaPlay } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { addToFavorite, removeFromFavorite } from "../../api";

const UserSongCard = ({ data, index }) => {
  const [{ isSongPlaying, songIndex, user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  useEffect(() => {
    if (user) {
      setFavoriteSongs(user.favoriteSongs || []);
    }
  }, [user]);

  const addToContext = () => {
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
    <motion.div className="position-relative songcard mx-3 my-2 p-2 d-flex">
      <img
        src={data.imageURL}
        style={{ width: "80px", height: "80px" }}
        alt={data.name}
        className="col-1 rounded-2 me-2"
      />
      <span className="play-song-icon">
        <FaPlay className="m-auto" onClick={() => addToContext(data, index)} />
      </span>
      <div className="song-info text-light col-3 d-flex justify-content-between flex-column">
        <p
          className="details-link fw-bold mb-1"
          onClick={() => {
            navigate(`/songDetails/${data._id}`);
          }}
        >
          {data.name}
        </p>
        <p
          className="details-link"
          style={{ color: "#aaa" }}
          onClick={() => {
            navigate(`/artistDetails/${data.artistId._id}`);
          }}
        >
          {data.artistId.name}
        </p>
      </div>
      <p
        className="col-3 info details-link"
        onClick={() => {
          navigate(`/albumDetails/${data.albumId._id}`);
        }}
      >
        {data.albumId.name}
      </p>
      <p className="col-2 info">{data.category}</p>
      <p className="col-2 info">
        {data.audioURL.length ? formatDuration(data.audioURL.length) : "00:00"}
      </p>
      <p className="col-">
        {favoriteSongs.includes(data._id) ? (
          <FaHeart
            className="fs-5"
            style={{ color: "#0FFF50" }}
            onClick={() => handleFavorite(data._id)}
          />
        ) : (
          <CiHeart className="fs-4" onClick={() => handleFavorite(data._id)} />
        )}
      </p>
    </motion.div>
  );
};

export default UserSongCard;
