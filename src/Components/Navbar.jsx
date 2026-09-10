import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaBell, FaUser, FaUsers, FaClock } from "react-icons/fa";

function Navbar() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "💻 New laptop (Dell XPS) has been added to the inventory.",
    },
    {
      id: 2,
      text: "⚠️ Warning: 3 keyboards are running low in stock.",
    },
    {
      id: 3,
      text: "🔧 Rahul Kumar has submitted a mouse replacement request.",
    },
  ]);

  const [hasNew, setHasNew] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  // Current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(function () {
    fetch("http://localhost:5000/api/admins/1")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setAdminName(data.name);
      })
      .catch(function (error) {
        console.log("Failed to fetch admin:", error);
      });
  }, []);

  const handleBellClick = () => {
    setIsOpen(true);
    setHasNew(false);
  };

  const deleteNotification = (id) => {
    const updatedList = notifications.filter((item) => item.id !== id);
    setNotifications(updatedList);

    if (updatedList.length === 0) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <h2>👤 Hello, {adminName}</h2>
        </div>

        <div className="navbar-center">
          <h1>
            <FaUsers className="users-icon" />
            IT Assets Management System
          </h1>
        </div>

        <div className="navbar-right">
          {/* Notification */}
          <div className="bell-container" onClick={handleBellClick}>
            <FaBell className="nav-icon" />

            {hasNew && <div className="navbar-yellow-dot"></div>}
          </div>

          <div className="divider"></div>

          <FaUser className="nav-icon" />

          <span>Admin</span>
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

      {/* Notification Modal */}
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
                  <div key={notif.id} className="notif-item">
                    <p className="notif-text">{notif.text}</p>

                    <button
                      className="read-delete-btn"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      Dismiss
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
