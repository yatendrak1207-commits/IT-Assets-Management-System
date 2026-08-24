import React from "react";
import { complaints } from "../../data/data";
import "./UserRepair.css";

function UserRepair() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const userId = loggedInUser.employeeId;

  const myRepairs = complaints.filter(function (item) {
    return item.employeeId === userId && item.repairId;
  });

  return (
    <div className="user-repair">
      <div className="repair-header">
        <h1>My Repair Requests</h1>
      </div>

      <div className="repair-table-container">
        {myRepairs.length === 0 ? (
          <p className="no-repairs">No repair requests found.</p>
        ) : (
          <table className="repair-table">
            <thead>
              <tr>
                <th>Repair ID</th>
                <th>Asset</th>
                <th>Repair Center</th>
                <th>Status</th>
                <th>Estimated Cost</th>
              </tr>
            </thead>

            <tbody>
              {myRepairs.map(function (item) {
                return (
                  <tr key={item.repairId}>
                    <td>{item.repairId}</td>
                    <td>{item.assetName}</td>
                    <td>{item.repairCenter}</td>
                    <td>{item.repairStatus}</td>
                    <td>{item.estimatedCost}</td>
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

export default UserRepair;
