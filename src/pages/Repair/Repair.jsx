import React from "react";
import { complaints } from "../../data/data";
import "./Repair.css";
import { useState } from "react";
import { data } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
export default function Repair() {
  const [search, setsearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
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
  function handleSaveRepair() {
    if (editingItem) {
      const updatedRepair = repair.map(function (repairItem) {
        if (repairItem.id === editingItem.id) {
          return {
            ...repairItem,
            repairId: repairId,
            assetName: assetname,
            assigned: assigned,
            complaint: issue,
            complaintDate: repairdate,
            status: status,
          };
        }

        return repairItem;
      });

      setRepairs(updatedRepair);
    } else {
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
    }

    setShowform(false);

    setEditingItem(null);

    setRepairId("");
    setAssetname("");
    setAssigned("");
    setIssue("");
    setRepairdate("");
    setStatus("Pending");
  }
  return (
    <div className="repair">
      <div className="repair-header">
        <div className="repair-action">
          <h1>
            <GiAutoRepair />
            Repair
          </h1>
          <div className="repair-action-btn">
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
              <FaPlus />
              Add Repair
            </button>
          </div>
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
                  <td
                    className={
                      item.status === "Open"
                        ? "Open"
                        : item.status === "In Progress"
                          ? "Progress"
                          : "Resolved"
                    }
                  >
                    {highlightText(item.status)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={function () {
                          setSelectedItem(item);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={function () {
                          setRepairs(
                            repair.filter(function (x) {
                              return x.id !== item.id;
                            }),
                          );
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="update-btn"
                        onClick={function () {
                          setEditingItem(item);

                          setRepairId(item.repairId);
                          setAssetname(item.assetName);
                          setAssigned(item.assigned);
                          setIssue(item.complaint);
                          setRepairdate(item.complaintDate);
                          setStatus(item.status);

                          setShowform(true);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {selecteditem && (
          <div className="view-overlay">
            <div className="view-form">
              <h2>Repair Details</h2>

              <p>
                <strong>Repair ID:</strong> {selecteditem.repairId}
              </p>
              <p>
                <strong>Asset Name:</strong> {selecteditem.assetName}
              </p>
              <p>
                <strong>Assigned To:</strong> {selecteditem.assigned}
              </p>
              <p>
                <strong>Issue:</strong> {selecteditem.complaint}
              </p>
              <p>
                <strong>Repair Date:</strong> {selecteditem.complaintDate}
              </p>
              <p>
                <strong>Repair Center</strong> {selecteditem.repairCenter}
              </p>
              <p>
                <strong> Repair Status:</strong> {selecteditem.repairStatus}
              </p>
              <p>
                <strong>Estimated Cost</strong> {selecteditem.estimatedCost}
              </p>
              <p>
                <strong>Description</strong> {selecteditem.description}
              </p>
              <button
                onClick={function () {
                  setSelectedItem(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {showform && (
        <div className="repair-overlay">
          <div className="repair-form">
            <h2>{editingItem ? "Update details" : "Add Repair"}</h2>

            <div className="form-field">
              <label>Repair ID</label>
              <input
                type="text"
                placeholder="Repair ID"
                value={repairId}
                onChange={function (x) {
                  setRepairId(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Assets Name</label>
              <input
                type="text"
                placeholder="Asset Name"
                value={assetname}
                onChange={function (x) {
                  setAssetname(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Assigned to</label>
              <input
                type="text"
                placeholder="Assigned To"
                value={assigned}
                onChange={function (x) {
                  setAssigned(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Issue</label>
              <input
                type="text"
                placeholder="Issue"
                value={issue}
                onChange={function (x) {
                  setIssue(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Repair Date</label>
              <input
                type="date"
                value={repairdate}
                onChange={function (x) {
                  setRepairdate(x.target.value);
                }}
              />
            </div>
            <div className="form-field">
              <label>Status</label>
              <select
                value={status}
                onChange={function (x) {
                  setStatus(x.target.value);
                }}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Completed</option>
              </select>
            </div>

            <div className="repair-form-buttons">
              <button
                onClick={function () {
                  setShowform(false);
                  setEditingItem(null);

                  setRepairId("");
                  setAssetname("");
                  setAssigned("");
                  setIssue("");
                  setRepairdate("");
                  setStatus("Pending");
                }}
              >
                Cancel
              </button>

              <button onClick={handleSaveRepair}>
                {editingItem ? "Update details" : "Add Repair"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
