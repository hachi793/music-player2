import React, { useState } from "react";
import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../context/stateProvider";
import { getAllArtists, saveNewArtist } from "../../api";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UploadImage from "../../components/upload/UploadImage";
import SaveButton from "../../components/upload/SaveButton";

const UploadNewArtist = () => {
  const [artistImageCover, setArtistImageCover] = useState(null);
  const [artistImageCoverURL, setArtistImageCoverURL] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [artistTwt, setArtistTwt] = useState("");
  const [artistIns, setArtistIns] = useState("");
  const [artistDescript, setArtistDescript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [{ allArtists }, dispatch] = useStateValue();

  const uploadArtistImage = (e) => {
    const uploadedArtistFile = e.target.files[0];
    setArtistImageCover(URL.createObjectURL(uploadedArtistFile));
    uploadFile(uploadedArtistFile);
  };

  const uploadFile = (file) => {
    const fileName = `image/artist/${Date.now()}-${file.name}`;
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
          setArtistImageCoverURL(downloadURL);
        });
      }
    );
  };

  const saveArtist = () => {
    if (artistName && artistImageCoverURL && artistDescript) {
      setIsLoading(true);
      const data = {
        name: artistName,
        imageURL: artistImageCoverURL,
        twitter: artistTwt,
        instagram: artistIns,
        description: artistDescript,
      };

      saveNewArtist(data).then((res) => {
        if (res) {
          getAllArtists().then((artists) => {
            dispatch({
              type: actionType.SET_ALL_ARTISTS,
              allArtists: artists,
            });
          });
          setIsLoading(false);
          setArtistName("");
          setArtistImageCover(null);
          setArtistTwt("");
          setArtistIns("");
          setArtistDescript("");
          navigate("/dashboard/artists");
        } else {
          setIsLoading(false);
        }
      });
    }
  };

  const deleteFileObject = () => {
    if (artistImageCoverURL) {
      const deleteRef = ref(storage, artistImageCoverURL);
      deleteObject(deleteRef).then(() => {
        setArtistImageCover(null);
        setArtistImageCoverURL(null);
      });
    }
  };

  return (
    <motion.div className="d-flex flex-column justify-content-center align-items-center p-4 w-100">
      <p className="fw-semibold fs-5">New Artist Details</p>

      <div className="w-100 d-flex">
        <UploadImage
          imageCover={artistImageCover}
          uploadImage={uploadArtistImage}
          deleteFileObject={deleteFileObject}
        />
        <div className="ms-3 w-50">
          <input
            type="text"
            placeholder="Type your artist name..."
            className="w-100 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Type artist twitter..."
            className="w-100 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={artistTwt}
            onChange={(e) => setArtistTwt(e.target.value)}
          />

          <input
            type="text"
            placeholder="Type artist instagram..."
            className="w-100 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={artistIns}
            onChange={(e) => setArtistIns(e.target.value)}
          />
          <input
            type="text"
            placeholder="Some description about artist..."
            className="w-100 h-50 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={artistDescript}
            onChange={(e) => setArtistDescript(e.target.value)}
          />
        </div>
      </div>

      <SaveButton saving={saveArtist} isLoading={isLoading} />
    </motion.div>
  );
};

export default UploadNewArtist;
