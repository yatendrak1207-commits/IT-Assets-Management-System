import React, { useEffect, useState, useRef } from "react";
import "./Profile.css";

import { FaUser, FaCamera, FaTrash } from "react-icons/fa";
import API_URL from "../../config/api";

function Profile() {
  const [editmode, setEditmode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const photoInputRef = useRef(null);

  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser") || "{}",
  );

  const adminId = loggedInUser.id;
  console.log("loggedInUser:", loggedInUser);
  console.log("adminId:", adminId);
  console.log("token:", sessionStorage.getItem("token"));

  // ================= GET ADMIN PROFILE =================

  useEffect(
    function () {
      if (!adminId) {
        return;
      }

      fetch(`${API_URL}/api/admins/` + adminId, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to fetch admin profile");
          }

          return response.json();
        })
        .then(function (admin) {
          console.log("ADMIN PROFILE RESPONSE:", admin);
          console.log(
            "SETTING NAME TO:",
            admin.name,
            "PHONE:",
            admin.phone,
            "DEPT:",
            admin.department,
          );

          setName(admin.name || "");
          setEmail(admin.email || "");
          setPhone(admin.phone || "");
          setDepartment(admin.department || "");
          setDesignation(admin.designation || "");
          setRole(admin.role || "");
          setStatus(admin.status || "");

          setProfilePhoto(admin.profilePhoto || "");
        })
        .catch(function (error) {
          console.log("Profile fetch error:", error);
        });
    },
    [adminId],
  );
  function handlePhotoClick() {
    if (profilePhoto) {
      setShowPhotoMenu(true);
    } else {
      photoInputRef.current.click();
    }
  }

  function openFileUpload() {
    setShowPhotoMenu(false);
    photoInputRef.current.click();
  }
  function removeProfilePhoto() {
    const token = sessionStorage.getItem("token");

    fetch(`${API_URL}/api/admins/${adminId}/profile-photo`, {
      method: "DELETE",

      headers: {
        Authorization: "Bearer " + token,
      },
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
          alert(result.data.message || "Failed to remove photo");
          return;
        }

        setProfilePhoto("");

        const updatedUser = {
          ...loggedInUser,
          profilePhoto: "",
        };

        sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        setShowPhotoMenu(false);

        alert("Profile photo removed successfully");
      })
      .catch(function (error) {
        console.log("Photo remove error:", error);
        alert("Server se connection nahi ho raha");
      });
  }
  // ================= UPLOAD PHOTO =================

  function uploadPhoto(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5 MB");

      return;
    }

    const formData = new FormData();

    formData.append("profilePhoto", file);

    setUploadingPhoto(true);

    fetch(`${API_URL}/api/admins/${adminId}/profile-photo`, {
      method: "POST",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },

      body: formData,
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
          alert(result.data.message || "Failed to upload photo");

          return;
        }

        const photoPath = result.data.profilePhoto;

        setProfilePhoto(photoPath);

        const updatedUser = {
          ...loggedInUser,
          profilePhoto: photoPath,
        };

        sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        alert("Profile photo updated successfully");
      })
      .catch(function (error) {
        console.log("Photo upload error:", error);

        alert("Server se connection nahi ho raha");
      })
      .finally(function () {
        setUploadingPhoto(false);
      });
  }

  // ================= SAVE PROFILE =================

  function saveProfile() {
    fetch(`${API_URL}/api/admins/` + adminId, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + sessionStorage.getItem("token"),
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

        const updatedUser = {
          ...loggedInUser,

          name: result.data.name,

          email: result.data.email,

          phone: result.data.phone,

          profilePhoto: result.data.profilePhoto || profilePhoto,
        };

        sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

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
        {/* ================= PROFILE PHOTO ================= */}

        <div className="profile-photo-container">
          <div
            className="profile-photo"
            onClick={handlePhotoClick}
            title={
              profilePhoto ? "Profile photo options" : "Upload profile photo"
            }
          >
            {profilePhoto ? (
              <img
                src={API_URL + profilePhoto + "?t=" + Date.now()}
                alt="Profile"
              />
            ) : (
              <img src="./removee.jpg" alt="👤" />
            )}

            <div className="photo-upload-icon">
              <FaCamera />
            </div>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={uploadPhoto}
            disabled={uploadingPhoto}
            style={{ display: "none" }}
          />

          {uploadingPhoto && (
            <small className="photo-uploading">Uploading...</small>
          )}

          {showPhotoMenu && (
            <div className="photo-menu-overlay">
              <div className="photo-menu">
                <h3>Profile Photo</h3>

                <button onClick={openFileUpload}>
                  <FaCamera />
                  Upload Profile Photo
                </button>

                <button onClick={removeProfilePhoto}>
                  <FaTrash />
                  Remove Profile Photo
                </button>

                <button
                  onClick={function () {
                    setShowPhotoMenu(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
