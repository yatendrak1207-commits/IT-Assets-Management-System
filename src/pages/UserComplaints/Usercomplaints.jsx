import React, { useEffect, useState } from "react";
import "./UserComplaints.css";
import { BsFillPeopleFill } from "react-icons/bs";
import API_URL from "../../config/api";

function UserComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [complaintText, setComplaintText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(function () {
    async function fetchData() {
      try {
        const token = sessionStorage.getItem("token");

        const repairResponse = await fetch(`${API_URL}/api/repairs/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const repairData = await repairResponse.json();

        if (!repairResponse.ok) {
          throw new Error(
            repairData.message || "Failed to fetch repair requests",
          );
        }

        setComplaints(repairData);

        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
        const userId = loggedInUser?.employeeId;

        const assetResponse = await fetch(`${API_URL}/api/assets/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const assetData = await assetResponse.json();

        if (!assetResponse.ok) {
          throw new Error(assetData.message || "Failed to fetch your assets");
        }

        const assignedAssets = assetData.filter(function (item) {
          return item?.assignedTo?.employeeId === userId;
        });

        setAssets(assignedAssets);
      } catch (error) {
        console.log("Error fetching repair data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedAsset) {
      alert("Please select an asset");
      return;
    }

    if (!complaintText.trim()) {
      alert("Please enter your complaint");
      return;
    }

    try {
      setSubmitting(true);

      const token = sessionStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/repairs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset: selectedAsset,
          complaint: complaintText,
          complaintDate: new Date().toISOString().slice(0, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create repair request");
      }

      setComplaints(function (previous) {
        return [data, ...previous];
      });

      setSelectedAsset("");
      setComplaintText("");

      setSuccessMessage("Complaint sent successfully");

      setTimeout(function () {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.log("Error creating repair request:", error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="user-complaints">
      <div className="complaints-header">
        <h1>
          <BsFillPeopleFill />
          My Complaints
        </h1>
      </div>

      <div className="complaint-form-container">
        <h2>Create Complaint</h2>

        <form onSubmit={handleSubmit}>
          <div className="complaint-form-group">
            <label>Select Asset</label>

            <select
              value={selectedAsset}
              onChange={function (event) {
                setSelectedAsset(event.target.value);
              }}
            >
              <option value="">Select Asset</option>

              {assets.map(function (item) {
                return (
                  <option key={item._id} value={item._id}>
                    {item.assetName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="complaint-form-group">
            <label>Complaint</label>

            <textarea
              value={complaintText}
              onChange={function (event) {
                setComplaintText(event.target.value);
              }}
              placeholder="Enter your complaint"
              rows="4"
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      <div className="complaints-table-container">
        {loading ? (
          <p className="no-complaints">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="no-complaints">No complaints found.</p>
        ) : (
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Repair ID</th>
                <th>Complaint</th>
                <th>Asset</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map(function (item) {
                return (
                  <tr key={item._id}>
                    <td>{item.repairId}</td>
                    <td>{item.complaint}</td>
                    <td>{item.asset ? item.asset.assetName : "-"}</td>
                    <td>
                      <span
                        className={`status-badge ${item.status
                          ?.toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.complaintDate
                        ? new Date(item.complaintDate).toLocaleDateString(
                            "en-GB",
                          )
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {successMessage && (
        <div className="complaint-success-overlay">
          <div className="complaint-success-popup">
            <div className="complaint-success-icon">✓</div>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserComplaints;
