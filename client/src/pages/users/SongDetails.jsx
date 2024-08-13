import React, { useEffect, useState } from "react";
import "../../styles/SongDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { getAllUsers, getSongById } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import Icons from "../../components/details/Icons";
import Hero from "../../components/details/Hero";
import SongComment from "../../components/comment/SongComment";

const SongDetails = () => {
  const { id } = useParams();
  const [song, setSong] = useState();
  const [{ allUsers }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const fetchSong = async (id) => {
    const song = await getSongById(id);
    setSong(song);
  };

  useEffect(() => {
    fetchSong(id);
  }, [id, dispatch]);

  useEffect(() => {
    if (!allUsers || allUsers.length === 0) {
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data,
        });
      });
    }
  }, [allUsers, dispatch]);

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="song-detail-page">
            <div className="main-inner">
              {song ? (
                <>
                  <Hero data={song} type={"Song"} />
                  <Icons data={song} />

                  {/* Artist */}
                  <div
                    className="artist-card d-flex gap-4 mx-4 my-1 p-2"
                    onClick={() =>
                      navigate(`/artistDetails/${song.artistId._id}`)
                    }
                  >
                    <img
                      src={song.artistId.imageURL}
                      alt=""
                      style={{
                        width: "5rem",
                        height: "5rem",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <p className="mb-0 small-text">Artist</p>
                      <p className="mb-0">{song.artistId.name}</p>
                    </div>
                  </div>
                  {/* Album */}
                  <div
                    className="album-card d-flex gap-4 mx-4 my-1 p-2"
                    onClick={() =>
                      navigate(`/albumDetails/${song.albumId._id}`)
                    }
                  >
                    <img
                      src={song.albumId.imageURL}
                      alt=""
                      style={{
                        width: "5rem",
                        height: "5rem",
                      }}
                    />
                    <div className="d-flex flex-column justify-content-center">
                      <p className="mb-0 small-text">Album</p>
                      <p className="mb-0">{song.albumId.name}</p>
                    </div>
                  </div>
                  {/* Comments section */}
                  <SongComment song={song} />
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
