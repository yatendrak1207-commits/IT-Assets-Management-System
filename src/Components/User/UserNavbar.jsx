import "./UserNavbar.css";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function UserNavbar() {
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);

  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const userName = loggedInUser?.employeeName || "User";

  // ==========================================
  // GET UNREAD NOTIFICATION COUNT
  // ==========================================

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return;
    }

    fetch("http://localhost:5000/api/notifications/unread-count", {
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
        <h2>👤 Hello, {userName}</h2>
      </div>

      <div className="navbar-center">
        <h1>
          <FaUsers className="users-icon" />
          IT Assets Management System
        </h1>
      </div>

      <div className="navbar-right">
        {/* NOTIFICATION */}

        <div className="notification-icon-wrapper">
          <FaBell
            className="nav-icon"
            onClick={function () {
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
      </div>
    </div>
  );
}

export default UserNavbar;
