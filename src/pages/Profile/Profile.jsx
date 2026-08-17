import React from "react";
import "./Profile.css";

function Profile() {
  return (
    <div className="Profile">
      <div className="profile-header">
        <div className="profile-photo">
          <img src="./banner-right-image.png" alt="Banner" />
        </div>
        <div className="profile-header-info">
          <label>Yatendra Kumar</label>
          <label>Administator</label>
          <label>admin@company.com</label>
        </div>
      </div>
      <div className="profile-detail">
        <div className="personal-info">
          <h1>Personal Information</h1>
          <label>
            <h2> Full Name :</h2>
            <h2>Yatendra Kumar</h2>
          </label>
          <label>
            <h2> Eamil :</h2>
            <h2>admin@company.com</h2>
          </label>
          <label>
            <h2> Phone :</h2>
            <h2>+91 65743 57272</h2>
          </label>
          <label>
            <h2> Department :</h2>
            <h2>Information Technology (I.T.)</h2>
          </label>
          <label>
            <h2> Designation :</h2>
            <h2>Administrator </h2>
          </label>
        </div>
        <div className="account-info">
          <h1>Account Information</h1>
          <label>
            <h2> Username :</h2>
            <h2>admin </h2>
          </label>
          <label>
            <h2> Role :</h2>
            <h2>Admin </h2>
          </label>
          <label>
            <h2> Account created :</h2>
            <h2>17 Aug 2026 </h2>
          </label>
          <label>
            <h2> Last login :</h2>
            <h2>Today </h2>
          </label>
          <label>
            <h2> Status :</h2>
            <h2>Active </h2>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Profile;
