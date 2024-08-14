import React, { useEffect, useState } from "react";
import "../../styles/SongDetails.css";
import { useParams } from "react-router-dom";
import { getAllUsers, getSongById } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import Icons from "../../components/details/Icons";
import Hero from "../../components/details/Hero";
import SongComment from "../../components/comment/SongComment";
import SubCard from "../../components/card/SubCard";

const SongDetails = () => {
  const { id } = useParams();
  const [song, setSong] = useState();
  const [{ allUsers }, dispatch] = useStateValue();

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
                  <SubCard data={song.artistId} type={"Artist"} />
                  {/* Album */}
                  <SubCard data={song.albumId} type={"Album"} />
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
