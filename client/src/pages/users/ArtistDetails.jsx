import React, { useState, useEffect } from "react";
import { getAllSongs, getArtistById } from "../../api";
import { useParams } from "react-router-dom";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import UserSongCard from "./UserSongCard";
import Icons from "../../components/details/Icons";
import Hero from "../../components/details/Hero";

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [{ allSongs }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchArtist = async () => {
      const artist = await getArtistById(id);
      setArtist(artist);
    };
    fetchArtist();
  }, [id]);

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data,
        });
      });
    }
  }, [allSongs, dispatch]);

  const filteredSongs = allSongs
    ? allSongs.filter((song) => song.artistId.name === artist?.name)
    : [];

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="artist-detail-page">
            <div className="main-inner">
              {artist && (
                <>
                  <Hero data={artist} type={"Artist"} />
                  <div className="artist-song">
                    <Icons data={artist} />
                    <div className="main-content">
                      {filteredSongs.length === 0 ? (
                        <p className="no-songs-message text-center">
                          Hiện không có bài hát nào của ca sĩ này
                        </p>
                      ) : (
                        <div className="d-flex flex-wrap gap-2 w-100">
                          {filteredSongs.map((song, index) => (
                            <UserSongCard
                              key={song._id}
                              data={song}
                              index={index}
                              type={song}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {!artist && <div>Loading...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
