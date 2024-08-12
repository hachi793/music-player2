import React, { useState } from "react";
import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../context/stateProvider";
import FilterButtons from "./FilterButtons";
import { filterByLanguage, filters } from "../../utils/supportFunctions";
import { getAllSongs, saveNewSong } from "../../api";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../../styles/UpdateNewSong.css";
import UploadImage from "../../components/upload/UploadImage";
import UploadAudio from "../../components/upload/UploadAudio";
import SaveButton from "../../components/upload/SaveButton";

const UploadNewSong = () => {
  const [songName, setSongName] = useState("");
  const [songImageCover, setSongImageCover] = useState(null);
  const [songImageCoverURL, setSongImageCoverURL] = useState(null);
  const [songAudio, setSongAudio] = useState(null);
  const [songAudioURL, setSongAudioURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const navigate = useNavigate();

  const deleteFileObject = (type) => {
    if (type === "Image") {
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
    const data = {
      name: songName,
      imageURL: songImageCoverURL,
      audioURL: songAudioURL,
      artistId: artistFilter,
      albumId: albumFilter,
      language: languageFilter,
      category: filterTerm,
    };

    console.log("Data to send:", data);

    if (
      songImageCoverURL &&
      songAudioURL &&
      songName &&
      artistFilter &&
      albumFilter &&
      languageFilter &&
      filterTerm
    ) {
      setIsLoading(true);
      saveNewSong(data)
        .then((res) => {
          if (res) {
            getAllSongs().then((songs) => {
              if (songs) {
                dispatch({
                  type: actionType.SET_ALL_SONGS,
                  allSongs: songs,
                });
              } else {
                console.error("Failed to fetch all songs");
              }
            });
          } else {
            console.error("Failed to save new song");
          }
        })
        .finally(() => {
          setIsLoading(false);
          setSongName("");
          setSongImageCover(null);
          setSongAudio(null);
          dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
          dispatch({
            type: actionType.SET_LANGUAGE_FILTER,
            languageFilter: null,
          });
          dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
          dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
          navigate("/dashboard/songs");
        });
    } else {
      console.error("Required fields are missing");
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
      <p className="fw-semibold fs-5">New Song Details</p>
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
        <UploadImage
          imageCover={songImageCover}
          uploadImage={uploadSongImage}
          deleteFileObject={deleteFileObject}
        />

        <UploadAudio
          songAudio={songAudio}
          uploadSongAudio={uploadSongAudio}
          deleteFileObject={deleteFileObject}
        />
      </div>
      <SaveButton saving={saveSong} isLoading={isLoading} />
    </motion.div>
  );
};

export default UploadNewSong;
