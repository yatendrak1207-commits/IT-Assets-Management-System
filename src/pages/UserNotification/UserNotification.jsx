import React, { useEffect, useState } from "react";
import "./UserNotification.css";
import { MdNotificationsActive } from "react-icons/md";

function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    fetch("http://localhost:5000/api/notifications/my", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(function (oldNotifications) {
        return oldNotifications.map(function (item) {
          if (item._id === notificationId) {
            return {
              ...item,
              isRead: true,
            };
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
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      setNotifications(function (oldNotifications) {
        return oldNotifications.map(function (item) {
          return {
            ...item,
            isRead: true,
          };
        });
      });
    } catch (error) {
      console.log(error);
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
    </div>
  );
}

export default UserNotifications;
