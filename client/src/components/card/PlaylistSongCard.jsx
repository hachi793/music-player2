import React from "react";
import { useStateValue } from "../../context/stateProvider";
import { useNavigate } from "react-router-dom";
import { actionType } from "../../context/reducer";
import { FaPlay } from "react-icons/fa";
import { addToPlaylist, removeFromPlaylist } from "../../api";

const PlaylistSongCard = ({ playlist, data, index, fetchPlaylist }) => {
  const [{ isSongPlaying, songIndex }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const addToContext = () => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_IS_SONG_PLAYING,
        isSongPlaying: true,
      });
    }

    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };

  const handlePlaylistAction = async (songId) => {
    try {
      if (!playlist.songs.includes(songId)) {
        await addToPlaylist(playlist._id, songId);
      } else {
        await removeFromPlaylist(playlist._id, songId);
      }
      fetchPlaylist(playlist._id);
      console.log("Playlist updated successfully");
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  return (
    <div
      className="position-relative songcard mx-3 my-2 p-2 d-flex"
      style={{ width: "96%" }}
    >
      <img
        src={data.imageURL}
        style={{ width: "80px", height: "80px" }}
        alt={data.name}
        className="col-1 rounded-2 me-2"
      />
      <span className="play-song-icon">
        <FaPlay className="m-auto" onClick={() => addToContext(data, index)} />
      </span>
      <div className="song-info text-light col-3 d-flex justify-content-between flex-column">
        <p
          className="details-link fw-bold mb-1"
          onClick={() => navigate(`/songDetails/${data._id}`)}
        >
          {data.name}
        </p>
        <p
          className="details-link"
          style={{ color: "#aaa" }}
          onClick={() => navigate(`/artistDetails/${data.artistId._id}`)}
        >
          {data.artistId.name}
        </p>
      </div>
      <p
        className="col-3 info details-link"
        onClick={() => navigate(`/albumDetails/${data.albumId._id}`)}
      >
        {data.albumId.name}
      </p>
      <p className="col-2 info">{data.category}</p>
      <p className="col-1 info"></p>
      <p className="col-2 text-center">
        <button
          className="text-light py-1"
          style={{
            background: "none",
            border: "1px solid #aaa",
            borderRadius: "20px",
            width: "5rem",
          }}
          onClick={() => handlePlaylistAction(data._id)}
        >
          {playlist.songs.includes(data) ? "Remove" : "Add"}
        </button>
      </p>
    </div>
  );
};

export default PlaylistSongCard;
