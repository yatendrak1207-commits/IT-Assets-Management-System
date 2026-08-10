import React from "react";
import { complaints } from "../../data/data";
import "./Repair.css";
export default function Repair() {
  return (
    <div className="repair">
      <div className="repair-header">
        <h1>Repair</h1>
        <div className="repair-action">
          <input type="text" placeholder="Search repair Assets" />
          <button>Add Repair</button>
        </div>
      </div>
      <div className="table-container">
        <table className="repair-tabel">
          <thead>
            <tr>
              <th>Repair ID</th>
              <th>Assets Name</th>
              <th>Assigned to</th>
              <th>Issue</th>
              <th>Repair Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{item.repairId}</td>
                  <td>{item.assetName}</td>
                  <td>{item.assetName}</td>
                  <td>{item.complaint}</td>
                  <td>{item.complaintDate}</td>
                  <td>{item.status}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn">View</button>
                      {/*<button className="delete-btn">Delete</button>
                      <button className="update-btn">Update</button>*/}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
