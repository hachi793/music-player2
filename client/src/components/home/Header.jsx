import React, { useState } from "react";
import "../../styles/Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegUserCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";

function Header() {
  const [{ user }, dispatch] = useStateValue();
  const [isMenu, setMenu] = useState(false);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("user");
    dispatch({
      type: actionType.SET_USER,
      user: null,
    });
    navigate("/login");
  };

  return (
    <header
      className="position-fixed d-flex align-items-center py-2 px-4 py-md-2 px-md-6 bg-black w-100"
      style={{ top: "0", zIndex: "2", minHeight: "50px" }}
    >
      <ul className="menu d-flex justify-content-center align-items-center list-unstyled mb-0">
        <div className="d-flex align-items-center gap-4 fs-4">
          <FaChevronLeft
            style={{ color: "white", cursor: "pointer" }}
            className="change-page"
            onClick={() => navigate(-1)}
          />
          <FaChevronRight
            style={{ color: "white", cursor: "pointer" }}
            className="change-page"
            onClick={() => navigate(1)}
          />
        </div>
      </ul>
      <div
        className="rounded-pill d-flex align-items-center ms-auto gap-2 position-relative me-2"
        style={{ color: "#e5e5e5" }}
        onMouseEnter={() => setMenu(true)}
        onMouseLeave={() => setMenu(false)}
      >
        {user ? (
          <>
            <img
              src={
                user.profileImagePath
                  ? user.profileImagePath
                  : "/assets/default-profile.png"
              }
              alt=""
              className="rounded-pill"
              style={{ width: "50px" }}
            />
            {!user.profileImagePath && (
              <FaRegUserCircle style={{ width: "30px", height: "30px" }} />
            )}
            <div className="d-flex align-items-center pt-1">
              <p className="fw-bold fs-6 mb-0">{user.email}</p>
            </div>
            {isMenu && (
              <div className="profile p-2 d-flex flex-column align-items-start">
                <NavLink to={"/userProfile"}>
                  <p>Profile</p>
                </NavLink>
                <NavLink to={"/myFavorites"}>
                  <p>My Favorites</p>
                </NavLink>
                {user.role === "admin" && (
                  <NavLink to={"/dashboard/users"}>
                    <p>Dashboard</p>
                  </NavLink>
                )}
                <NavLink to={"/login"} onClick={logOut}>
                  <p>Sign out</p>
                </NavLink>
              </div>
            )}
          </>
        ) : (
          <NavLink
            to={"/login"}
            className="d-flex align-items-center text-light text-decoration-none"
          >
            <FaRegUserCircle style={{ width: "30px", height: "30px" }} />
            <p className="px-2 mb-0">Sign in</p>
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Header;
