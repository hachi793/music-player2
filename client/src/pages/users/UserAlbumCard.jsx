import React from "react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const UserAlbumCard = ({ data, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="card"
      key={data._id}
      onClick={() => {
        navigate(`/albumDetails/${data._id}`);
      }}
    >
      <img className="cardImage" src={data.imageURL} alt={data.name} />
      <h5 className="cardContent">{data.name}</h5>
      <span className="play-icon">
        <FaPlay className="m-auto" />
      </span>
    </motion.div>
  );
};

export default UserAlbumCard;
