import React from "react";
import { Outlet } from "react-router-dom";
import { useStateValue } from "./context/stateProvider";
import NavBar from "./components/home/NavBar";
import Header from "./components/home/Header";

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
      {/* {isSongPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="position-fixed bottom-0 start-50 translate-middle-x d-flex justify-content-center align-items-center"
          style={{
            minWidth: "700px",
            width: "100%",
            backgroundColor: "#323232",
            zIndex: 4,
          }}
        >
          <MusicPlayer />
        </motion.div>
      )} */}
    </div>
  );
};

export default Layout;
