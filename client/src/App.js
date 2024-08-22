import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./pages/users/Signup";
import Login from "./pages/users/Login";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Layout from "./Layout";
import Home from "./components/home/Home";
import Music from "./pages/music/Music";
import Premium from "./pages/premium/Premium";
import Dashboard from "./pages/admin/Dashboard";
import UpdateProfile from "./pages/users/UpdateProfile";
import AlbumDetails from "./pages/users/AlbumDetails";
import ArtistDetails from "./pages/users/ArtistDetails";
import UserDetails from "./pages/admin/UserDetails";
import SongDetails from "./pages/users/SongDetails";
import Favorites from "./pages/users/Favorites";
import PlaylistDetails from "./pages/users/PlaylistDetails";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/*Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/musics" element={<Music />} />
            <Route path="/premium" element={<Premium />} />

            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/userProfile" element={<UpdateProfile />} />
            <Route path="/myFavorites" element={<Favorites />} />

            <Route path="/albumDetails/:id" element={<AlbumDetails />} />
            <Route path="/artistDetails/:id" element={<ArtistDetails />} />
            <Route path="/userDetails/:id" element={<UserDetails />} />
            <Route path="/songDetails/:id" element={<SongDetails />} />
            <Route path="/playlistDetails/:id" element={<PlaylistDetails />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
