import React, { useState, useEffect } from "react";
import { IoTrash } from "react-icons/io5";
import "../../styles/ArtistCard.css";
import "../../styles/NavBar.css";
import { deleteArtistById, getAllArtists } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";

import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ArtistCard = ({ data, index, type }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [{ alertType, allAlbums, allArtist }, dispatch] = useStateValue();
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllArtists().then((data) => {
      setArtists(data.artist);
    });
  }, [artists, dispatch]);

  // useEffect(() => {
  //   getAllArtists().then((data) => {
  //     dispatch({
  //       type: actionType.SET_ALL_ARTISTS,
  //       allArtist: data.artist,
  //     });
  //   });
  // }, [allArtist]);

  const deleteItem = (itemData) => {
    deleteArtistById(itemData._id).then((res) => {
      if (res.data) {
        dispatch({ type: actionType.SET_ALERT_TYPE, alertType: "success" });
        setTimeout(() => {
          dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
        }, 3000);
        setArtists(artists.filter((artist) => artist._id !== itemData._id));
      } else {
        dispatch({ type: actionType.SET_ALERT_TYPE, alertType: "danger" });
        setTimeout(() => {
          dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
        }, 3000);
      }
    });
  };

  return (
    <div className="card-wrap d-flex gap-2">
      <div className="card">
        <img
          src={data.imageURL}
          alt=""
          className="cardImage"
          style={{ borderRadius: "50%" }}
        />

        <p className="cardContent">{data.name}</p>

        <p className="sub-text-small">
          {data.description && data.description.length > 20
            ? data.description.slice(0, 45) + "..."
            : data.description || ""}
        </p>

        <div
          className="delete-icon bg-danger"
          onClick={() => setIsDelete(true)}
        >
          <IoTrash className="m-auto" />
        </div>
        <div
          className="update-icon"
          onClick={() => navigate(`/dashboard/updateArtist/${data._id}`)}
        >
          <FaPen className="m-auto" />
        </div>
        {isDelete && (
          <div
            className="position-absolute d-flex flex-column justify-content-center align-items-center px-4 py-2 rounded-2"
            style={{
              top: "40%",
              left: "5%",
              backgroundColor: "#323232",
              width: "90%",
            }}
          >
            <p className="font-semibold text-center">Are you sure ?</p>

            <div className="d-flex align-items-center gap-3">
              <button
                className="border-0 px-2 rounded-2 bg-danger"
                onClick={() => {
                  deleteItem(data);
                  setIsDelete(false);
                }}
              >
                Yes
              </button>
              <button
                className="border-0 px-2 rounded-2 bg-success"
                onClick={() => setIsDelete(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
