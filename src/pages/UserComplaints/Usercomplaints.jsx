import React from "react";
import { complaints } from "../../data/data";
import "./UserComplaints.css";

function UserComplaints() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const userId = loggedInUser.employeeId;

  const myComplaints = complaints.filter(function (item) {
    return item.employeeId === userId;
  });

  return (
    <div className="user-complaints">
      <div className="complaints-header">
        <h1>My Complaints</h1>
      </div>

      <div className="complaints-table-container">
        {myComplaints.length === 0 ? (
          <p className="no-complaints">No complaints found.</p>
        ) : (
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Complaint</th>
                <th>Asset</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {myComplaints.map(function (item) {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.complaint}</td>
                    <td>{item.assetName}</td>
                    <td>{item.status}</td>
                    <td>{item.complaintDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserComplaints;
