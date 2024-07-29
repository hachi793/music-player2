import React, { useEffect, useState } from "react";
import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../context/stateProvider";
import FilterButtons from "./FilterButtons";
import { filterByLanguage, filters } from "../../utils/supportFunctions";
import { getAllSongs, getSongById, updateSongById } from "../../api";
import { actionType } from "../../context/reducer";
import { MdDelete, MdOutlineFileUpload } from "react-icons/md";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSong = () => {
  const { id } = useParams();
  const [songName, setSongName] = useState("");
  const [songImageCover, setSongImageCover] = useState(null);
  const [songImageCoverURL, setSongImageCoverURL] = useState(null);
  const [songAudio, setSongAudio] = useState(null);
  const [songAudioURL, setSongAudioURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [
    {
      allArtists,
      allAlbums,
      artistFilter,
      albumFilter,
      filterTerm,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  useEffect(() => {
    const fetchSong = async () => {
      const song = await getSongById(id);
      if (song) {
        setSongName(song.name);
        setSongImageCover(song.imageURL);
        setSongImageCoverURL(song.imageURL);
        setSongAudio(song.audioURL);
        setSongAudioURL(song.audioURL);
        const artistsList = Array.isArray(allArtists) ? allArtists : [];
        const artist = artistsList.find(
          (artist) => artist._id === song.artistId?._id
        );
        dispatch({
          type: actionType.SET_ARTIST_FILTER,
          artistFilter: artist,
        });
        const albumsList = Array.isArray(allAlbums) ? allAlbums : [];
        const album = albumsList.find(
          (album) => album._id === song.albumId?._id
        );
        dispatch({
          type: actionType.SET_ALBUM_FILTER,
          albumFilter: album,
        });
        dispatch({
          type: actionType.SET_LANGUAGE_FILTER,
          languageFilter: song.language,
        });

        dispatch({
          type: actionType.SET_FILTER_TERM,
          filterTerm: song.category,
        });
      }
    };
    fetchSong();
  }, [id, allAlbums, allArtists, dispatch]);

  const deleteFileObject = (type) => {
    if (type === "songImage") {
      const deleteRef = ref(storage, songImageCoverURL);
      deleteObject(deleteRef).then(() => {
        setSongImageCover(null);
        setSongImageCoverURL(null);
      });
    } else if (type === "songAudio") {
      const deleteRef = ref(storage, songAudioURL);
      deleteObject(deleteRef).then(() => {
        setSongAudio(null);
        setSongAudioURL(null);
      });
    }
  };

  const uploadFile = (file, setFileURL) => {
    const fileName = `${
      setFileURL === setSongAudioURL ? "audio" : "image/song"
    }/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload failed", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileURL(downloadURL);
        });
      }
    );
  };

  const saveSong = () => {
    if (songImageCoverURL && songAudioURL) {
      setIsLoading(true);
      const data = {
        name: songName,
        imageURL: songImageCoverURL,
        audioURL: songAudioURL,
        artistId: artistFilter,
        albumId: albumFilter,
        language: languageFilter,
        category: filterTerm,
      };

      updateSongById(id, data).then(() => {
        getAllSongs().then((songs) => {
          dispatch({ type: actionType.SET_ALL_SONGS, allSongs: songs });
        });
        navigate("/dashboard/songs", { replace: true });
      });
    }
  };

  const uploadSongImage = (e) => {
    const uploadedFile = e.target.files[0];
    setSongImageCover(URL.createObjectURL(uploadedFile));
    uploadFile(uploadedFile, setSongImageCoverURL);
  };

  const uploadSongAudio = (e) => {
    const uploadedFile = e.target.files[0];
    setSongAudio(URL.createObjectURL(uploadedFile));
    uploadFile(uploadedFile, setSongAudioURL);
  };

  return (
    <motion.div className="d-flex flex-column justify-content-center align-items-center p-4 w-100">
      <p className="fw-semibold fs-5">Update Song Details</p>
      <input
        type="text"
        placeholder="Type your song name..."
        className="w-100 p-2 rounded-2 text-light"
        style={{ backgroundColor: "#323232", outline: "none" }}
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />
      <div className="d-flex w-100 justify-content-between align-items-center flex-wrap gap-2 my-2">
        <FilterButtons filterData={allArtists} flag={"Artist"} />
        <FilterButtons filterData={allAlbums} flag={"Album"} />
        <FilterButtons filterData={filterByLanguage} flag={"Language"} />
        <FilterButtons filterData={filters} flag={"Category"} />
      </div>

      <div className="w-100 d-flex">
        <div
          className="upload-box rounded-2 w-50"
          style={{
            height: "50vh",
            border: "2px solid #8b8989",
            backgroundColor: "#323232",
            cursor: "pointer",
          }}
        >
          {songImageCover ? (
            <div className="position-relative w-100 h-100 overflow-hidden rounded-3">
              <img
                src={songImageCover}
                className="w-100 h-100 object-fit-cover"
                alt="Song Cover"
              />
              <button
                className="btn position-absolute rounded-circle border-0 bg-danger text-light fs-5"
                style={{
                  bottom: "3%",
                  right: "3%",
                  outline: "none",
                  transition: "ease-in-out",
                  border: "none",
                  paddingBottom: "10px",
                }}
                onClick={() => deleteFileObject("songImage")}
              >
                <MdDelete className="text-light" />
              </button>
            </div>
          ) : (
            <FileUploader onUpload={uploadSongImage} fileType="image" />
          )}
        </div>

        <div
          className="upload-box rounded-2 w-50 ms-3"
          style={{
            height: "50vh",
            border: "2px solid #8b8989",
            backgroundColor: "#323232",
            cursor: "pointer",
          }}
        >
          {songAudio ? (
            <div className="position-relative w-100 h-100 overflow-hidden rounded-3 d-flex justify-content-center align-items-center">
              <audio controls className="w-75">
                <source src={songAudio} type="audio/mp3" />
              </audio>
              <button
                className="btn position-absolute rounded-circle border-0 bg-danger text-light fs-5"
                style={{
                  bottom: "3%",
                  right: "3%",
                  outline: "none",
                  transition: "ease-in-out",
                  border: "none",
                  paddingBottom: "10px",
                }}
                onClick={() => deleteFileObject("songAudio")}
              >
                <MdDelete className="text-light" />
              </button>
            </div>
          ) : (
            <FileUploader onUpload={uploadSongAudio} fileType="songAudio" />
          )}
        </div>
      </div>
      <div className="my-3 w-100 text-end">
        <button
          className="btn btn-primary rounded-2 text-capitalize w-25 py-3 text-light fw-bold"
          style={{
            backgroundColor: "#329f08",
            border: "none",
            outline: "none",
          }}
          onClick={saveSong}
        >
          {isLoading ? "Saving..." : "Save Song"}
        </button>
      </div>
    </motion.div>
  );
};

const FileUploader = ({ onUpload, fileType }) => {
  return (
    <>
      <label className="h-100 d-flex justify-content-center align-items-center flex-column gap-1">
        <MdOutlineFileUpload className="fs-4" />
        <p>Click to upload {fileType}</p>
        <input
          type="file"
          className="d-none"
          accept={fileType === "image" ? "image/*" : "audio/*"}
          onChange={onUpload}
          style={{
            width: "0",
            height: "0",
            position: "absolute",
            overflow: "hidden",
          }}
        />
      </label>
    </>
  );
};

export default UpdateSong;
