import React from "react";
import "./UserNotification.css";

function UserNotifications() {
  return (
    <div className="user-notifications">
      <h1>Notifications</h1>

      <div className="notification-card">
        <h3>Asset Assigned</h3>
        <p>Your laptop has been assigned to you.</p>
      </div>

      <div className="notification-card">
        <h3>Repair Update</h3>
        <p>Your repair request is currently being processed.</p>
      </div>

      <div className="notification-card">
        <h3>System Notification</h3>
        <p>Please keep your assigned assets safe.</p>
      </div>
    </div>
  );
}

export default UserNotifications;
