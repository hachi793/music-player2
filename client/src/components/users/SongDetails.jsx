import React, { useEffect, useState } from "react";
import "../../styles/SongDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { getCommentsBySongId, getSongById, saveNewComment } from "../../api";
import { LuDot } from "react-icons/lu";
import moment from "moment";
import { FaHeart, FaPlay } from "react-icons/fa";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";

const SongDetails = () => {
  const { id } = useParams();
  const [song, setSong] = useState();
  const [content, setContent] = useState("");
  const [{ user, allComments }, dispatch] = useStateValue();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongAndComments = async () => {
      const song = await getSongById(id);
      setSong(song);
      const comments = await getCommentsBySongId(id);
      dispatch({
        type: actionType.SET_ALL_COMMENTS,
        allComments: comments,
      });
    };
    fetchSongAndComments();
  }, [id, dispatch]);

  const saveComment = async () => {
    const data = {
      userId: user._id,
      songId: song._id,
      content: content,
    };
    if (user._id && song._id && content) {
      const res = await saveNewComment(data);
      if (res) {
        const comments = await getCommentsBySongId(song._id);
        dispatch({
          type: actionType.SET_ALL_COMMENTS,
          allComments: comments,
        });
        setContent("");
      } else {
        console.log("Failed to save new comment");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveComment();
    }
  };

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="song-detail-page">
            <div className="main-inner">
              {song ? (
                <>
                  <div className="details-page-info">
                    <div className="details-info-img">
                      <img src={song.imageURL} alt={song.name} />
                    </div>
                    <div className="details-page-content">
                      <div>
                        <div className="small-textBold">Song</div>
                        <h1>{song.name}</h1>
                      </div>
                      <div className="medium-text">
                        <span>{song.artistId.name}</span>
                        <LuDot />
                        <span>{song.albumId.name}</span>
                        <LuDot />
                        <span>
                          {moment(new Date(song.createdAt)).format("MMM YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>

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
                      {user.favoriteSongs.includes(song._id) ? (
                        <FaHeart
                          className="fs-2"
                          style={{ color: "#0FFF50" }}
                        />
                      ) : (
                        <CiHeart className="fs-3" />
                      )}
                    </div>
                    <div className="dots-icon">
                      <CiMenuKebab className="fs-3" />
                    </div>
                  </div>
                  {/* Artist */}
                  <div
                    className="artist-card d-flex gap-4 mx-4 my-1 p-2"
                    onClick={() =>
                      navigate(`/artistDetails/${song.artistId._id}`)
                    }
                  >
                    <img
                      src={song.artistId.imageURL}
                      alt=""
                      style={{
                        width: "5rem",
                        height: "5rem",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <p className="mb-0 small-text">Artist</p>
                      <p className="mb-0">{song.artistId.name}</p>
                    </div>
                  </div>
                  {/* Album */}
                  <div
                    className="album-card d-flex gap-4 mx-4 my-1 p-2"
                    onClick={() =>
                      navigate(`/artistDetails/${song.albumId._id}`)
                    }
                  >
                    <img
                      src={song.albumId.imageURL}
                      alt=""
                      style={{
                        width: "5rem",
                        height: "5rem",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <p className="mb-0 small-text">Album</p>
                      <p className="mb-0">{song.albumId.name}</p>
                    </div>
                  </div>

                  <section
                    className="comment my-3 mx-3 p-2 border-5"
                    style={{ background: "#252525" }}
                  >
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={user.profileImagePath}
                        style={{
                          borderRadius: "50%",
                          width: "3rem",
                          height: "3rem",
                        }}
                        alt=""
                      />
                      <input
                        className="input-comment px-2 pt-2 text-light"
                        type="text"
                        placeholder="Write down your comment"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                  </section>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
