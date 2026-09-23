import React, { useEffect, useState } from "react";
import "./UserNotification.css";
import { MdNotificationsActive } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import API_URL from "../../config/api";

function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteNotificationItem, setDeleteNotificationItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    fetch(`${API_URL}/api/notifications/my`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch notifications");
          }
          return data;
        });
      })
      .then(function (data) {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(function (error) {
        console.log("Error fetching notifications:", error);
        setError("Failed to load notifications");
        setLoading(false);
      });
  }, []);

  async function markAsRead(notificationId) {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(function (oldNotifications) {
        return oldNotifications.map(function (item) {
          if (item._id === notificationId) {
            return { ...item, isRead: true };
          }
          return item;
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function markAllAsRead() {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      setNotifications(function (oldNotifications) {
        return oldNotifications.map(function (item) {
          return { ...item, isRead: true };
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNotification(notificationId) {
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications(function (oldNotifications) {
        return oldNotifications.filter(function (item) {
          return item._id !== notificationId;
        });
      });

      setDeleteNotificationItem(null);
      setSuccessMessage("Notification deleted successfully");

      setTimeout(function () {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.log("Delete notification error:", error);
      setDeleteNotificationItem(null);
    }
  }

  return (
    <div className="user-notifications">
      <div className="notification-header">
        <h1>
          <MdNotificationsActive />
          Notifications
        </h1>

        {notifications.some(function (item) {
          return !item.isRead;
        }) && (
          <button className="mark-all-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-list">
        {loading ? (
          <p className="no-notifications">Loading...</p>
        ) : error ? (
          <p className="no-notifications">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="no-notifications">No notifications found.</p>
        ) : (
          notifications.map(function (item) {
            return (
              <div
                key={item._id}
                className={
                  item.isRead
                    ? "notification-card read"
                    : "notification-card unread"
                }
                onClick={function () {
                  if (!item.isRead) {
                    markAsRead(item._id);
                  }
                }}
              >
                <button
                  className="delete-notification-btn"
                  onClick={function (event) {
                    event.stopPropagation();
                    setDeleteNotificationItem(item);
                  }}
                >
                  <FaTimes />
                </button>

                <h3>{item.title}</h3>
                <p>{item.message}</p>

                <small>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ""}
                </small>
              </div>
            );
          })
        )}
      </div>

      {deleteNotificationItem && (
        <div className="notification-delete-overlay">
          <div className="notification-delete-confirm-box">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this notification?</p>

            <div className="notification-delete-confirm-buttons">
              <button
                className="notification-delete-cancel-btn"
                onClick={function () {
                  setDeleteNotificationItem(null);
                }}
              >
                Cancel
              </button>

              <button
                className="notification-delete-confirm-btn"
                onClick={function () {
                  deleteNotification(deleteNotificationItem._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="notification-success-overlay">
          <div className="notification-success-popup">
            <div className="notification-success-icon">✓</div>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserNotifications;
