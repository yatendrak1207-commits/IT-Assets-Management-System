import React from "react";
import "./Profile.css";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

function Profile() {
  const [editmode, setEditmode] = useState(false);
  const [name, setName] = useState("Yatendra kumar");
  const [email, setEmail] = useState("admin@company.com");
  const [phone, setPhone] = useState("+91 65743 57272");
  const [department, setDepartment] = useState("Information Technology (I.T.)");
  const [designation, setDesignation] = useState("Administrator");
  return (
    <div className="Profile">
      <h2>
        <FaUser />
        PROFILE
      </h2>
      <div className="profile-header">
        <div className="profile-photo">
          <img src="./slk.jpg" alt="owner" />
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
            {editmode ? (
              <input
                type="text"
                value={name}
                onChange={function (x) {
                  setName(x.target.value);
                }}
              />
            ) : (
              <h2>{name}</h2>
            )}
          </label>
          <label>
            <h2> Eamil :</h2>
            {editmode ? (
              <input
                type="email"
                value={email}
                onChange={function (x) {
                  setEmail(x.target.value);
                }}
              />
            ) : (
              <h2>{email}</h2>
            )}
          </label>
          <label>
            <h2> Phone :</h2>
            {editmode ? (
              <input
                type="text"
                value={phone}
                onChange={function (x) {
                  setPhone(x.target.value);
                }}
              />
            ) : (
              <h2>{phone}</h2>
            )}
          </label>
          <label>
            <h2> Department :</h2>
            {editmode ? (
              <input
                type="text"
                value={department}
                onChange={function (x) {
                  setDepartment(x.target.value);
                }}
              />
            ) : (
              <h2>{department}</h2>
            )}
          </label>
          <label>
            <h2> Designation :</h2>
            {editmode ? (
              <input
                type="text"
                value={designation}
                onChange={function () {
                  setDesignation(x.target.value);
                }}
              />
            ) : (
              <h2>{designation}</h2>
            )}
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
      <button
        className={editmode ? "save-mode" : "edit-mode"}
        onClick={function () {
          setEditmode(!editmode);
        }}
      >
        {editmode ? "Save Details" : "Edit Details"}
      </button>
    </div>
  );
}

export default Profile;
