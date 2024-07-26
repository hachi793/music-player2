import React, { useEffect, useState } from "react";
import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../context/stateProvider";
import { getAlbumById, updateAlbumById, getAllAlbums } from "../../api";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { actionType } from "../../context/reducer";
import { MdDelete, MdOutlineFileUpload } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const UpdateAlbum = () => {
  const { id } = useParams();

  const [albumImageCover, setAlbumImageCover] = useState(null);
  const [albumImageCoverURL, setAlbumImageCoverURL] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [{ allAlbums }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchAlbum = async () => {
      const album = await getAlbumById(id);
      console.log(album);
      if (album) {
        setAlbumName(album.name);
        setAlbumImageCover(album.imageURL);
        setAlbumImageCoverURL(album.imageURL);
        setAlbumDescription(album.description);
      }
    };
    fetchAlbum();
  }, [id]);

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
    if (albumImageCover && albumName && albumDescription) {
      setIsLoading(true);

      const data = {
        name: albumName,
        imageURL: albumImageCoverURL,
        description: albumDescription,
      };

      updateAlbumById(id, data).then((res) => {
        getAllAlbums().then((albums) => {
          dispatch({
            type: actionType.SET_ALL_ALBUMS,
            allAlbums: albums,
          });
        });
        setIsLoading(false);
        navigate("/dashboard/albums");
      });
    }
  };

  const deleteFileObject = () => {
    if (albumImageCover && albumImageCoverURL) {
      const deleteRef = ref(storage, albumImageCoverURL);
      deleteObject(deleteRef).then(() => {
        setAlbumImageCover(null);
        setAlbumImageCoverURL(null);
      });
    }
  };

  return (
    <motion.div className="d-flex flex-column justify-content-center align-items-center p-4 w-100">
      <p className="fw-semibold fs-5">Update Album Details</p>

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
          {albumImageCover ? (
            <div className="position-relative w-100 h-100 overflow-hidden rounded-3">
              <img
                src={albumImageCover}
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
                onClick={() => deleteFileObject()}
              >
                <MdDelete className="text-light" />
              </button>
            </div>
          ) : (
            <FileUploader onUpload={uploadAlbumImage} fileType="image" />
          )}
        </div>
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
            value={albumDescription}
            onChange={(e) => setAlbumDescription(e.target.value)}
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
          onClick={saveAlbum}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Album"}
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

export default UpdateAlbum;
