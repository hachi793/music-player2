import React, { useState, useEffect } from "react";
import "../../styles/ArtistDetails.css";
import { getAllSongs, getArtistById } from "../../api";
import { useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";
import UserSongCard from "./UserSongCard";

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
