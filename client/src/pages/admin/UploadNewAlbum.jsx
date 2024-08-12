import React, { useState } from "react";
import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../context/stateProvider";
import { getAllAlbums, saveNewAlbum } from "../../api";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SaveButton from "../../components/upload/SaveButton";
import UploadImage from "../../components/upload/UploadImage";

const UploadNewAlbum = () => {
  const [albumImageCover, setAlbumImageCover] = useState(null);
  const [albumImageCoverURL, setAlbumImageCoverURL] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [albumDescript, setAlbumDescript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [{ allAlbums }, dispatch] = useStateValue();

  const uploadAlbumImage = (e) => {
    const uploadedAlbumFile = e.target.files[0];
    setAlbumImageCover(URL.createObjectURL(uploadedAlbumFile));
    uploadFile(uploadedAlbumFile, setAlbumImageCoverURL);
  };

  const uploadFile = (file, setFileURL) => {
    const fileName = `image/album/${Date.now()}-${file.name}`;
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

  const saveAlbum = () => {
    if (albumName && albumImageCoverURL) {
      setIsLoading(true);
      const data = {
        name: albumName,
        imageURL: albumImageCoverURL,
        description: albumDescript,
        artistId: "",
        songs: [],
      };
      saveNewAlbum(data).then((res) => {
        if (res) {
          getAllAlbums().then((albums) => {
            if (albums) {
              dispatch({
                type: actionType.SET_ALL_ALBUMS,
                allAlbums: albums,
              });
            }
          });
          navigate("/dashboard/albums", { replace: true });
        }
      });
      setIsLoading(false);
    }
  };

  const deleteFileObject = () => {
    if (albumImageCoverURL) {
      const deleteRef = ref(storage, albumImageCoverURL);
      deleteObject(deleteRef).then(() => {
        setAlbumImageCover(null);
        setAlbumImageCoverURL(null);
      });
    }
  };

  return (
    <motion.div className="d-flex flex-column justify-content-center align-items-center p-4 w-100">
      <p className="fw-semibold fs-5">New Album Details</p>

      <div className="w-100 d-flex">
        <UploadImage
          imageCover={albumImageCover}
          uploadImage={uploadAlbumImage}
          deleteFileObject={deleteFileObject}
        />
        <div className="ms-3 w-50">
          <input
            type="text"
            placeholder="Type new album name..."
            className="w-100 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Some description about album..."
            className="w-100 h-50 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={albumDescript}
            onChange={(e) => setAlbumDescript(e.target.value)}
          />
        </div>
      </div>

      <SaveButton saving={saveAlbum} isLoading={isLoading} />
    </motion.div>
  );
};

export default UploadNewAlbum;
