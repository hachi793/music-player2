import React, { useState, useEffect } from "react";
import { IoTrash } from "react-icons/io5";
import "../../styles/ArtistCard.css";
import "../../styles/NavBar.css";
import { deleteArtistById, getAllArtists } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";

import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DeleteCard from "./DeleteCard";

const ArtistCard = ({ data, index, type }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [{ allArtist }, dispatch] = useStateValue();
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllArtists().then((data) => {
      setArtists(data.artist);
    });
  }, [artists, dispatch]);

  const deleteItem = (itemData) => {
    deleteArtistById(itemData._id).then((res) => {
      if (res.data) {
        dispatch({ type: actionType.SET_ALERT_TYPE, alertType: "success" });
        setTimeout(() => {
          dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
        }, 3000);
        setArtists(artists.filter((artist) => artist._id !== itemData._id));
      } else {
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
          <DeleteCard
            data={data}
            deleteItem={deleteItem}
            setIsDelete={setIsDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
