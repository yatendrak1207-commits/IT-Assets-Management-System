import React, { useEffect, useState } from "react";
import "./UserAssets.css";
import { LuMonitorSpeaker } from "react-icons/lu";

function MyAssets() {
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const userId = loggedInUser?.employeeId;

  useEffect(
    function () {
      async function fetchMyAssets() {
        try {
          const token = sessionStorage.getItem("token");

          const response = await fetch("http://localhost:5000/api/assets/my", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch assets");
          }

          const assignedAssets = data.filter(function (item) {
            return item?.assignedTo?.employeeId === userId;
          });

          setMyAssets(assignedAssets);
        } catch (error) {
          console.error("Error fetching my assets:", error);
        } finally {
          setLoading(false);
        }
      }

      if (userId) {
        fetchMyAssets();
      } else {
        setLoading(false);
      }
    },
    [userId],
  );

  return (
    <div className="my-assets">
      <div className="my-assets-header">
        <h1>
          <LuMonitorSpeaker />
          My Assets
        </h1>
      </div>

      <div className="my-assets-table-container">
        {loading ? (
          <p className="no-assets">Loading assets...</p>
        ) : myAssets.length === 0 ? (
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
                  <tr key={item._id}>
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
