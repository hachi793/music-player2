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
import UploadImage from "../../components/upload/UploadImage";
import SaveButton from "../../components/upload/SaveButton";

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
            value={albumDescription}
            onChange={(e) => setAlbumDescription(e.target.value)}
          />
        </div>
      </div>
      <SaveButton saving={saveAlbum} isLoading={isLoading} />
    </motion.div>
  );
};

export default UpdateAlbum;
