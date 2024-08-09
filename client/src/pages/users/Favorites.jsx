import React, { useEffect } from "react";
import { useStateValue } from "../../context/stateProvider";
import "../../styles/NavBar.css";
import "../../styles/Favorites.css";
import { FaPlay } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import { getFavoriteSongs, getAllSongs } from "../../api";
import { actionType } from "../../context/reducer";

import UserSongCard from "./UserSongCard";

const Favorites = () => {
  const [{ allSongs, favoriteSongs, user }, dispatch] = useStateValue();
  useEffect(() => {
    if (!allSongs || allSongs.length === 0) {
      getAllSongs()
        .then((data) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data,
          });
        })
        .catch((error) => console.error("Error fetching songs:", error));
    }
  }, [allSongs, dispatch]);

  useEffect(() => {
    if (user) {
      const fetchFavoriteSongs = async () => {
        try {
          const favoriteSongs = await getFavoriteSongs(user._id);
          dispatch({
            type: actionType.SET_FAVORITE_SONGS,
            favoriteSongs,
          });
        } catch (error) {
          console.error("Error fetching favorite songs:", error);
        }
      };

      fetchFavoriteSongs();
    }
  }, [user, dispatch]);

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="playlist-page">
            <div className="main-inner">
              <div className="playlist-page-info mx-3">
                <div className="playlist-page-image">
                  <img src={user.profileImagePath} alt="Playlist Cover" />
                </div>
                <div className="playlist-page-content">
                  <p className="small-textBold">Playlist</p>
                  <h1>Favorites</h1>
                  <p className="small-text">
                    A collection of your favorite songs.
                  </p>
                  <div className="playlist-page-desc d-flex gap-4 align-items-center">
                    <span>Spotify</span>
                    <span className="small-text">Likes</span>
                    <span className="small-text">Hours</span>
                  </div>
                </div>
              </div>
              <div className="playlist-song">
                <div className="icons d-flex align-items-center gap-5 ms-5">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50px",
                      background: "#1db954",
                      paddingLeft: "15px",
                      paddingTop: "8px",
                    }}
                  >
                    <FaPlay />
                  </div>

                  <div className="dots-icon">
                    <CiMenuKebab
                      style={{
                        fontSize: "30px",
                      }}
                    />
                  </div>
                </div>
                <div className="main-content">
                  <div className="d-flex flex-wrap gap-2 w-100">
                    {allSongs &&
                      allSongs
                        .filter((song) => favoriteSongs?.includes(song._id))
                        .map((song, index) => (
                          <UserSongCard
                            key={song._id}
                            data={song}
                            index={index}
                            type={song}
                          />
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
