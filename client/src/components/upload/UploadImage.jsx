import React from "react";
import { MdDelete } from "react-icons/md";
import FileUploader from "./FileUploader";

const UploadImage = ({ imageCover, uploadImage, deleteFileObject }) => {
  return (
    <div
      className="upload-box rounded-2 w-50"
      style={{
        height: "50vh",
        border: "2px solid #8b8989",
        backgroundColor: "#323232",
        cursor: "pointer",
      }}
    >
      {imageCover ? (
        <div className="position-relative w-100 h-100 overflow-hidden rounded-3">
          <img
            src={imageCover}
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
            onClick={() => deleteFileObject("Image")}
          >
            <MdDelete className="text-light" />
          </button>
        </div>
      ) : (
        <FileUploader onUpload={uploadImage} fileType="image" />
      )}
    </div>
  );
};

export default UploadImage;
