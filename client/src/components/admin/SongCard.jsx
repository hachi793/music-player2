import React, { useState, useEffect } from "react";
import "../../styles/SongCard.css";
import { IoTrash } from "react-icons/io5";
import { deleteObject as deleteStorageObject, ref } from "firebase/storage";
import {
  deleteSongById,
  getAllSongs,
  getAllArtists,
  getAllAlbums,
} from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { storage } from "../../config/firebase.config";
import { motion } from "framer-motion";
import { FaPen, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SongCard = ({ data, index, type }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [
    { allArtists, allAlbums, alertType, isSongPlaying, songIndex },
    dispatch,
  ] = useStateValue();

  const navigate = useNavigate();

  const deleteSong = (songData) => {
    if (type === "song") {
      const deleteRef = ref(storage, songData.imageURL);

      deleteStorageObject(deleteRef)
        .then(() => {
          deleteSongById(songData._id).then((res) => {
            if (res && res.data) {
              dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success",
              });
              setTimeout(() => {
                dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
              }, 5000);

              getAllSongs().then((data) => {
                dispatch({
                  type: actionType.SET_ALL_SONGS,
                  allSongs: data,
                });
              });
            } else {
              dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "danger",
              });
              setTimeout(() => {
                dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
              }, 3000);
            }
          });
        })
        .catch((error) => {
          console.error("Error deleting song image:", error);
          dispatch({
            type: actionType.SET_ALERT_TYPE,
            alertType: "danger",
          });
          setTimeout(() => {
            dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
          }, 3000);
        });
    }
  };

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
      <motion.div className="position-relative songcard mx-3 my-2 p-2 row">
        <img
          src={data.imageURL}
          style={{ width: "100px", height: "80px" }}
          alt=""
          className="col-2"
        />
        <span className="play-song-icon" style={{ left: "2.6rem" }}>
          <FaPlay
            className="m-auto"
            onClick={type === "song" && addToContext}
          />
        </span>
        <div className="song-info text-light col-3 d-flex justify-content-between flex-column">
          <p className="fw-bold">
            {data.name.length > 15 ? `${data.name.slice(0, 15)}...` : data.name}
          </p>
          <p style={{ color: "#aaa" }}>{data.artistId.name}</p>
        </div>

        <p className="col-3 info">{data.albumId.name}</p>
        <p className="col-2 info">{data.category}</p>
        <p
          className="text-light col-1"
          onClick={() => navigate(`/dashboard/updateSong/${data._id}`)}
        >
          <FaPen />
        </p>
        <p className="text-danger col-1" onClick={() => setIsDelete(true)}>
          <IoTrash />
        </p>
      </motion.div>
      {isDelete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="position-relative d-flex flex-column justify-content-center align-items-center px-4 py-2 w-25 rounded-2"
          style={{
            top: "50%",
            bottom: "50%",
            left: "38%",
            backgroundColor: "#323232",
          }}
        >
          <p className="font-semibold text-center">Are you sure ?</p>

          <div className="d-flex align-items-center gap-3">
            <button
              className="border-0 px-2 rounded-2 bg-danger text-light"
              onClick={() => deleteSong(data)}
            >
              Yes
            </button>
            <button
              className="border-0 px-2 rounded-2 bg-success text-light"
              onClick={() => setIsDelete(false)}
            >
              No
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SongCard;
