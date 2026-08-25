import React from "react";
import { complaints } from "../../data/data";
import "./UserAssets.css";
import { LuMonitorSpeaker } from "react-icons/lu";
function MyAssets() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const userId = loggedInUser.employeeId;

  const myAssets = complaints.filter(function (item) {
    return item.employeeId === userId;
  });

  return (
    <div className="my-assets">
      <div className="my-assets-header">
        <h1>
          <LuMonitorSpeaker />
          My Assets
        </h1>
      </div>

      <div className="my-assets-table-container">
        {myAssets.length === 0 ? (
          <p className="no-assets">No assets assigned.</p>
        ) : (
          <table className="my-assets-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {myAssets.map(function (item) {
                return (
                  <tr key={item.assetId}>
                    <td>{item.assetId}</td>
                    <td>{item.assetName}</td>
                    <td>{item.category}</td>
                    <td>{item.status}</td>
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

export default MyAssets;
