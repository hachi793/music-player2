import React, { useState, useEffect } from "react";
import { useStateValue } from "../../context/stateProvider";
import "../../styles/AlbumDetails.css";
import { getAlbumById, getAllSongs } from "../../api";
import { useParams } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { actionType } from "../../context/reducer";
import UserSongCard from "./UserSongCard";

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [{ allSongs }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchAlbum = async () => {
      const album = await getAlbumById(id);
      setAlbum(album);
    };
    fetchAlbum();
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

  if (!album) {
    return <div>Loading...</div>;
  }

  const filteredSongs = allSongs
    ? allSongs.filter((song) => song.albumId.name === album.name)
    : [];

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main">
          <div className="album-detail-page">
            <div className="main-inner">
              {album ? (
                <>
                  <div className="details-page-info">
                    <div className="details-info-img">
                      <img src={album.imageURL} alt={album.name} />
                    </div>
                    <div className="details-page-content">
                      <p className="small-textBold">Album</p>
                      <h1>{album.name}</h1>
                      <p className="small-text">
                        {album.description.length > 300
                          ? `${album.description.slice(0, 300)}...`
                          : album.description}
                      </p>
                    </div>
                  </div>

                  <div className="album-song">
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
                        <CiHeart
                          style={{
                            fontSize: "40px",
                          }}
                        />
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
                      {filteredSongs.length === 0 ? (
                        <p className="no-songs-message text-center">
                          Hiện không có bài hát nào thuộc album này
                        </p>
                      ) : (
                        <div className="d-flex flex-wrap gap-2 w-100">
                          {filteredSongs
                            .sort(
                              (a, b) =>
                                new Date(b.updatedAt) - new Date(a.updatedAt)
                            )
                            .map((song, index) => (
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

export default AlbumDetails;
