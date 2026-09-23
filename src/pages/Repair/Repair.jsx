import React from "react";

import "./Repair.css";

import { useState, useEffect } from "react";

import { FaPlus } from "react-icons/fa";

import { GiAutoRepair } from "react-icons/gi";

import { MdManageSearch } from "react-icons/md";

import API_URL from "../../config/api";

export default function Repair() {
  const [search, setsearch] = useState("");

  const [editingItem, setEditingItem] = useState(null);

  const [selecteditem, setSelectedItem] = useState(null);

  const [repair, setRepairs] = useState([]);

  const [assets, setAssets] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [showform, setShowform] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [issue, setIssue] = useState("");

  const [repairdate, setRepairdate] = useState("");

  const [status, setStatus] = useState("Pending");
  const [deleteRepair, setDeleteRepair] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(function () {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const assetResponse = await fetch(`${API_URL}/api/assets`, {
        headers: headers,
      });

      const employeeResponse = await fetch(`${API_URL}/api/employees`, {
        headers: headers,
      });

      const repairResponse = await fetch(`${API_URL}/api/repairs`, {
        headers: headers,
      });

      if (!assetResponse.ok) {
        throw new Error("Failed to fetch assets");
      }

      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employees");
      }

      if (!repairResponse.ok) {
        throw new Error("Failed to fetch repairs");
      }

      const assetData = await assetResponse.json();

      const employeeData = await employeeResponse.json();

      const repairData = await repairResponse.json();

      setAssets(assetData);

      setEmployees(employeeData);

      setRepairs(repairData);
    } catch (error) {
      console.log("Error fetching repair data:", error);
    }
  }

  const filteredRepair = repair.filter(function (item) {
    const assetName = item.asset ? item.asset.assetName : "";

    const employeeName = item.employee ? item.employee.employeeName : "";

    const issueText = item.complaint || "";

    const itemStatus = item.status || "";

    const repairId = item.repairId || "";

    return (
      assetName.toLowerCase().includes(search.toLowerCase()) ||
      employeeName.toLowerCase().includes(search.toLowerCase()) ||
      issueText.toLowerCase().includes(search.toLowerCase()) ||
      itemStatus.toLowerCase().includes(search.toLowerCase()) ||
      repairId.toLowerCase().includes(search.toLowerCase())
    );
  });

  function highlightText(text) {
    if (!search) {
      return text;
    }

    const parts = String(text).split(
      new RegExp(
        "(" + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
        "gi",
      ),
    );

    return parts.map(function (part, index) {
      if (part.toLowerCase() === search.toLowerCase()) {
        return <mark key={index}>{part}</mark>;
      }

      return part;
    });
  }

  function resetForm() {
    setShowform(false);

    setEditingItem(null);

    setSelectedAsset("");

    setSelectedEmployee("");

    setIssue("");

    setRepairdate("");

    setStatus("Pending");
  }

  function openAddForm() {
    setEditingItem(null);

    setSelectedAsset("");

    setSelectedEmployee("");

    setIssue("");

    setRepairdate("");

    setStatus("Pending");

    setShowform(true);
  }

  async function handleSaveRepair() {
    if (
      !selectedAsset ||
      !selectedEmployee ||
      !issue ||
      !repairdate ||
      !status
    ) {
      alert("Please fill all required fields");

      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      };

      if (editingItem) {
        const response = await fetch(
          `${API_URL}/api/repairs/` + editingItem.id,
          {
            method: "PUT",
            headers: headers,

            body: JSON.stringify({
              asset: selectedAsset,

              employee: selectedEmployee,

              complaint: issue,

              complaintDate: repairdate,

              status: status,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update repair");
        }

        setRepairs(function (currentRepairs) {
          return currentRepairs.map(function (item) {
            if (item.id === data.id) {
              return data;
            }

            return item;
          });
        });

        resetForm();

        setSuccessMessage("Repair details successfully updated");
        setTimeout(function () {
          setSuccessMessage("");
        }, 2500);

        return;
      }

      const newRepair = {
        asset: selectedAsset,

        employee: selectedEmployee,

        complaint: issue,

        complaintDate: repairdate,

        status: status,
      };

      const response = await fetch(`${API_URL}/api/repairs`, {
        method: "POST",

        headers: headers,

        body: JSON.stringify(newRepair),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create repair");
      }

      setRepairs(function (currentRepairs) {
        return [...currentRepairs, data];
      });

      resetForm();
    } catch (error) {
      console.log("Error saving repair:", error);

      alert(error.message);
    }
  }

  async function handleDelete(item) {
    try {
      const response = await fetch(`${API_URL}/api/repairs/` + item.id, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete repair");
      }

      setRepairs(function (currentRepairs) {
        return currentRepairs.filter(function (repairItem) {
          return repairItem.id !== item.id;
        });
      });

      setSelectedItem(null);
      setDeleteRepair(null);

      setSuccessMessage("Repair deleted successfully");

      setTimeout(function () {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.log("Error deleting repair:", error);

      setDeleteRepair(null);
      alert(error.message);
    }
  }

  function handleEdit(item) {
    setEditingItem(item);

    setSelectedAsset(item.asset ? item.asset._id : "");

    setSelectedEmployee(item.employee ? item.employee._id : "");

    setIssue(item.complaint || "");

    setRepairdate(
      item.complaintDate
        ? new Date(item.complaintDate).toISOString().slice(0, 10)
        : "",
    );

    setStatus(item.status || "Pending");

    setShowform(true);
  }

  return (
    <div className="repair">
      {/* ================= HEADER ================= */}

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

            <button onClick={openAddForm}>
              <FaPlus />
              Add Repair
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="table-container">
        <table className="repair-tabel">
          <thead>
            <tr>
              <th> Repair ID</th>

              <th>Assets Name</th>

              <th>Assigned to</th>

              <th>Issue</th>

              <th>Date</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRepair.map(function (item) {
              return (
                <tr key={item._id}>
                  <td>{item.repairId}</td>

                  <td>
                    {highlightText(item.asset ? item.asset.assetName : "-")}
                  </td>

                  <td>
                    {highlightText(
                      item.employee ? item.employee.employeeName : "-",
                    )}
                  </td>

                  <td>{item.complaint || "-"}</td>

                  <td>
                    {item.complaintDate
                      ? new Date(item.complaintDate).toLocaleDateString("en-GB")
                      : ""}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${item.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {highlightText(item.status || "")}
                    </span>
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
                          setDeleteRepair(item);
                        }}
                      >
                        Delete
                      </button>

                      <button
                        className="update-btn"
                        onClick={function () {
                          handleEdit(item);
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

        {/* ================= VIEW ================= */}

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
                <strong>ID:</strong> {selecteditem.repairId}
              </p>

              <p>
                <strong>Asset Name:</strong>{" "}
                {selecteditem.asset ? selecteditem.asset.assetName : "-"}
              </p>

              <p>
                <strong>Assigned To:</strong>{" "}
                {selecteditem.employee
                  ? selecteditem.employee.employeeName
                  : "-"}
              </p>

              <p>
                <strong>Issue:</strong> {selecteditem.complaint || "-"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {selecteditem.complaintDate
                  ? new Date(selecteditem.complaintDate).toLocaleDateString(
                      "en-GB",
                    )
                  : ""}
              </p>

              <p>
                <strong>Status:</strong> {selecteditem.status || "-"}
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

      {/* ================= ADD / UPDATE FORM ================= */}

      {showform && (
        <div className="repair-overlay">
          <div className="repair-form">
            <button
              className="close-btn"
              onClick={function () {
                resetForm();
              }}
            >
              ×
            </button>

            <h2>{editingItem ? "Update Repair" : "Add Repair"}</h2>

            <div className="form-field">
              <label>Assets Name</label>

              <select
                value={selectedAsset}
                onChange={function (x) {
                  setSelectedAsset(x.target.value);
                }}
              >
                <option value="">Select Asset</option>

                {assets.map(function (assetItem) {
                  return (
                    <option key={assetItem._id} value={assetItem._id}>
                      {assetItem.assetName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-field">
              <label>Assigned to</label>

              <select
                value={selectedEmployee}
                onChange={function (x) {
                  setSelectedEmployee(x.target.value);
                }}
              >
                <option value="">Select Employee</option>

                {employees.map(function (employeeItem) {
                  return (
                    <option key={employeeItem._id} value={employeeItem._id}>
                      {employeeItem.employeeName}
                    </option>
                  );
                })}
              </select>
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
                <option value="Pending">Pending</option>

                <option value="In Progress">In Progress</option>

                <option value="Completed">Completed</option>

                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="repair-form-buttons">
              <button
                className="cancel"
                onClick={function () {
                  resetForm();
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

      {deleteRepair && (
        <div className="delete-overlay">
          <div className="delete-confirm-box">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this repair?</p>

            <div className="delete-confirm-buttons">
              <button
                className="delete-cancel-btn"
                onClick={function () {
                  setDeleteRepair(null);
                }}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-btn"
                onClick={function () {
                  handleDelete(deleteRepair);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
