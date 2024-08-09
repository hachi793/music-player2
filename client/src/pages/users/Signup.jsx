import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Signup.css";
import { NavLink } from "react-bootstrap";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config/firebase.config";
import { MdOutlineFileUpload } from "react-icons/md";
import { signupUser } from "../../api";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePath, setProfileImagePath] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [{ user }, dispatch] = useStateValue();

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

  const handleSubmit = async (e) => {
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
    if (!password.trim()) {
      validationErrors.password = "* Please input password";
    } else if (
      password.length < 10 ||
      !/[A-Z]/.test(password) ||
      !/[!@#$%^&*()\\|,.<>?]+/.test(password)
    ) {
      validationErrors.password =
        "Password must have at least 10 letters, 1 capital letter, and 1 special character";
    }
    if (!confirmPassword.trim()) {
      validationErrors.confirmPassword = "* Please confirm password";
    } else if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const newUser = await signupUser({
          name: name,
          email: email,
          profileImagePath: profileImagePath,
          password: password,
        });
        dispatch({
          type: actionType.SET_USER,
          user: newUser,
        });
        navigate("/");
      } catch (err) {
        console.log("Signup failed", err.message);
      }
    }
  };

  return (
    <>
      <div>
        <header>
          <div className="logo bg-black py-4 pe-0 ps-3">
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
              alt=""
              style={{ width: "120px" }}
            />
          </div>
        </header>
      </div>

      <section
        className="d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(rgba(11,1,1,0.9) 0%, rgba(0,0,0) 100%)",
        }}
      >
        <div
          className="main my-5 mx-0 p-2 bg-dark"
          style={{
            width: "734px",
            height: "950px",
            borderRadius: "5px",
          }}
        >
          <h1 className="text-center my-5 mx-0 text-light fs-1">
            Sign up for a free Spotify account
          </h1>

          <div className="sign-up d-flex justify-content-center align-items-center fw-bold">
            <form onSubmit={handleSubmit}>
              <div style={{ position: "relative" }}>
                <label className="text-white fs-6 mb-1 d-inline-block">
                  What should we call you?
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p
                    className="text-danger fw-normal py-1 px-2"
                    style={{
                      backgroundColor: "#ffb6c1",
                      borderBottom: "3px solid red",
                    }}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <label className="text-white fs-6 mb-1 d-inline-block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p
                    className="text-danger fw-normal py-1 px-2 w-100"
                    style={{
                      backgroundColor: "#ffb6c1",
                      borderBottom: "3px solid red",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <label className="text-white fs-6 mb-1 d-inline-block">
                  Create a password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p
                    className="text-danger fw-normal py-1 px-2"
                    style={{
                      backgroundColor: "#ffb6c1",
                      borderBottom: "3px solid red",
                    }}
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <label className="text-white fs-6 mb-1 d-inline-block">
                  Confirm your password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <p
                    className="text-danger fw-normal py-1 px-2"
                    style={{
                      backgroundColor: "#ffb6c1",
                      borderBottom: "3px solid red",
                    }}
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {profileImage ? (
                <div className="d-flex justify-content-center">
                  <img src={profileImagePath} alt="" className="w-25 h-25" />
                </div>
              ) : (
                <FileUploader onUpload={uploadProfileImage} fileType="image" />
              )}

              {errors.profileImage && (
                <p
                  className="text-danger fw-normal py-1 px-2"
                  style={{
                    backgroundColor: "#ffb6c1",
                    borderBottom: "3px solid red",
                  }}
                >
                  {errors.profileImage}
                </p>
              )}

              <p className="text-light fw-lighter">
                We may send you an email to confirm your signup
              </p>

              <button type="submit">Signup</button>
            </form>
          </div>

          <div className="hr"></div>

          <div className="last text-center my-1 mx-0 text-light">
            <span>Do you already have an account?</span>
            <NavLink
              to={"/login"}
              className="text-light text-decoration-underline"
              style={{ cursor: "pointer" }}
            >
              Log in to Spotify
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
};

const FileUploader = ({ onUpload, fileType }) => {
  return (
    <label className="h-100 d-flex justify-content-center align-items-center flex-column gap-1 text-light">
      <MdOutlineFileUpload className="fs-4" />
      <p>Click to upload {fileType}</p>
      <input
        type="file"
        accept="image/*"
        className="d-none"
        onChange={onUpload}
        style={{
          width: "0",
          height: "0",
          position: "absolute",
          overflow: "hidden",
        }}
      />
    </label>
  );
};

export default Signup;
