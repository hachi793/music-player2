import React, { useState } from "react";
import UploadImage from "../../components/upload/UploadImage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../config/firebase.config";
import { updatePlaylistById } from "../../api";
import SaveButton from "../../components/upload/SaveButton";
import { motion } from "framer-motion";

const UpdatePlaylistInfo = ({ playlist }) => {
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistImageCover, setPlaylistImageCover] = useState(
    playlist.imageURL
  );
  const [playlistImageCoverURL, setPlaylistImageCoverURL] = useState(
    playlist.imageURL
  );
  const [playlistDescription, setPlaylistDescription] = useState(
    playlist.description
  );
  const [isLoading, setIsLoading] = useState(false);

  const uploadPlaylistImage = (e) => {
    const uploadedAlbumFile = e.target.files[0];
    setPlaylistImageCover(URL.createObjectURL(uploadedAlbumFile));
    uploadFile(uploadedAlbumFile, setPlaylistImageCoverURL);
  };

  const uploadFile = (file, setFileURL) => {
    const fileName = `image/playlist/${Date.now()}-${file.name}`;
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

  const savePlaylist = () => {
    setIsLoading(true);
    const data = {
      name: playlistName,
      imageURL: playlistImageCoverURL ? playlistImageCoverURL : "",
      description: playlistDescription,
      songs: playlist.songs,
    };

    updatePlaylistById(playlist._id, data).then((res) => {
      setIsLoading(false);
    });
  };

  const deleteFileObject = () => {
    if (playlistImageCover && playlistImageCoverURL) {
      const deleteRef = ref(storage, playlistImageCoverURL);
      deleteObject(deleteRef).then(() => {
        setPlaylistImageCover(null);
        setPlaylistImageCoverURL(null);
      });
    }
  };
  return (
    <motion.div
      className="position-fixed p-3"
      style={{
        background: "#252525",
        zIndex: "5",
        top: "25%",
        left: "35%",
        width: "40%",
      }}
    >
      <h3>Update Playlist Info</h3>
      <div className="d-flex h-50">
        <UploadImage
          imageCover={playlistImageCover}
          uploadImage={uploadPlaylistImage}
          deleteFileObject={deleteFileObject}
        />
        <div className="info-content ms-3">
          <input
            type="text"
            placeholder="Type playlist name..."
            className="w-100 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Type playlist description..."
            className="w-100 h-75 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={playlistDescription}
            onChange={(e) => setPlaylistDescription(e.target.value)}
          />

          <SaveButton save={savePlaylist} isLoading={isLoading} />
        </div>
      </div>
    </motion.div>
  );
};

export default UpdatePlaylistInfo;
