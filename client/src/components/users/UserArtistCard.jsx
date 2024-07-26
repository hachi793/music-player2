import React from "react";
import "../../styles/ArtistCard.css";
import { useStateValue } from "../../context/stateProvider";

import { motion } from "framer-motion";

const UserArtistCard = ({ data, index, type }) => {
  const [{ alertType }, dispatch] = useStateValue();

  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="songcard position-relative m-3 p-3 rounded-2"
      style={{
        width: "15%",
        maxHeight: "300px",
        cursor: "pointer",
        border: "2px solid #323232",
      }}
    >
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          width: "100%",
          height: "40%",
          minHeight: "160px",
        }}
      >
        <img
          src={data.imageURL}
          alt=""
          className="w-100 h-100 object-fit-cover"
        />

        <div className="w-100 text-light col-5 d-flex justify-content-center ">
          <p className="fw-bold w-100">{data.name}</p>
        </div>

        <p className="" style={{ color: "#7c7c7c", marginTop: "-20px" }}>
          {data.description && data.description.length > 20
            ? data.description.slice(0, 45) + "..."
            : data.description}
        </p>
      </div>
    </motion.div>
  );
};

export default UserArtistCard;
