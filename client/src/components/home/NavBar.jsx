import React from "react";
import "./../../styles/NavBar.css";
import { IoHome } from "react-icons/io5";
import { IoIosMusicalNote } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Playlist from "./Playlist";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="navBar">
      <div className="logo">
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png"
          alt=""
          style={{ maxWidth: "50%", minWidth: "50%", position: "relative" }}
          className="my-3 ms-2"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div style={{ background: "rgb(25, 25, 25)", borderRadius: "5px" }}>
        <ul>
          <li className="nav-link">
            <NavLink to={"/"}>
              <IoHome className="me-1 mb-1" style={{ minWidth: "20%" }} />
              Home
            </NavLink>
          </li>
          <li className="nav-link">
            <NavLink to={"/musics"}>
              <IoIosMusicalNote
                className="me-1 mb-1"
                style={{ minWidth: "20%" }}
              />
              Musics
            </NavLink>
          </li>
          <li className="nav-link">
            <NavLink to={"/premium"}>
              <FaStar className="me-1 mb-1" style={{ minWidth: "20%" }} />
              Premium
            </NavLink>
          </li>
        </ul>
      </div>
      <Playlist />

      <div className="cookies">
        <span>Cookies</span>
        <span>Privacy</span>
      </div>
    </div>
  );
};

export default NavBar;
