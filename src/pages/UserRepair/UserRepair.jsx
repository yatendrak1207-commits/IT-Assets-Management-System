import React, { useEffect, useState } from "react";
import "./UserRepair.css";
import { GiAutoRepair } from "react-icons/gi";

function UserRepair() {
  const [myRepairs, setMyRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    fetch("http://localhost:5000/api/repairs/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch repair requests");
          }

          return data;
        });
      })
      .then(function (data) {
        setMyRepairs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(function (error) {
        console.log("Error fetching repair requests:", error);
        setError("Failed to load repair requests");
        setLoading(false);
      });
  }, []);

  return (
    <div className="user-repair">
      <div className="repair-header">
        <h1>
          <GiAutoRepair />
          My Repair Requests
        </h1>
      </div>

      <div className="repair-table-container">
        {loading ? (
          <p className="no-repairs">Loading...</p>
        ) : error ? (
          <p className="no-repairs">{error}</p>
        ) : myRepairs.length === 0 ? (
          <p className="no-repairs">No repair requests found.</p>
        ) : (
          <table className="repair-table">
            <thead>
              <tr>
                <th>Repair ID</th>
                <th>Asset</th>
                <th>Issue</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {myRepairs.map(function (item) {
                return (
                  <tr key={item.repairId}>
                    <td>{item.repairId}</td>

                    <td>{item.asset?.assetName || "N/A"}</td>

                    <td>{item.complaint || "N/A"}</td>

                    <td>
                      {item.complaintDate
                        ? new Date(item.complaintDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>{item.status || "N/A"}</td>
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
