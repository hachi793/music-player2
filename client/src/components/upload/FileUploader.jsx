import React from "react";
import { MdOutlineFileUpload } from "react-icons/md";

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

export default FileUploader;
