import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Signup.css";
import { NavLink } from "react-bootstrap";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  console.log(formData);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.email.trim()) {
      validationErrors.email = "* Please input email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "* Email is not valid";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "* Please input password";
    } else if (
      formData.password.length < 10 ||
      !/[A-Z]/.test(formData.password) ||
      !/[!@#$%^&*()\\|,.<>?]+/.test(formData.password)
    ) {
      validationErrors.password =
        "Password must have at least 10 letter, 1 capital letter and 1 special character";
    }
    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "* Please confirm again password";
    } else if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword =
        "Password is not match, please confirm again";
    }

    if (!formData.name.trim()) {
      validationErrors.name = "* Please input name";
    }
    // if (!formData.profileImage.trim()) {
    //   validationErrors.profileImage = "Yêu cầu chọn ảnh đại diện";
    // }
    setErrors(validationErrors);
    try {
      const signup_form = new FormData();

      for (var key in formData) {
        signup_form.append(key, formData[key]);
      }

      const response = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        body: signup_form,
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.log("Signed up failed");
      }
    } catch (err) {
      console.log("Signed up failed", err.message);
    }
  };

  return (
    <>
      <div>
        <header>
          <header>
            <div className="logo bg-black py-4 pe-0 ps-3">
              <img
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
                alt=""
                style={{ width: "120px" }}
              />
            </div>
          </header>
        </header>
      </div>

      <section
        className="d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(rgba(11,1,1,0.9) 0% , rgba(0,0,0) 100%)",
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
            <form action="" onSubmit={handleSubmit}>
              <div style={{ position: "relative" }}>
                <label
                  htmlFor=""
                  className="text-white fs-6 mb-1 d-inline-block"
                >
                  What should we call you?
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
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
                <label
                  htmlFor=""
                  className="text-white fs-6 mb-1 d-inline-block"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
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
                <label
                  htmlFor=""
                  className="text-white fs-6 mb-1 d-inline-block"
                >
                  Create a password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
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
                <label
                  htmlFor=""
                  className="text-white fs-6 mb-1 d-inline-block"
                >
                  Confirm your password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              <input
                id="image"
                type="file"
                name="profileImage"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <label htmlFor="image" className=" d-flex ">
                <img
                  src="../assets/addImage.png"
                  alt="add profile"
                  style={{ width: "8%", height: "8%" }}
                />
                <p className="text-light ms-3">Upload your profile image</p>
              </label>

              {formData.profileImage && (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="profile"
                  onChange={handleChange}
                  style={{ maxWidth: "80px" }}
                />
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

export default Signup;
