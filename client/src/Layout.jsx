import React from "react";
import { Outlet } from "react-router-dom";
import { useStateValue } from "./context/stateProvider";
import NavBar from "./components/home/NavBar";
import Header from "./components/home/Header";
import MusicPlayer from "./components/MusicPlayer";

const Layout = () => {
  const [{ isSongPlaying }] = useStateValue();

  return (
    <div className="position-relative text-light" style={{ minWidth: "680px" }}>
      <Header />
      <div className="d-flex">
        <div style={{ width: "15%" }}>
          <NavBar />
        </div>
        <div style={{ width: "85%" }}>
          <Outlet />
        </div>
      </div>
      {isSongPlaying && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x d-flex justify-content-center align-items-center"
          style={{
            minWidth: "700px",
            width: "100%",
            backgroundColor: "#323232",
            zIndex: 4,
          }}
        >
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default Layout;
