import React, { useState, useEffect } from "react";
import { IoTrash } from "react-icons/io5";
import "../../styles/ArtistCard.css";
import "../../styles/NavBar.css";
import { deleteAlbumById, getAllAlbums } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DeleteCard from "./DeleteCard";

const AlbumCard = ({ data }) => {
  const [isDelete, setIsDelete] = useState(false);
  const [{ allAlbums }, dispatch] = useStateValue();
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllAlbums().then((data) => {
      setAlbums(data);
    });
  }, [dispatch]);

  const deleteItem = (itemData) => {
    deleteAlbumById(itemData._id).then((res) => {
      if (res.data) {
        dispatch({ type: actionType.SET_ALERT_TYPE, alertType: "success" });
        setTimeout(() => {
          dispatch({ type: actionType.SET_ALERT_TYPE, alertType: null });
        }, 3000);
        setAlbums(albums.filter((album) => album._id !== itemData._id));
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: albums.filter((album) => album._id !== itemData._id),
        });
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
        <img src={data.imageURL} alt="" className="cardImage" />
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
          onClick={() => navigate(`/dashboard/updateAlbum/${data._id}`)}
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

export default AlbumCard;
