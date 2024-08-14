import React from "react";
import { useNavigate } from "react-router-dom";

const SubCard = ({ data, type }) => {
  const navigate = useNavigate();
  return (
    <div
      className="artist-card d-flex gap-4 mx-4 my-1 p-2"
      onClick={() =>
        navigate(
          type === "Artist"
            ? `/artistDetails/${data._id}`
            : `/albumDetails/${data._id}`
        )
      }
    >
      <img
        src={data.imageURL}
        alt=""
        style={{
          width: "5rem",
          height: "5rem",
          borderRadius: "50%",
        }}
      />
      <div className="d-flex flex-column justify-content-center">
        <p className="mb-0 small-text">
          {type === "Artist" ? "Artist" : "Album"}
        </p>
        <p className="mb-0">{data.name}</p>
      </div>
    </div>
  );
};

export default SubCard;
