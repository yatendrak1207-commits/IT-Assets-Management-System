import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaUser } from "react-icons/fa";

function Profile() {
  const [editmode, setEditmode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser") || "{}",
  );

  const adminId = loggedInUser.id;

  // ================= GET ADMIN PROFILE =================

  useEffect(
    function () {
      if (!adminId) {
        return;
      }

      fetch("http://localhost:5000/api/admins/" + adminId)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to fetch admin profile");
          }

          return response.json();
        })
        .then(function (admin) {
          setName(admin.name || "");
          setEmail(admin.email || "");
          setPhone(admin.phone || "");
          setDepartment(admin.department || "");
          setDesignation(admin.designation || "");
          setRole(admin.role || "");
          setStatus(admin.status || "");
        })
        .catch(function (error) {
          console.log("Profile fetch error:", error);
        });
    },
    [adminId],
  );

  // ================= SAVE PROFILE =================

  function saveProfile() {
    fetch("http://localhost:5000/api/admins/" + adminId, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        department: department,
        designation: designation,
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return {
            ok: response.ok,
            data: data,
          };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          alert(result.data.message || "Failed to update profile");
          return;
        }

        setEditmode(false);

        alert("Profile updated successfully");
      })
      .catch(function (error) {
        console.log("Profile update error:", error);

        alert("Server se connection nahi ho raha");
      });
  }

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
          <label>{name}</label>
          <label>{designation}</label>
          <label>{email}</label>
        </div>
      </div>

      <div className="profile-detail">
        <div className="personal-info">
          <h1>Personal Information</h1>

          <label>
            <h2>Full Name :</h2>

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
          </label>

          <label>
            <h2>Email :</h2>

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
          </label>

          <label>
            <h2>Phone :</h2>

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
          </label>

          <label>
            <h2>Department :</h2>

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
          </label>

          <label>
            <h2>Designation :</h2>

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
          </label>
        </div>

        <div className="account-info">
          <h1>Account Information</h1>

          <label>
            <h2>Username :</h2>
            <span>{email}</span>
          </label>

          <label>
            <h2>Role :</h2>
            <span>{role}</span>
          </label>

          <label>
            <h2>Account created :</h2>
            <span>17 Aug 2026</span>
          </label>

          <label>
            <h2>Last login :</h2>
            <span>Today</span>
          </label>

          <label>
            <h2>Status :</h2>
            <span>{status}</span>
          </label>
        </div>
      </div>

      <button
        className={editmode ? "save-mode" : "edit-mode"}
        onClick={function () {
          if (editmode) {
            saveProfile();
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

export default Profile;
