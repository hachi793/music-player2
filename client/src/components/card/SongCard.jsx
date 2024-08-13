import React, { useEffect, useState } from "react";
import "../../styles/SongCard.css";
import { IoTrash } from "react-icons/io5";
import { deleteSongById, getAllSongs } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { FaPen, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SongCard = ({ data, index, type }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [{ isSongPlaying, songIndex }, dispatch] = useStateValue();
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllSongs().then((data) => {
      setSongs(data.song);
    });
  }, [songs, dispatch]);

  const deleteItem = (itemData) => {
    deleteSongById(itemData._id).then((res) => {
      if (res.data) {
        dispatch({ type: actionType.SET_ALERT_TYPE, alertType: "success" });
        setTimeout(() => {
          dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
        }, 3000);
        setSongs(songs.filter((song) => song._id !== itemData._id));
      } else {
        dispatch({ type: actionType.SET_ALERT_TYPE, alertType: "danger" });
        setTimeout(() => {
          dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
        }, 3000);
      }
    });
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

  return (
    <div className="">
      <div className="position-relative songcard mx-3 my-2 p-2 row">
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
        {isDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="position-absolute d-flex flex-column justify-content-center align-items-center px-4 py-2 w-25 rounded-2"
            style={{
              bottom: "1%",
              left: "38%",
              zIndex: "3",
              backgroundColor: "#323232",
            }}
          >
            <p className="font-semibold text-center">Are you sure ?</p>

            <div className="d-flex align-items-center gap-3">
              <button
                className="border-0 px-2 rounded-2 bg-danger text-light"
                onClick={() => deleteItem(data)}
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
    </div>
  );
};

export default SongCard;
