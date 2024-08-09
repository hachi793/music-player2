import React, { useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import Alert from "../../pages/admin/Alert";
import "../../styles/UpdateProfile.css";
import { updateUserDetails, updateUserPassword } from "../../api";
import { useNavigate } from "react-router-dom";
import { storage } from "../../config/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { MdDelete, MdOutlineFileUpload } from "react-icons/md";

const UpdateProfile = () => {
  const [{ alertType, user }, dispatch] = useStateValue();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState(user.profileImagePath);
  const [profileImagePath, setProfileImagePath] = useState(
    user.profileImagePath
  );
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  const [errors, setError] = useState({});

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "* Please input name";
    }
    if (!email.trim()) {
      validationErrors.email = "* Please input email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "* Email is not valid";
    }
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await updateUserDetails({
          userId: user._id,
          name,
          email,
          profileImagePath,
        });
        dispatch({
          type: "SET_USER",
          user: { ...user, name, email, profileImagePath },
        });
        navigate("/");
      } catch (err) {
        console.error("Update details failed:", err.message);
      }
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!password.trim()) {
      validationErrors.password = "* Please input current password";
    } else if (
      password.length < 10 ||
      !/[A-Z]/.test(password) ||
      !/[!@#$%^&*()\\|,.<>?]+/.test(password)
    ) {
      validationErrors.password =
        "Password must have at least 10 letters, 1 capital letter and 1 special character";
    }

    if (password && !newPassword.trim()) {
      validationErrors.newPassword = "* Please input new password";
    }
    if (
      newPassword &&
      (newPassword.length < 10 ||
        !/[A-Z]/.test(newPassword) ||
        !/[!@#$%^&*()\\|,.<>?]+/.test(newPassword))
    ) {
      validationErrors.newPassword =
        "Password must have at least 10 letters, 1 capital letter and 1 special character";
    }
    if (newPassword && !confirmNewPassword.trim()) {
      validationErrors.confirmNewPassword = "* Please confirm the new password";
    } else if (confirmNewPassword !== newPassword) {
      validationErrors.confirmNewPassword =
        "Passwords do not match, please confirm again";
    }
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await updateUserPassword({
          userId: user._id,
          password,
          newPassword,
          confirmNewPassword,
        });
        navigate("/login");
      } catch (err) {
        setError((prevErrors) => ({
          ...prevErrors,
          password:
            err === "Incorrect password" ? "Password is not correct" : err,
        }));
      } finally {
      }
    }
  };

  const uploadProfileImage = (e) => {
    const uploadedProfileImage = e.target.files[0];
    setProfileImage(URL.createObjectURL(uploadedProfileImage));
    uploadFile(uploadedProfileImage, setProfileImagePath);
  };

  const uploadFile = (file, setFileURL) => {
    const fileName = `image/user/${Date.now()}-${file.name}`;
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

  const deleteFileObject = () => {
    if (profileImage && profileImagePath) {
      const deleteRef = ref(storage, profileImagePath);
      deleteObject(deleteRef).then(() => {
        setProfileImage(null);
        setProfileImagePath(null);
      });
    }
  };

  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main update-profile-page">
          <div className="profile-page">
            <div className="main-inner">
              <div className="profile-page-main mx-3">
                <div className="profile-image">
                  {profileImage ? (
                    <>
                      <img src={profileImagePath} alt={user?.name} />
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
                    </>
                  ) : (
                    <FileUploader
                      onUpload={uploadProfileImage}
                      fileType="image"
                    />
                  )}
                </div>
                <div className="profile-page-info">
                  <h1> Update Profile</h1>
                </div>
              </div>
            </div>
            <div className="profile-content">
              <label htmlFor="">User name</label>
              <input
                type="text"
                name="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p
                  className="text-danger fw-normal py-1 px-2 mb-0"
                  style={{
                    backgroundColor: "#ffb6c1",
                    borderBottom: "3px solid red",
                  }}
                >
                  {errors.name}
                </p>
              )}
              <label htmlFor="">User email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p
                  className="text-danger fw-normal py-1 px-2 w-100 mb-0"
                  style={{
                    backgroundColor: "#ffb6c1",
                    borderBottom: "3px solid red",
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div className="update-button my-3">
              <button
                type="submit"
                className="text-light"
                onClick={handleUpdateDetails}
              >
                Update
              </button>
            </div>
            <div className="password-content">
              <div className="password">
                <label htmlFor="">Current Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p
                    className="text-danger fw-normal py-1 px-2 mb-0"
                    style={{
                      backgroundColor: "#ffb6c1",
                      borderBottom: "3px solid red",
                    }}
                  >
                    {errors.password}
                  </p>
                )}
                <label htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  id=""
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {errors.newPassword && (
                  <p
                    className="text-danger fw-normal py-1 px-2 mb-0"
                    style={{
                      backgroundColor: "#ffb6c1",
                      borderBottom: "3px solid red",
                    }}
                  >
                    {errors.newPassword}
                  </p>
                )}
                <label htmlFor="">Confirm new password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                {errors.confirmNewPassword && (
                  <p
                    className="text-danger fw-normal py-1 px-2 mb-0"
                    style={{
                      backgroundColor: "#ffb6c1",
                      borderBottom: "3px solid red",
                    }}
                  >
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="update-button mt-3 mb-5">
              <button
                type="submit"
                className="text-light"
                onClick={handleUpdatePassword}
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {alertType && <Alert type={alertType} />}
      </div>
    </div>
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
          accept="image/*"
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
export default UpdateProfile;
