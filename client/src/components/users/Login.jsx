import React, { useState } from "react";
import "../../styles/Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useStateValue } from "../../context/stateProvider";
import { actionType } from "../../context/reducer";

const Login = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
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
    } else if (formData.password.length < 10) {
      validationErrors.password =
        "Password must have at least 10 letters , 1 capital letter and 1 special character";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const loggedIn = await response.json();

      if (loggedIn) {
        dispatch({ type: actionType.SET_USER, user: loggedIn.user });
        navigate("/");
      }
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div>
      <header>
        <div className="logo bg-black py-4 pe-0 ps-3">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
            alt=""
            style={{ width: "150px" }}
          />
        </div>
      </header>

      <section
        className="d-flex justify-content-center align-items-center"
        style={{
          background: "linear-gradient(rgba(11,1,1,0.9) 0% , rgba(0,0,0) 100%)",
        }}
      >
        <div
          className="main my-5 mx-0 p-2 bg-dark"
          style={{ width: "734px", height: "810px", borderRadius: "5px" }}
        >
          <h1 className="text-center my-5 mx-0 text-light fs-1">
            Login in to Spotify
          </h1>

          <div className="account-connect d-flex justify-content-center align-items-center flex-column">
            <button
              className="a-c-btn text-center p-2 my-1 mx-0 text-light fs-6"
              id="google"
              // onClick={loginWithGoogle}
            >
              <img
                src="./../image/google.png"
                alt=""
                style={{ width: "50px" }}
              />
              <FcGoogle className="me-2" />
              <span>Log in with Google</span>
            </button>
          </div>

          <div className="hr"></div>

          <div className="log-in d-flex justify-content-center align-items-center fw-bold">
            <form
              action=""
              name="login-form"
              method="post"
              onSubmit={handleSubmit}
            >
              <div style={{ position: "relative" }}>
                <label htmlFor="" className="text-white fs-6 d-block">
                  Email of username
                </label>
                <input
                  type="email"
                  placeholder="Email or username "
                  name="email"
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
                <label htmlFor="" className="text-white fs-6 mt-3 d-block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
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

              {errors.general && (
                <p className="text-danger fw-normal py-1 px-2">
                  {errors.general}
                </p>
              )}

              <button type="submit">Login</button>

              <p
                className="d-block text-center text-light fw-medium text-decoration-underline"
                style={{ cursor: "pointer" }}
              >
                Forgot password
              </p>
            </form>
          </div>

          <div className="hr"></div>

          <div className="last text-center my-1 mx-0">
            <span>Don't you have an account?</span>{" "}
            <NavLink
              to="/signup"
              className="text-light text-decoration-underline"
              style={{ cursor: "pointer" }}
            >
              Signup for Spotify
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
