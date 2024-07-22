import React from "react";
import "./../../styles/NavBar.css";
import { IoHome } from "react-icons/io5";
import { IoIosMusicalNote } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();
  const navLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? "#505050" : "",
  });
  return (
    <div className="navBar">
      <div className="logo">
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png"
          alt=""
          style={{ maxWidth: "90%", minWidth: "50%", position: "relative" }}
          className="my-3 ms-2"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <ul>
        <li className="nav-link">
          <NavLink to={"/"} style={navLinkStyle}>
            <IoHome className="me-1 mb-1" style={{ minWidth: "20%" }} />
            Home
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink to={"/musics"} style={navLinkStyle}>
            <IoIosMusicalNote
              className="me-1 mb-1"
              style={{ minWidth: "20%" }}
            />
            Musics
          </NavLink>
        </li>
        <li className="nav-link">
          <NavLink to={"/premium"} style={navLinkStyle}>
            <FaStar className="me-1 mb-1" style={{ minWidth: "20%" }} />
            Premium
          </NavLink>
        </li>
      </ul>

      <div className="cookies">
        <span>Cookies</span>
        <span>Privacy</span>
      </div>
    </div>
  );
};

export default NavBar;
