import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaBell, FaUser, FaClock, FaTimes } from "react-icons/fa";
import logo from "./../assets/it-logoo.png";
import API_URL from "../config/api";

function Navbar() {
  const [notifications, setNotifications] = useState([]);

  const [hasNew, setHasNew] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    const loggedInUser = JSON.parse(
      sessionStorage.getItem("loggedInUser") || "{}",
    );

    const adminId = loggedInUser.id;

    console.log("LOGGED IN ADMIN:", loggedInUser);
    console.log("ADMIN ID:", adminId);

    if (!token || !adminId) {
      console.log("Token or Admin ID missing");
      return;
    }

    fetch(`${API_URL}/api/admins/` + adminId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch admin");
        }

        return response.json();
      })
      .then(function (data) {
        console.log("ADMIN DATA NAVBAR:", data);

        setAdminName(data.name || "Admin");
        setProfilePhoto(data.profilePhoto || "");
      })
      .catch(function (error) {
        console.log("Failed to fetch admin:", error);
      });
  }, []);

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    function fetchAdminNotifications() {
      fetch(`${API_URL}/api/notifications/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // console.log("ADMIN NOTIFICATIONS", data);

          setNotifications(data);

          if (data.length > 0) {
            setHasNew(true);
          } else {
            setHasNew(false);
          }
        })
        .catch(function (error) {
          console.log("Failed to fetch admin notifications:", error);
        });
    }

    // Fetch immediately on mount
    fetchAdminNotifications();

    // Then keep polling every 10 seconds so new complaints show up
    // without the admin having to refresh the page
    const intervalId = setInterval(fetchAdminNotifications, 10000);

    return function () {
      clearInterval(intervalId);
    };
  }, []);

  const handleBellClick = () => {
    setIsOpen(true);
    setHasNew(false);
  };

  const deleteNotification = (id) => {
    const token = sessionStorage.getItem("token");

    fetch(`${API_URL}/api/notifications/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        const updatedList = notifications.filter((item) => item._id !== id);

        setNotifications(updatedList);

        if (updatedList.length === 0) {
          setIsOpen(false);
        }
      })
      .catch(function (error) {
        console.log("Failed to delete notification:", error);
      });
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <h2 className="hello-admin">
            {profilePhoto ? (
              <img
                src={API_URL + profilePhoto + "?t=" + Date.now()}
                className="hello-admin-photo"
                alt="Admin"
              />
            ) : (
              <FaUser className="hello-admin-icon" />
            )}
            Hello, {adminName}
          </h2>
        </div>

        <div className="navbar-center">
          <h1>
            <img src={logo} className="navbar-logo" />
            IT Assets Management System
          </h1>
        </div>

        <div className="navbar-right">
          <div className="bell-container" onClick={handleBellClick}>
            <FaBell className="nav-icon" />

            {hasNew && <div className="navbar-yellow-dot"></div>}
          </div>

          <div className="divider"></div>

          <FaUser
            className="nav-icon"
            onClick={function () {
              window.location.href = "/profile";
            }}
          />

          <span>Admin</span>

          <div className="divider"></div>

          <div className="navbar-datetime">
            <FaClock className="datetime-icon" />

            <div className="datetime-text">
              <div className="current-time">
                {currentDateTime.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </div>

              <div className="current-date">
                {currentDateTime.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>📢 Assets Alerts & Notifications</h3>

              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {notifications.length === 0 ? (
                <p className="no-notif">No new notifications available.</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} className="notif-item">
                    <p className="notif-text">{notif.message}</p>

                    <button
                      className="read-delete-btn"
                      onClick={() => deleteNotification(notif._id)}
                      title="Delete notification"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
