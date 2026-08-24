import React from "react";
import "./UserDashboard.css";

function UserDashboard() {
  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>

      <div className="user-card-container">
        <div className="user-card">
          <h3>My Assets</h3>
          <p>3</p>
        </div>

        <div className="user-card">
          <h3>Complaints</h3>
          <p>2</p>
        </div>

        <div className="user-card">
          <h3>Open Complaints</h3>
          <p>1</p>
        </div>

        <div className="user-card">
          <h3>Repair Requests</h3>
          <p>1</p>
        </div>
      </div>

      <div className="recent-complaints">
        <h2>Recent Complaints</h2>

        <table>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Asset</th>
              <th>Complaint</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>C001</td>
              <td>Laptop</td>
              <td>Keyboard not working</td>
              <td>Pending</td>
            </tr>

            <tr>
              <td>C002</td>
              <td>Monitor</td>
              <td>Display issue</td>
              <td>Resolved</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDashboard;
