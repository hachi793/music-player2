import React, { useState, useEffect } from "react";
import { useStateValue } from "../../context/stateProvider";
import { getAlbumById, getAllSongs } from "../../api";
import { useParams } from "react-router-dom";
import { actionType } from "../../context/reducer";
import UserSongCard from "./UserSongCard";
import Icons from "../../components/details/Icons";
import Hero from "../../components/details/Hero";

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
                  <Hero data={album} type={"Album"} />
                  <div className="album-song">
                    <Icons data={album} />
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
