import React from "react";

import "./Repair.css";
import { useState, useEffect } from "react";
import { data } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { MdManageSearch } from "react-icons/md";
export default function Repair() {
  const [search, setsearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const [repair, setRepairs] = useState([]);
  useEffect(function () {
    fetch("http://localhost:5000/api/repairs")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch repairs");
        }

        return response.json();
      })
      .then(function (data) {
        setRepairs(data);
      })
      .catch(function (error) {
        console.log("Error fetching repair:", error);
      });
  }, []);
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
      fetch("http://localhost:5000/api/repairs/" + editingItem.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repairId: Number(repairId),
          assetName: assetname,
          assigned: assigned,
          complaint: issue,
          complaintDate: repairdate,
          status: status,
        }),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message);
            });
          }

          return response.json();
        })
        .then(function (updatedRepair) {
          setRepairs(function (currentRepairs) {
            return currentRepairs.map(function (repairItem) {
              if (repairItem.id === updatedRepair.id) {
                return updatedRepair;
              }

              return repairItem;
            });
          });

          setShowform(false);
          setEditingItem(null);
          setRepairId("");
          setAssetname("");
          setAssigned("");
          setIssue("");
          setRepairdate("");
          setStatus("Pending");
        })
        .catch(function (error) {
          console.log("Error updating repair:", error);
        });
    } else {
      const newRepair = {
        id: Date.now(),
        repairId: Number(repairId),
        assetName: assetname,
        assigned: assigned,
        complaint: issue,
        complaintDate: repairdate,
        status: status,
      };

      fetch("http://localhost:5000/api/repairs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRepair),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message);
            });
          }

          return response.json();
        })
        .then(function (createdRepair) {
          setRepairs(function (currentRepairs) {
            return [...currentRepairs, createdRepair];
          });

          setShowform(false);
          setEditingItem(null);
          setRepairId("");
          setAssetname("");
          setAssigned("");
          setIssue("");
          setRepairdate("");
          setStatus("Pending");
        })
        .catch(function (error) {
          console.log("Error creating repair:", error);
        });
    }
  }
  return (
    <div className="repair">
      <div className="repair-Header">
        <div className="repair-action">
          <h1>
            <GiAutoRepair />
            Repair
          </h1>
          <div className="repair-action-btn">
            <div className="search-box">
              <MdManageSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by Asset/Assigned/Status____ "
                value={search}
                onChange={function (x) {
                  setsearch(x.target.value);
                }}
              />
            </div>
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
                  <td>
                    {item.complaintDate
                      ? new Date(item.complaintDate).toLocaleDateString("en-GB")
                      : ""}
                  </td>
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
                          const updatedRepair = repair.filter(function (x) {
                            return x.id !== item.id;
                          });

                          setRepairs(updatedRepair);

                          localStorage.setItem(
                            "repair",
                            JSON.stringify(updatedRepair),
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
                          setRepairdate(
                            item.complaintDate
                              ? new Date(item.complaintDate)
                                  .toISOString()
                                  .slice(0, 10)
                              : "",
                          );
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
              <button
                className="close-btn"
                onClick={function () {
                  setSelectedItem(null);
                }}
              >
                ×
              </button>
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
                <strong>Repair Date:</strong>{" "}
                {selecteditem.complaintDate
                  ? new Date(selecteditem.complaintDate).toLocaleDateString(
                      "en-GB",
                    )
                  : ""}
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
            <button
              className="close-btn"
              onClick={function () {
                setShowform(false);
                setEditingItem(null);

                setRepairId("");
                setAssetname("");
                setAssigned("");
                setIssue("");
                setRepairdate("");
                setStatus("");
              }}
            >
              ×
            </button>
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
                <option value="In Progress">In Progress</option>
                <option value="Complete">Completed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="repair-form-buttons">
              <button
                className="cancel"
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

              <button className="update-add" onClick={handleSaveRepair}>
                {editingItem ? "Update details" : "Add Repair"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
