import React from "react";
import { complaints } from "../../data/data";
import "./Repair.css";
import { useState } from "react";
import { data } from "react-router-dom";
export default function Repair() {
  const [search, setsearch] = useState("");
  const [repair, setRepairs] = useState(complaints);
  const [showform, setShowform] = useState(false);
  const [repairId, setRepairId] = useState("");
  const [assetname, setAssetname] = useState("");
  const [assigned, setAssigned] = useState("");
  const [issue, setIssue] = useState("");
  const [repairdate, setRepairdate] = useState("");
  const [status, setStatus] = useState("");
  const filteredRepair = repair.filter(function (item) {
    return (
      item.assetName.toLowerCase().includes(search.toLowerCase()) ||
      item.assigned.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
    );
  });
  function highlightText(text) {
    if (!search) {
      return text;
    }

    const parts = text.split(new RegExp("(" + search + ")", "gi"));

    return parts.map(function (part, index) {
      if (part.toLowerCase() === search.toLowerCase()) {
        return <mark key={index}>{part}</mark>;
      }

      return part;
    });
  }
  return (
    <div className="repair">
      <div className="repair-header">
        <h1>Repair</h1>
        <div className="repair-action">
          <input
            type="text"
            placeholder="Search by Asset Name/Assigned/status "
            value={search}
            onChange={function (x) {
              setsearch(x.target.value);
            }}
          />
          <button
            onClick={function () {
              setShowform(true);
            }}
          >
            Add Repair
          </button>
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
            {filteredRepair.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{item.repairId}</td>
                  <td>{highlightText(item.assetName)}</td>
                  <td>{highlightText(item.assigned)}</td>
                  <td>{item.complaint}</td>
                  <td>{item.complaintDate}</td>
                  <td>{highlightText(item.status)}</td>
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
      {showform && (
        <div className="repair-overlay">
          <div className="repair-form">
            <h2>Add Repair</h2>

            <input
              type="text"
              placeholder="Repair ID"
              value={repairId}
              onChange={function (x) {
                setRepairId(x.target.value);
              }}
            />

            <input
              type="text"
              placeholder="Asset Name"
              value={assetname}
              onChange={function (x) {
                setAssetname(x.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Assigned To"
              value={assigned}
              onChange={function (x) {
                setAssigned(x.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Issue"
              value={issue}
              onChange={function (x) {
                setIssue(x.target.value);
              }}
            />
            <input
              type="date"
              value={repairdate}
              onChange={function (x) {
                setRepairdate(x.target.value);
              }}
            />

            <select
              value={status}
              onChange={function (x) {
                setStatus(x.target.value);
              }}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div className="repair-form-buttons">
              <button
                onClick={function () {
                  setShowform(false);
                }}
              >
                Cancel
              </button>

              <button
                onClick={function () {
                  const newRepair = {
                    id: Date.now(),
                    repairId: repairId,
                    assetName: assetname,
                    assigned: assigned,
                    complaint: issue,
                    complaintDate: repairdate,
                    status: status,
                  };

                  setRepairs([...repair, newRepair]);
                  setShowform(false);

                  setRepairId("");
                  setAssetname("");
                  setAssigned("");
                  setRepairdate("");
                  setStatus("pending");
                }}
              >
                Save Repair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
