import React from "react";
import { IoIosMusicalNote } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ data, index }) => {
  const navigate = useNavigate();
  return (
    <div
      className="playlist d-flex gap-2 p-2 m-1"
      onClick={() => navigate(`/playlistDetails/${data._id}`)}
      style={{ cursor: "pointer" }}
    >
      {data.imageURL ? (
        <img
          src={data.imageURL}
          alt=""
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "5px",
          }}
        />
      ) : (
        <div
          style={{
            background: "#404040",
            width: "3rem",
            height: "3rem",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IoIosMusicalNote className="fs-4" />
        </div>
      )}

      <div className="d-flex flex-column justify-content-center">
        <p className="mb-0">
          {data.name ? data.name : `Playlist #${index + 1}`}
        </p>
        <p className="mb-0 small-text">
          <span>
            playlist <LuDot />
          </span>
          {data.songs.length} {data.songs.length > 1 ? "songs" : "song"}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
