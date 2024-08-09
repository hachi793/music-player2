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
import { MdDelete, MdOutlineFileUpload } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
        <div
          className="upload-box rounded-2 w-50"
          style={{
            height: "50vh",
            border: "2px solid #8b8989",
            backgroundColor: "#323232",
            cursor: "pointer",
          }}
        >
          {artistImageCover ? (
            <div className="position-relative w-100 h-100 overflow-hidden rounded-3">
              <img
                src={artistImageCover}
                className="w-100 h-100 object-fit-fill"
                alt=""
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
                onClick={deleteFileObject}
              >
                <MdDelete className="text-light" />
              </button>
            </div>
          ) : (
            <FileUploader onUpload={uploadArtistImage} fileType="image" />
          )}
        </div>
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

      <div className="my-3 w-100 text-end">
        <button
          className="btn btn-primary rounded-2 text-capitalize w-25 py-3 text-light fw-bold"
          style={{
            backgroundColor: "#329f08",
            border: "none",
            outline: "none",
          }}
          onClick={saveArtist}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Artist"}
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

export default UploadNewArtist;
