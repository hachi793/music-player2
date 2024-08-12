import React, { useEffect, useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import "../../styles/DashboardUsers.css";
import { actionType } from "../../context/reducer";
import { FaSearch } from "react-icons/fa";
import { getAllUsers } from "../../api";
import UserCard from "../../components/card/UserCard";

const DashboardUsers = () => {
  const [{ allUsers }, dispatch] = useStateValue();
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
          minHeight: "70vh",
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
            <UserCard
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

export default DashboardUsers;
