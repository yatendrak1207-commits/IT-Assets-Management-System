import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { FaUser } from "react-icons/fa";

function UserProfile() {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const [userData, setUserData] = useState(null);

  const [editmode, setEditmode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(function () {
    async function fetchProfile() {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/employees/${loggedInUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUserData(data);

        setName(data.employeeName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setDepartment(data.department || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (loggedInUser?.id) {
      fetchProfile();
    }
  }, []);

  async function saveDetails() {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/employees/${loggedInUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            employeeName: name,
            email: email,
            phone: phone,
            department: department,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUserData(data);

      const updatedUser = {
        ...loggedInUser,
        employeeName: data.employeeName,
        email: data.email,
        phone: data.phone,
        department: data.department,
      };

      sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setEditmode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  if (!userData) {
    return (
      <div className="UserProfile">
        <p>Loading profile...</p>
      </div>
    );
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

          <label>Employee</label>

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

            <span>Employee</span>
          </div>
        </div>

        {/* Account Information */}

        <div className="account-info">
          <h1>Account Information</h1>

          <div className="profile-field">
            <label>Employee ID :</label>

            <span>{userData.employeeId}</span>
          </div>

          <div className="profile-field">
            <label>Username :</label>

            <span>{userData.email}</span>
          </div>

          <div className="profile-field">
            <label>Role :</label>

            <span>User</span>
          </div>

          <div className="profile-field">
            <label>Status :</label>

            <span>{userData.employeestatus || "Active"}</span>
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
