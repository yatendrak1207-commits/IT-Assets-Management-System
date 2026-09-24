import "./UserNavbar.css";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import { FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/it-logoo.png";
import React, { useEffect, useState } from "react";
import API_URL from "../../config/api";

function UserNavbar() {
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");

  const [userName, setUserName] = useState("User");

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    const loggedInUserData = JSON.parse(
      sessionStorage.getItem("loggedInUser") || "{}",
    );

    console.log("LOGGED IN USER:", loggedInUserData);
    console.log("EMPLOYEE ID:", loggedInUserData.id);

    if (!token || !loggedInUserData.id) {
      console.log("Token or Employee ID missing");
      return;
    }

    fetch(`${API_URL}/api/employees/` + loggedInUserData.id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(function (response) {
        console.log("EMPLOYEE RESPONSE STATUS:", response.status);

        if (!response.ok) {
          throw new Error("Employee data fetch failed");
        }

        return response.json();
      })
      .then(function (data) {
        console.log("EMPLOYEE DATA NAVBAR:", data);
        console.log("EMPLOYEE NAME:", data.employeeName);
        console.log("PROFILE PHOTO:", data.profilePhoto);

        setUserName(data.employeeName || "User");
        setProfilePhoto(data.profilePhoto || "");
      })
      .catch(function (error) {
        console.log("Failed to fetch user profile:", error);
      });
  }, []);
  // Current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // GET UNREAD NOTIFICATION COUNT
  // ==========================================

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return;
    }

    fetch(`${API_URL}/api/notifications/unread-count`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (typeof data.count === "number") {
          setNotificationCount(data.count);
        }
      })
      .catch(function (error) {
        console.log("Notification count error:", error);
      });
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="hello-user">
          {profilePhoto ? (
            <img
              src={API_URL + profilePhoto}
              className="hello-profile-photo"
              alt="User"
            />
          ) : (
            <FaUser className="hello-user-icon" />
          )}
          Hello, {userName}
        </h2>
      </div>

      <div className="navbar-center">
        <h1>
          <img src={logo} className="navbar-logo" />
          IT Assets Management System
        </h1>
      </div>

      <div className="navbar-right">
        {/* NOTIFICATION */}

        <div className="notification-icon-wrapper">
          <FaBell
            className="nav-icon"
            onClick={function () {
              setNotificationCount(0);
              navigate("/user/notifications");
            }}
          />

          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>

        <div className="divider"></div>

        {/* PROFILE */}

        <FaUser
          className="nav-icon"
          onClick={function () {
            navigate("/user/profile");
          }}
        />

        <span
          onClick={function () {
            navigate("/user/profile");
          }}
        >
          User
        </span>
        <div className="divider"></div>

        {/* Current Date & Time */}
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
  );
}

export default UserNavbar;
