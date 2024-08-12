import React from "react";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { FaHeart, FaPlay } from "react-icons/fa";
import { useStateValue } from "../../context/stateProvider";

const Icons = ({ data }) => {
  const [{ user }] = useStateValue();

  return (
    <div className="icons d-flex align-items-center gap-5 ms-4 my-3">
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50px",
          background: "#1db954",
          paddingLeft: "15px",
          paddingTop: "8px",
        }}
      >
        <FaPlay />
      </div>
      <div className="heart-icon">
        {user.favoriteSongs.includes(data._id) ? (
          <FaHeart className="fs-2" style={{ color: "#0FFF50" }} />
        ) : (
          <CiHeart className="fs-2" />
        )}
      </div>
      <div className="dots-icon">
        <CiMenuKebab className="fs-3" />
      </div>
    </div>
  );
};

export default Icons;
