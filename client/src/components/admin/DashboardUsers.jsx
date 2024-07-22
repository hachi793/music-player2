import React, { useEffect, useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import "../../styles/DashboardUsers.css";
import { actionType } from "../../context/reducer";
import { FaSearch, FaStar, FaRegUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import { getAllUsers, updateUserRole, deleteUserById } from "../../api";

const DashboardUsers = () => {
  const [{ allUsers, user }, dispatch] = useStateValue();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      if (users) {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: users,
        });
        setFilteredUsers(users);
      }
    } catch (err) {
      console.log("Fetch all users failed", err.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.name && user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="w-100 vh-200 d-flex flex-column align-items-center ">
      <div
        className="position-relative w-100 d-flex flex-column justify-content-start align-items-center rounded-2 py-2"
        style={{
          minHeight: "400px",
          overflowY: "scroll",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none",
        }}
      >
        <div className="position-relative w-100 my-3 p-3 d-flex align-items-center">
          <p className="fw-bold my-auto mx-2">
            <span>Total: </span>
            {allUsers ? allUsers.length : 0}
          </p>
          <div className="search-bar bg-white d-flex align-items-center rounded-pill mt-0 ms-3">
            <FaSearch className="text-dark" />
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div
          className="w-100 d-flex justify-content-between align-items-center fw-semibold"
          style={{ minWidth: "750px", color: "#e5e5e5" }}
        >
          <p className="text-center" style={{ width: "85px" }}>
            Image
          </p>
          <p
            className="text-center"
            style={{ width: "275px", minWidth: "160px" }}
          >
            Name
          </p>
          <p
            className="text-center"
            style={{ width: "275px", minWidth: "160px" }}
          >
            Email
          </p>
          <p
            className="text-center"
            style={{ width: "275px", minWidth: "160px" }}
          >
            Created At
          </p>
          <p
            className="text-center"
            style={{ width: "275px", minWidth: "160px" }}
          >
            Role
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <p
            style={{
              color: "#e5e5e5",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Không có dữ liệu nào trùng khớp
          </p>
        ) : (
          filteredUsers.map((data, index) => (
            <DashboardUserCard
              key={index}
              data={data}
              index={index}
              fetchAllUsers={fetchAllUsers}
            />
          ))
        )}
      </div>
    </div>
  );
};

const DashboardUserCard = ({ data, index, fetchAllUsers }) => {
  const [{ user }, dispatch] = useStateValue();
  const [isUserRoleUpdated, setIsUserRoleUpdated] = useState(false);
  const createdAt = moment(new Date(data.createdAt)).format("MMM Do YYYY");

  const handleRoleUpdate = async () => {
    try {
      const updatedUser = await updateUserRole(
        data._id,
        data.role === "admin" ? "member" : "admin"
      );
      if (updatedUser) {
        dispatch({
          type: actionType.UPDATE_USER_ROLE,
          user: updatedUser,
        });
        setIsUserRoleUpdated(false);
        fetchAllUsers(); // Refresh the list of users
      }
    } catch (err) {
      console.log("Error updating user role:", err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await deleteUserById(data._id);
      if (response) {
        fetchAllUsers(); // Refresh the list of users
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
      {data._id !== user?._id && (
        <div
          className="btn-delete position-absolute rounded-2 d-flex align-items-center justify-content-center p-2 m-2"
          style={{ height: "8%", left: "4%" }}
          onClick={handleDeleteUser}
        >
          <MdDelete className="text-danger" />
        </div>
      )}
      {data._id === user?._id && (
        <div
          className="btn-delete position-absolute rounded-2 d-flex align-items-center justify-content-center p-2 m-2"
          style={{ height: "8%", left: "4%" }}
        >
          <FaStar style={{ color: "yellow" }} />
        </div>
      )}

      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minWidth: "45px", width: "85px" }}
      >
        {data.imageURL ? (
          <img
            src={data.imageURL}
            alt=""
            className="rounded-pill"
            style={{ width: "50px" }}
          />
        ) : (
          <FaRegUserCircle style={{ width: "40px", height: "40px" }} />
        )}
      </div>

      {/* User info */}
      <p className="text-center" style={{ width: "275px", minWidth: "160px" }}>
        {data.name ? data.name : data._id}
      </p>

      <p className="text-center" style={{ width: "275px", minWidth: "160px" }}>
        {data.email}
      </p>
      <p className="text-center" style={{ width: "275px", minWidth: "160px" }}>
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

export default DashboardUsers;
