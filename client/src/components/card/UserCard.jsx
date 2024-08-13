import React, { useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { deleteUserById, updateUserPassword } from "../../api";
import { actionType } from "../../context/reducer";
import { MdDelete } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";

const UserCard = ({ data, fetchAllUsers }) => {
  const [{ user }, dispatch] = useStateValue();
  const [isUserRoleUpdated, setIsUserRoleUpdated] = useState(false);
  const createdAt = moment(new Date(data.createdAt)).format("MMM Do YYYY");
  const navigate = useNavigate();

  const handleRoleUpdate = async () => {
    try {
      const updatedUser = await updateUserPassword(
        data._id,
        data.role === "admin" ? "member" : "admin"
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
      const response = await deleteUserById(data._id);
      if (response) {
        fetchAllUsers();
      }
    } catch (err) {
      console.log("Error deleting user:", err.message);
    }
  };

  if (!data || !data._id) {
    return null;
  }

  return (
    <div
      className="user-info-card position-relative w-100 vh-200 rounded-2 d-flex align-items-center justify-content-between py-2 mx-3"
      style={{ cursor: "pointer", color: "#e5e5e5" }}
    >
      {data._id !== user?._id ? (
        <div
          className="btn-delete position-absolute rounded-2 d-flex align-items-center justify-content-center p-2 m-2"
          style={{ height: "8%", left: "5%" }}
          onClick={handleDeleteUser}
        >
          <MdDelete className="text-danger" />
        </div>
      ) : (
        <div className="btn-delete position-absolute rounded-2 d-flex align-items-center justify-content-center p-2 m-2"></div>
      )}

      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minWidth: "45px", width: "85px" }}
      >
        {data.profileImagePath ? (
          <img
            src={data.profileImagePath}
            alt=""
            className="rounded-pill"
            style={{ width: "50px", height: "50px" }}
          />
        ) : (
          <FaRegUserCircle style={{ width: "40px", height: "40px" }} />
        )}
      </div>

      {/* User info */}
      <p
        className="text-center mb-0 details-link"
        style={{ width: "275px", minWidth: "160px" }}
        onClick={() => navigate(`/userDetails/${data._id}`)}
      >
        {data.name ? data.name : data._id}
      </p>

      <p
        className="text-center mb-0"
        style={{ width: "275px", minWidth: "160px" }}
      >
        {data.email}
      </p>
      <p
        className="text-center mb-0"
        style={{ width: "275px", minWidth: "160px" }}
      >
        {createdAt}
      </p>
      <div
        className="text-center pt-2 position-relative gap-2 d-flex align-items-center justify-content-center"
        style={{ width: "275px", minWidth: "160px" }}
      >
        <p className="text-center">{data.role}</p>
        {data._id !== user?._id && (
          <p
            className="fw-semibold px-1 text-dark rounded-2"
            style={{ backgroundColor: "#32CD32" }}
            onClick={() => setIsUserRoleUpdated(true)}
          >
            Change role
          </p>
        )}
        {isUserRoleUpdated && (
          <div
            className="w-100 position-absolute d-flex flex-column align-items-center justify-content-center rounded-3"
            style={{
              backgroundColor: "#71797E",
              zIndex: "3",
              top: "10%",
            }}
          >
            <p className="text-center text-light">Change role to</p>
            <p
              className="btn text-white"
              style={{
                backgroundColor: "#32CD32",
                width: "100px",
                height: "40px",
              }}
              onClick={handleRoleUpdate}
            >
              {data.role === "admin" ? "Member" : "Admin"}
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
      </div>
    </div>
  );
};
export default UserCard;
