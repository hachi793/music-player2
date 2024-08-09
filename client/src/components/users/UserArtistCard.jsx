import React from "react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const UserArtistCard = ({ data, index, type }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="card"
      style={{ width: "200px" }}
      key={data._id}
      onClick={() => {
        navigate(`/artistDetails/${data._id}`);
      }}
    >
      <img
        className="cardImage"
        style={{ borderRadius: "50%" }}
        src={data.imageURL}
        alt={data.name}
      />
      <h5 className="cardContent">{data.name}</h5>
      <p className="sub-text-small">
        {data.description && data.description.length > 20
          ? data.description.slice(0, 45) + "..."
          : data.description || ""}
      </p>
      <span className="play-icon">
        <FaPlay className="m-auto" />
      </span>
    </motion.div>
  );
};

export default UserArtistCard;
