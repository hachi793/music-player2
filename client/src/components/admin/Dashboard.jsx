import React from "react";
import "../../styles/Dashboard.css";
import DashboardUsers from "./DashboardUsers";
import DashboardSongs from "./DashboardSongs";
import DashboardAlbums from "./DashboardAlbums";
import DashboardArtists from "./DashboardArtists";
import { NavLink, Routes, Route } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useStateValue } from "../../context/stateProvider";
import UploadNewSong from "./UploadNewSong";
import UploadNewArtist from "./UploadNewArtist";
import UploadNewAlbum from "./UploadNewAlbum";
import UpdateAlbum from "./UpdateAlbum";
import UpdateArtist from "./UpdateArtist";
import UpdateSong from "./UpdateSong";

const Dashboard = () => {
  const [{ alertType }] = useStateValue();
  return (
    <>
      <div className="outerWrap">
        <div className="app">
          <div className="main" style={{ marginTop: "50px" }}>
            <div className="dashboard-menu">
              <NavLink to={"/dashboard/users"}>Users</NavLink>
              <NavLink to={"/dashboard/songs"}>Song</NavLink>
              <NavLink to={"/dashboard/albums"}>Album</NavLink>
              <NavLink to={"/dashboard/artists"}>Artist</NavLink>
            </div>

            <div className="w-100 my-3 p-3 d-flex gap-5">
              <Routes>
                {/* Admin */}
                <Route path="/users" element={<DashboardUsers />} />
                <Route path="/songs" element={<DashboardSongs />} />
                <Route path="/albums" element={<DashboardAlbums />} />
                <Route path="/artists" element={<DashboardArtists />} />

                {/* Upload data */}
                <Route path="/newSong" element={<UploadNewSong />} />
                <Route path="/newArtist" element={<UploadNewArtist />} />
                <Route path="/newAlbum" element={<UploadNewAlbum />} />

                {/* Update data*/}
                <Route path="/updateArtist/:id" element={<UpdateArtist />} />
                <Route path="/updateSong/:id" element={<UpdateSong />} />
                <Route path="/updateAlbum/:id" element={<UpdateAlbum />} />
              </Routes>
            </div>
          </div>

          {alertType && <Alert type={alertType} />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
