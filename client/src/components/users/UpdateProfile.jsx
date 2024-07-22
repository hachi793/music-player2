import React from "react";
import { useStateValue } from "../../context/stateProvider";
import Alert from "../admin/Alert";
import "../../styles/UpdateProfile.css";
const UpdateProfile = () => {
  const [{ alertType }, dispatch] = useStateValue();
  return (
    <div className="outerWrap">
      <div className="app">
        <div className="main update-profile-page">
          <div className="profile-page">
            <div className="main-inner">
              <div className="profile-page-main mx-3">
                <div className="profile-image">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/reactjs-spotify.appspot.com/o/image%2Fcover_2.jpg?alt=media&token=5ce02fed-984d-4a4d-9527-198dcb79f677"
                    alt=""
                  />
                </div>
                <div className="profile-page-info">
                  <h1>Profile</h1>
                  <p className="textBold">Name</p>
                  <p className="textSmall">Email</p>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="password">
                <label htmlFor="">Your password</label>
                <input type="password" name="password" />
                <label htmlFor="new-password">Your new password</label>
                <input type="password" name="newPassword" id="" />
                <label htmlFor="">Confirm your new password</label>
                <input type="password" name="confirmPassword" />
              </div>
            </div>
            <div className="update-button mt-5">
              <button type="submit" className="text-light">
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

export default UpdateProfile;
