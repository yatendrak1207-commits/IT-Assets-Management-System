import React, { useState } from "react";
import "./UserProfile.css";
import { FaUser } from "react-icons/fa";
import { complaints } from "../../data/data";
function UserProfile() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userData = complaints.find(function (item) {
    return item.employeeId === loggedInUser.employeeId;
  });

  const [editmode, setEditmode] = useState(false);

  const [name, setName] = useState(loggedInUser.employeeName);
  const [email, setEmail] = useState(loggedInUser.email);
  const [phone, setPhone] = useState(userData.phone);
  const [department, setDepartment] = useState(userData.department);
  const [designation, setDesignation] = useState(
    loggedInUser.designation || "Employee",
  );

  function saveDetails() {
    const updatedUser = {
      ...loggedInUser,
      employeeName: name,
      email: email,
      phone: phone,
      department: department,
      designation: designation,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    setEditmode(false);
  }

  return (
    <div className="UserProfile">
      <h2>
        <FaUser />
        PROFILE
      </h2>

      {/* Profile Header */}

      <div className="profile-header">
        <div className="profile-photo">
          <FaUser />
        </div>

        <div className="profile-header-info">
          <label>{name}</label>
          <label>{designation}</label>
          <label>{email}</label>
        </div>
      </div>

      {/* Profile Details */}

      <div className="profile-detail">
        {/* Personal Information */}

        <div className="personal-info">
          <h1>Personal Information</h1>

          <div className="profile-field">
            <label>Full Name :</label>

            {editmode ? (
              <input
                type="text"
                value={name}
                onChange={function (x) {
                  setName(x.target.value);
                }}
              />
            ) : (
              <span>{name}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email :</label>

            {editmode ? (
              <input
                type="email"
                value={email}
                onChange={function (x) {
                  setEmail(x.target.value);
                }}
              />
            ) : (
              <span>{email}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Phone :</label>

            {editmode ? (
              <input
                type="text"
                value={phone}
                onChange={function (x) {
                  setPhone(x.target.value);
                }}
              />
            ) : (
              <span>{phone}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Department :</label>

            {editmode ? (
              <input
                type="text"
                value={department}
                onChange={function (x) {
                  setDepartment(x.target.value);
                }}
              />
            ) : (
              <span>{department}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Designation :</label>

            {editmode ? (
              <input
                type="text"
                value={designation}
                onChange={function (x) {
                  setDesignation(x.target.value);
                }}
              />
            ) : (
              <span>{designation}</span>
            )}
          </div>
        </div>

        {/* Account Information */}

        <div className="account-info">
          <h1>Account Information</h1>

          <div className="profile-field">
            <label>Employee ID :</label>
            <span>{loggedInUser.employeeId}</span>
          </div>

          <div className="profile-field">
            <label>Username :</label>
            <span>{loggedInUser.email}</span>
          </div>

          <div className="profile-field">
            <label>Role :</label>
            <span>User</span>
          </div>

          <div className="profile-field">
            <label>Status :</label>
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Edit / Save Button */}

      <button
        className={editmode ? "save-mode" : "edit-mode"}
        onClick={function () {
          if (editmode) {
            saveDetails();
          } else {
            setEditmode(true);
          }
        }}
      >
        {editmode ? "Save Details" : "Edit Details"}
      </button>
    </div>
  );
}

export default UserProfile;
