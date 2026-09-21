import React, { useEffect, useState, useRef } from "react";
import "./UserProfile.css";
import { FaUser, FaCamera, FaTrash } from "react-icons/fa";

function UserProfile() {
  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser") || "{}",
  );

  const [userData, setUserData] = useState(null);

  const [editmode, setEditmode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const photoInputRef = useRef(null);

  const API_URL = "http://localhost:5000";

  // ================= GET PROFILE =================

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

        setProfilePhoto(data.profilePhoto || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (loggedInUser?.id) {
      fetchProfile();
    }
  }, []);
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

    fetch(`${API_URL}/api/employees/${loggedInUser.id}/profile-photo`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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

        setUserData(function (previous) {
          return {
            ...previous,
            profilePhoto: photoPath,
          };
        });

        alert("Profile photo updated successfully");
      })
      .catch(function (error) {
        console.error("Photo upload error:", error);

        alert("Server se connection nahi ho raha");
      })
      .finally(function () {
        setUploadingPhoto(false);
      });
  }
  // ================= REMOVE PHOTO =================

  function removeProfilePhoto() {
    const token = sessionStorage.getItem("token");

    fetch(`${API_URL}/api/employees/${loggedInUser.id}/profile-photo`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
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

        setUserData(function (previous) {
          return {
            ...previous,
            profilePhoto: "",
          };
        });

        setShowPhotoMenu(false);

        alert("Profile photo removed successfully");
      })
      .catch(function (error) {
        console.error("Photo remove error:", error);

        alert("Server se connection nahi ho raha");
      });
  }
  // ================= SAVE DETAILS =================

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

        profilePhoto: data.profilePhoto || profilePhoto,
      };

      sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setEditmode(false);

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);

      alert(error.message || "Failed to update profile");
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

      {/* ================= PROFILE HEADER ================= */}

      <div className="profile-header">
        {/* PROFILE PHOTO */}

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
              <img src="/removee.jpg" alt="Profile" />
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

          <label>Employee</label>

          <label>{email}</label>
        </div>
      </div>

      {/* ================= PROFILE DETAILS ================= */}

      <div className="profile-detail">
        {/* PERSONAL INFORMATION */}

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

        {/* ACCOUNT INFORMATION */}

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

      {/* ================= EDIT / SAVE ================= */}

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
