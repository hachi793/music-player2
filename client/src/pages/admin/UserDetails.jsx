import React, { useEffect, useState } from "react";
import "../../styles/UserDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteUserById,
  getAllSongs,
  getAllUsers,
  getCommentsByUserId,
  getUserById,
  updateUserRole,
} from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import moment from "moment";
import { MdDelete } from "react-icons/md";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [{ user, isSongPlaying, songIndex, allSongs }, dispatch] =
    useStateValue();
  const [userData, setUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isUserRoleUpdated, setIsUserRoleUpdated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      setUserData(data);
      const comments = await getCommentsByUserId(id);
      setComments(comments);
    };
    fetchUser();
  }, [id, dispatch]);

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      if (users) {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: users,
        });
      }
    } catch (err) {
      console.log("Fetch all users failed", err.message);
    }
  };

  useEffect(() => {
    if (!allSongs || allSongs.length === 0) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data,
        });
      });
    }
  }, [allSongs, dispatch]);

  const handleRoleUpdate = async () => {
    try {
      const updatedUser = await updateUserRole(
        userData._id,
        userData.role === "admin" ? "member" : "admin"
      );
      if (updatedUser) {
        dispatch({
          type: actionType.UPDATE_USER_ROLE,
          user: updatedUser,
        });
        setIsUserRoleUpdated(false);
        fetchAllUsers();
      }
    } catch (err) {
      console.log("Error updating user role:", err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const deleteUser = await deleteUserById(userData._id);
      if (deleteUser) {
        fetchAllUsers();
      }
    } catch (err) {
      console.log("Error deleting user: ", err.message);
    }
  };

  const addToContext = (song, index) => {
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  const findSongById = (songId) => {
    const song = allSongs.find((song) => song._id === songId);
    return song ? song : null;
  };

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="user-detail-page">
            {user.role === "admin" ? (
              <div className="main-inner">
                {userData ? (
                  <>
                    <div className="details-page-info">
                      <div className="details-info-img">
                        <img src={userData.profileImagePath} alt="" />
                      </div>
                      <div className="details-page-content">
                        <div className="small-textBold">User</div>
                        <h1>{userData.name}</h1>
                        <p>
                          Email:{" "}
                          <span className="small-text">{userData.email}</span>
                        </p>
                        {/* Role change */}
                        <p>
                          Role:{" "}
                          <span className="small-text position-relative">
                            {userData.role}
                          </span>
                          {userData._id !== user?._id && (
                            <span
                              className="fw-semibold px-2 py-1 mx-2 text-dark rounded-2"
                              style={{
                                backgroundColor: "#32CD32",
                                cursor: "pointer",
                              }}
                              onClick={() => setIsUserRoleUpdated(true)}
                            >
                              Change role
                            </span>
                          )}
                          {isUserRoleUpdated && (
                            <div
                              className="position-absolute d-flex flex-column align-items-center justify-content-center rounded-3 px-4 py-2"
                              style={{
                                backgroundColor: "#71797E",
                                zIndex: "3",
                                left: "29%",
                              }}
                            >
                              <p className="text-center text-light">
                                Change role to
                              </p>
                              <p
                                className="btn text-white"
                                style={{
                                  backgroundColor: "#32CD32",
                                  width: "100px",
                                  height: "40px",
                                }}
                                onClick={handleRoleUpdate}
                              >
                                {userData.role === "admin" ? "Member" : "Admin"}
                              </p>
                              <p
                                className="btn btn-danger text-white"
                                style={{ width: "100px", height: "40px" }}
                                onClick={() => setIsUserRoleUpdated(false)}
                              >
                                Cancel
                              </p>
                            </div>
                          )}
                        </p>
                        {/* Create At */}
                        <p>
                          Created at:{" "}
                          <span className="small-text">
                            {moment(new Date(userData.createdAt)).format(
                              "HH:mm MMM Do YYYY "
                            )}
                          </span>
                        </p>

                        {userData._id !== user._id && (
                          <p
                            className="btn position-absolute rounded-5 d-flex p-2 m-2 fs-3 text-bg-danger"
                            style={{ right: "3%", bottom: "5%" }}
                            onClick={handleDeleteUser}
                          >
                            <MdDelete className="text-light" />
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Favorite Song */}
                    <div className="more-info m-4">
                      <div className="small-text">
                        {userData.name}'s favorite songs:
                        {allSongs &&
                          allSongs
                            .filter((song) =>
                              userData.favoriteSongs?.includes(song._id)
                            )
                            .map((song, index) => (
                              <motion.div
                                key={song._id}
                                className="position-relative songcard mx-3 my-2 p-2 "
                              >
                                <img
                                  src={song.imageURL}
                                  style={{ width: "80px", height: "80px" }}
                                  alt={`${song.name} cover`}
                                  className="col-1 rounded-2 me-2"
                                />
                                <span className="play-song-icon">
                                  <FaPlay
                                    className="m-auto"
                                    onClick={() => addToContext(song, index)}
                                  />
                                </span>
                                <div className="song-info text-light col-5 d-flex justify-content-between flex-column">
                                  <p className="fw-bold">{song.name}</p>
                                  <p
                                    style={{ color: "#aaa" }}
                                    className="details-link"
                                    onClick={() =>
                                      navigate(
                                        `/artistDetails/${song.artistId._id}`
                                      )
                                    }
                                  >
                                    {song.artistId?.name}
                                  </p>
                                </div>
                                <p
                                  className="col-2 details-link"
                                  onClick={() =>
                                    navigate(
                                      `/albumDetails/${song.albumId._id}`
                                    )
                                  }
                                >
                                  {song.albumId?.name}
                                </p>
                                <p className="col-2">{song.category}</p>
                                <p className="col-2">
                                  {formatDuration(song.audioURL?.length || 0)}
                                </p>
                              </motion.div>
                            ))}
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="m-4">
                      <p className="small-text">
                        All comments of {userData.name} :
                      </p>
                      <div className="comments-section mx-3">
                        {comments &&
                          comments
                            .sort(
                              (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                            )
                            .map((comment) => {
                              const song = findSongById(comment.songId);
                              return (
                                <div
                                  key={comment._id}
                                  className="comment-item my-3"
                                >
                                  {user && (
                                    <div className="d-flex gap-3 align-items-center">
                                      <img
                                        src={song.imageURL}
                                        style={{
                                          borderRadius: "50%",
                                          width: "3rem",
                                          height: "3rem",
                                        }}
                                        alt=""
                                      />
                                      <div>
                                        <p className="small-text d-flex">
                                          <div
                                            className="details-link"
                                            onClick={() =>
                                              navigate(
                                                `/songDetails/${song._id}`
                                              )
                                            }
                                          >
                                            {song.name}
                                          </div>
                                          <p className="small-text ms-3">
                                            {moment(
                                              new Date(comment.createdAt)
                                            ).format("YYYY-MM-DD")}
                                          </p>
                                        </p>
                                        <p>{comment.content}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            ) : (
              <p>Only admin can review this</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
