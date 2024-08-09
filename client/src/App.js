import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/users/Signup";
import Login from "./components/users/Login";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Layout from "./Layout";
import Main from "./components/home/Main";
import Music from "./components/music/Music";
import Premium from "./components/premium/Premium";
import Dashboard from "./pages/admin/Dashboard";
import UpdateProfile from "./components/users/UpdateProfile";
import AlbumDetails from "./components/users/AlbumDetails";
import ArtistDetails from "./components/users/ArtistDetails";
import Favorites from "./components/users/Favorites";
import UserDetails from "./pages/admin/UserDetails";
import SongDetails from "./components/users/SongDetails";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
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
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
