import React, { useState } from "react";
import "../../styles/SongCard.css";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserSongCard = ({ data, index, type }) => {
  const [{ isSongPlaying, songIndex }, dispatch] = useStateValue();
  const navigate = useNavigate();

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
  return (
    <div className="">
      <motion.div
        // whileTap={{ scale: 0.8 }}
        // initial={{ opacity: 0, translateX: -50 }}
        // animate={{ opacity: 1, translateX: 0 }}
        // transition={{ duration: 0.3, delay: index * 0.1 }}
        className=" position-relative songcard mx-3 my-2 p-2 row d-flex justify-content-center"
        onClick={type === "song" && addToContext}
      >
        <img src={data.imageURL} alt="" className="col-1" />
        <div className="song-info text-light col-4 d-flex justify-content-between flex-column">
          <p className="fw-bold">{data.name}</p>
          <p
            style={{ color: "#aaa" }}
            onClick={() => {
              navigate("/artistDetails");
            }}
          >
            {data.artist}
          </p>
        </div>

        <p
          className="col-3"
          onClick={() => {
            navigate("/albumDetails");
          }}
        >
          {data.album}
        </p>
        <p className="col-2">{data.category}</p>
        <p className="col-2">{formatDuration(data.songURL?.length)}</p>
      </motion.div>
    </div>
  );
};

export default UserSongCard;
