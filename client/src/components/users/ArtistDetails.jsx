import React, { useState, useEffect } from "react";
import "../../styles/ArtistDetails.css";
import { getAllSongs, getArtistById } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";

const ArtistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [{ allSongs, allAlbums, isSongPlaying, songIndex }, dispatch] =
    useStateValue();

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
          allSongs: data.song,
        });
      });
    }
  }, [allSongs, dispatch]);

  const addToContext = (song, index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_IS_SONG_PLAYING,
        isSongPlaying: true,
      });
    }

    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  const filteredSongs = allSongs
    ? allSongs.filter((song) => song.artist === artist?.name)
    : [];

  const findAlbumIdByName = (name) => {
    const album = allAlbums.find((album) => name === album.name);
    return album ? album._id : null;
  };

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main page-background">
          <div className="artist-detail-page">
            <div className="main-inner">
              {artist && (
                <>
                  <div className="details-page-info">
                    <div className="details-info-img">
                      <img src={artist.imageURL} alt={artist.name} />
                    </div>
                    <div className="details-page-content">
                      <p className="small-textBold">Artist</p>
                      <h1>{artist.name}</h1>
                      <p className="small-text">
                        {artist.description.length > 300
                          ? `${artist.description.slice(0, 300)}...`
                          : artist.description}
                      </p>
                    </div>
                  </div>

                  <div className="artist-song">
                    <div className="icons d-flex align-items-center gap-5 ms-5 mt-3">
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
                      <div className="heart-icon">
                        <CiHeart style={{ fontSize: "40px" }} />
                      </div>
                      <div className="dots-icon">
                        <CiMenuKebab style={{ fontSize: "30px" }} />
                      </div>
                    </div>

                    <div className="main-content">
                      {filteredSongs.length === 0 ? (
                        <p className="no-songs-message text-center">
                          Hiện không có bài hát nào của ca sĩ này
                        </p>
                      ) : (
                        <div className="d-flex flex-wrap gap-2 w-100">
                          {filteredSongs.map((song, index) => (
                            <motion.div
                              key={song._id}
                              className="position-relative songcard mx-3 my-2 p-2 d-flex align-items-center"
                            >
                              <img
                                src={song.imageURL}
                                style={{ width: "80px", height: "80px" }}
                                alt={song.name}
                                className="col-1 rounded-2 me-2"
                              />
                              <span className="play-song-icon">
                                <FaPlay
                                  className="m-auto"
                                  onClick={() => addToContext(song, index)}
                                />
                              </span>
                              <div className="song-info text-light col-5 d-flex justify-content-between flex-column">
                                <p className="fw-bold">{song.name}</p>
                                <p style={{ color: "#aaa" }}>{song.artist}</p>
                              </div>
                              <p
                                className="col-2 details-link"
                                onClick={() => {
                                  const albumId = findAlbumIdByName(song.album);
                                  navigate(`/albumDetails/${albumId}`);
                                }}
                              >
                                {song.album}
                              </p>
                              <p className="col-2">{song.category}</p>
                              <p className="col-2">
                                {formatDuration(song.songURL.length)}
                              </p>
                            </motion.div>
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
