import React from "react";
import { MdDelete } from "react-icons/md";
import FileUploader from "./FileUploader";

const UploadAudio = ({ songAudio, uploadSongAudio, deleteFileObject }) => {
  return (
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
        <FileUploader onUpload={uploadSongAudio} fileType="audio" />
      )}
    </div>
  );
};

export default UploadAudio;
