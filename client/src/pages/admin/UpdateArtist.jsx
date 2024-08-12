import React, { useEffect, useState } from "react";
import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../context/stateProvider";
import { getAllArtists, updateArtistById, getArtistById } from "../../api";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { actionType } from "../../context/reducer";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import UploadImage from "../../components/upload/UploadImage";
import SaveButton from "../../components/upload/SaveButton";

const UpdateArtist = () => {
  const { id } = useParams();
  const [artistImageCover, setArtistImageCover] = useState(null);
  const [artistImageCoverURL, setArtistImageCoverURL] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [artistTwitter, setArtistTwitter] = useState("");
  const [artistInstagram, setArtistInstagram] = useState("");
  const [artistDescription, setArtistDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [{ allArtists }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchArtist = async () => {
      const artist = await getArtistById(id);
      if (artist) {
        setArtistName(artist.name);
        setArtistImageCoverURL(artist.imageURL);
        setArtistImageCover(artist.imageURL);
        setArtistTwitter(artist.twitter);
        setArtistInstagram(artist.instagram);
        setArtistDescription(artist.description);
      }
    };
    fetchArtist();
  }, [id]);

  const uploadArtistImage = (e) => {
    const uploadedArtistFile = e.target.files[0];
    setArtistImageCover(URL.createObjectURL(uploadedArtistFile));
    uploadFile(uploadedArtistFile, setArtistImageCoverURL);
  };

  const uploadFile = (file, setFileURL) => {
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
          setFileURL(downloadURL);
        });
      }
    );
  };

  const saveArtist = () => {
    if (artistImageCoverURL && artistName) {
      setIsLoading(true);

      const data = {
        name: artistName,
        imageURL: artistImageCoverURL,
        twitter: artistTwitter,
        instagram: artistInstagram,
        description: artistDescription,
      };

      updateArtistById(id, data).then((res) => {
        getAllArtists().then((artists) => {
          dispatch({
            type: actionType.SET_ALL_ARTISTS,
            allArtists: artists,
          });
        });
        setIsLoading(false);
        navigate("/dashboard/artists");
      });
    }
  };

  const deleteFileObject = () => {
    if (artistImageCover && artistImageCoverURL) {
      const deleteRef = ref(storage, artistImageCoverURL);
      deleteObject(deleteRef).then(() => {
        setArtistImageCover(null);
        setArtistImageCoverURL(null);
      });
    }
  };

  return (
    <motion.div className="d-flex flex-column justify-content-center align-items-center p-4 w-100">
      <p className="fw-semibold fs-5">Update Artist Details</p>

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
            value={artistTwitter}
            onChange={(e) => setArtistTwitter(e.target.value)}
          />

          <input
            type="text"
            placeholder="Type artist instagram..."
            className="w-100 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={artistInstagram}
            onChange={(e) => setArtistInstagram(e.target.value)}
          />

          <input
            type="text"
            placeholder="Some description about artist..."
            className="w-100 h-50 p-2 my-2 rounded-2 text-light"
            style={{ backgroundColor: "#323232", outline: "none" }}
            value={artistDescription}
            onChange={(e) => setArtistDescription(e.target.value)}
          />
        </div>
      </div>

      <SaveButton saving={saveArtist} isLoading={isLoading} />
    </motion.div>
  );
};

export default UpdateArtist;
