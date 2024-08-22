import React from "react";
import { IoIosMusicalNote } from "react-icons/io";

const PlaylistImage = ({ playlist }) => {
  return (
    <div className="details-page-info">
      <div className="details-info-img">
        {playlist.imageURL ? (
          <img src={playlist.imageURL} alt={playlist.name} />
        ) : (
          <div
            style={{
              background: "#404040",
              width: "15rem",
              height: "15rem",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IoIosMusicalNote className="fs-4" />
          </div>
        )}
      </div>
      <div className="details-page-content">
        <p className="small-textBold">Playlist</p>
        <h1>{playlist.name ? playlist.name : "Playlist"}</h1>
        <p className="small-text">
          {playlist.description?.length > 300
            ? `${playlist.description.slice(0, 300)}...`
            : playlist.description}
        </p>
      </div>
    </div>
  );
};

export default PlaylistImage;
