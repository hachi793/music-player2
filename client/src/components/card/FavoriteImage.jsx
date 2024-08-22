import React from "react";
import { FaHeart } from "react-icons/fa";

const FavoriteImage = () => {
  return (
    <div
      style={{
        background: "linear-gradient(#e66465, #9198e5)",
        width: "3rem",
        height: "3rem",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FaHeart />
    </div>
  );
};

export default FavoriteImage;
