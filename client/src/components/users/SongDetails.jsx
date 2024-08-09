import React, { useEffect, useState } from "react";
import "../../styles/SongDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteCommentsById,
  getAllUsers,
  getCommentsBySongId,
  getSongById,
  saveNewComment,
} from "../../api";
import { LuDot } from "react-icons/lu";
import moment from "moment";
import { FaHeart, FaPlay } from "react-icons/fa";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";

const SongDetails = () => {
  const { id } = useParams();
  const [song, setSong] = useState();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [{ user, allUsers }, dispatch] = useStateValue();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongAndComments = async () => {
      const song = await getSongById(id);
      setSong(song);
      const comments = await getCommentsBySongId(id);
      setComments(comments);
    };
    fetchSongAndComments();
  }, [id, dispatch]);

  useEffect(() => {
    if (!allUsers || allUsers.length === 0) {
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data,
        });
      });
    }
  }, [allUsers, dispatch]);

  const saveComment = async () => {
    const data = {
      userId: user._id,
      songId: song._id,
      content: content,
    };
    if (user._id && song._id && content) {
      saveNewComment(data)
        .then((res) => {
          if (res) {
            getCommentsBySongId(song._id).then((comment) => {
              if (comment) {
                setComments(...comments, comment);
              } else {
                console.error("Failed to fetch comments of song");
              }
            });
          } else {
            console.error("Failed to save new comments");
          }
        })
        .finally(() => {
          setContent("");
        });
    } else {
      console.error("Required fields are missing");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveComment();
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteCommentsById(commentId);
      if (res.success) {
        const updatedComments = comments.filter(
          (comment) => comment._id !== commentId
        );
        setComments(updatedComments);
      } else {
        console.error("Failed to delete comment: ", res.msg);
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const findUserById = (userId) => {
    const user = allUsers.find((user) => user._id === userId);
    return user ? user : null;
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
                      navigate(`/albumDetails/${song.albumId._id}`)
                    }
                  >
                    <img
                      src={song.albumId.imageURL}
                      alt=""
                      style={{
                        width: "5rem",
                        height: "5rem",
                      }}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <p className="mb-0 small-text">Album</p>
                      <p className="mb-0">{song.albumId.name}</p>
                    </div>
                  </div>
                  {/* Comments section */}
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
                      <div className="input-comment d-flex justify-content-between py-2">
                        <input
                          className=" px-2 pt-2 text-light w-100"
                          type="text"
                          placeholder="Write down your comment"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          className="py-1 text-light fw-lighter"
                          onClick={saveComment}
                        >
                          Comment
                        </button>
                      </div>
                    </div>

                    <div className="comments-section">
                      {comments &&
                        comments
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .map((comment) => {
                            const commentUser = findUserById(comment.userId);
                            return (
                              <div
                                key={comment._id}
                                className="comment-item my-3"
                              >
                                {commentUser && (
                                  <div className="d-flex gap-3 align-items-center position-relative">
                                    <img
                                      src={commentUser.profileImagePath}
                                      style={{
                                        borderRadius: "50%",
                                        width: "3rem",
                                        height: "3rem",
                                      }}
                                      alt=""
                                    />
                                    <div>
                                      <p className="small-text">
                                        {commentUser.name}
                                        <span className="small-text ms-3">
                                          {moment(
                                            new Date(comment.createdAt)
                                          ).format("YYYY-MM-DD")}
                                        </span>
                                      </p>
                                      <p>{comment.content}</p>
                                    </div>
                                    {/* Delete comment option */}
                                    {commentUser._id === user._id && (
                                      <div className="delete-menu position-relative">
                                        <p>Delete</p>
                                        <p>Cancel</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
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
