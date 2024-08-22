import React, { useEffect, useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import { IoIosAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import PlaylistCard from "../card/PlaylistCard";
import { useNavigate } from "react-router-dom";
import { addNewPlaylist, getPlaylistsByUserId } from "../../api";
import FavoriteImage from "../card/FavoriteImage";

const Playlist = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const [allPlaylist, setAllPlaylist] = useState([]);

  const fetchPlaylist = async (id) => {
    const fetchedPlaylists = await getPlaylistsByUserId(id);
    setAllPlaylist(fetchedPlaylists);
  };

  useEffect(() => {
    if (user && user._id) {
      fetchPlaylist(user._id);
    }
  }, [user]);

  const addPlaylist = async () => {
    if (user && user._id) {
      const newPlaylist = {
        userId: user._id,
      };

      try {
        const res = await addNewPlaylist(newPlaylist);
        if (res) {
          const updatedPlaylists = await getPlaylistsByUserId(user._id);
          setAllPlaylist(updatedPlaylists);
        } else {
          console.error("Failed to add playlist");
        }
      } catch (error) {
        console.error("Error adding playlist:", error);
      }
    }
  };

  return (
    <div>
      {user && (
        <div
          className="mt-2"
          style={{ background: "rgb(25, 25, 25)", borderRadius: "5px" }}
        >
          <div className="d-flex justify-content-between p-2 mx-2 my-1 fs-4">
            <IoSearchOutline />
            <IoIosAdd onClick={addPlaylist} />
          </div>

          <div
            className="playlist d-flex gap-2 p-2 m-1 "
            onClick={() => navigate("/myFavorites")}
          >
            <FavoriteImage />
            <div className=" d-flex flex-column justify-content-center">
              <p className="mb-0">Favorite Song</p>
              <p className="mb-0 small-text">
                {user?.favoriteSongs?.length} songs
              </p>
            </div>
          </div>

          <div className="">
            {allPlaylist &&
            Array.isArray(allPlaylist) &&
            allPlaylist.length > 0 ? (
              allPlaylist.map((playlist, index) => (
                <PlaylistCard
                  key={playlist._id}
                  data={playlist}
                  index={index}
                />
              ))
            ) : (
              <p>No playlists available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;
