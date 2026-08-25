import React from "react";
import "./UserDashboard.css";
import { complaints } from "../../data/data";
import { MdOutlineDashboard } from "react-icons/md";
function UserDashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const userData = complaints.filter(
    (item) => item.employeeId === loggedInUser?.employeeId,
  );
  const recentComplaints = userData.filter(function (item) {
    return item.complaint;
  });

  return (
    <div className="user-dashboard">
      <h1>
        <MdOutlineDashboard />
        User Dashboard
      </h1>

      <div className="user-card-container">
        <div className="user-card">
          <h3>My Assets</h3>
          <p>
            {
              userData.filter(function (item) {
                return item.assetId;
              }).length
            }
          </p>
        </div>

        <div className="user-card">
          <h3>Complaints</h3>
          <p>{recentComplaints.length}</p>
        </div>

        <div className="user-card">
          <h3>Open Complaints</h3>
          <p>
            {
              recentComplaints.filter(function (item) {
                return item.status === "Pending";
              }).length
            }
          </p>
        </div>

        <div className="user-card">
          <h3>Repair Requests</h3>
          <p>
            {
              userData.filter(function (item) {
                return item.repairId;
              }).length
            }
          </p>
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
            {recentComplaints.slice(0, 5).map(function (item, index) {
              return (
                <tr key={index}>
                  <td>{item.complaintId || "C00" + (index + 1)}</td>
                  <td>{item.assetName}</td>
                  <td>{item.complaint}</td>
                  <td>{item.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDashboard;
