import React, { useEffect, useState } from "react";
import "../../styles/UserDetails.css";
import { Navigate, useParams } from "react-router-dom";
import {
  deleteUserById,
  getAllSongs,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import moment from "moment";
import { MdDelete } from "react-icons/md";
import UserSongCard from "../users/UserSongCard";
import UserComment from "../../components/comment/UserComment";

const UserDetails = () => {
  const { id } = useParams();
  const [{ user, allSongs }, dispatch] = useStateValue();
  const [userData, setUserData] = useState(null);
  const [isUserRoleUpdated, setIsUserRoleUpdated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      setUserData(data);
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
        Navigate("/dashboard/users");
      }
    } catch (err) {
      console.log("Error deleting user: ", err.message);
    }
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
                              <UserSongCard
                                key={song._id}
                                data={song}
                                index={index}
                              />
                            ))}
                      </div>
                    </div>

                    {/* Comments */}
                    <UserComment userData={userData} />
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
