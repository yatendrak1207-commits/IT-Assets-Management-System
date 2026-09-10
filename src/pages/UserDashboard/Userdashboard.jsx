import "./UserDashboard.css";
import { MdOutlineDashboard } from "react-icons/md";
import React, { useState, useEffect } from "react";

function UserDashboard() {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const [assets, setAssets] = useState([]);
  const [repairs, setRepairs] = useState([]);

  useEffect(function () {
    // ================= GET ASSETS =================

    fetch("http://localhost:5000/api/assets")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }

        return response.json();
      })
      .then(function (data) {
        setAssets(data);
      })
      .catch(function (error) {
        console.log("Asset API Error:", error);
      });

    // ================= GET REPAIRS =================

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
        console.log("Repair API Error:", error);
      });
  }, []);

  // ================= MY ASSETS =================
  // Asset.assignedTo = Employee ObjectId
  // API me assignedTo populated hai

  const userAssets = assets.filter(function (item) {
    return (
      item.assignedTo &&
      typeof item.assignedTo === "object" &&
      item.assignedTo.employeeId === loggedInUser?.employeeId
    );
  });

  // ================= MY REPAIRS =================
  // Repair.employee = Employee ObjectId
  // API me employee populated hai

  const userRepairs = repairs.filter(function (item) {
    return (
      item.employee &&
      typeof item.employee === "object" &&
      item.employee.employeeId === loggedInUser?.employeeId
    );
  });

  // ================= MY COMPLAINTS =================
  // Complaint alag collection nahi hai.
  // Repair ke andar complaint field hai.

  const userComplaints = userRepairs.filter(function (item) {
    return item.complaint;
  });

  // ================= OPEN COMPLAINTS =================

  const openComplaints = userComplaints.filter(function (item) {
    return item.status === "Pending" || item.status === "In Progress";
  });

  return (
    <div className="user-dashboard">
      <h1>
        <MdOutlineDashboard />
        User Dashboard
      </h1>

      <div className="user-card-container">
        {/* MY ASSETS */}

        <div className="user-card">
          <h3>My Assets</h3>

          <p>{userAssets.length}</p>
        </div>

        {/* COMPLAINTS */}

        <div className="user-card">
          <h3>Complaints</h3>

          <p>{userRepairs.length}</p>
        </div>

        {/* OPEN COMPLAINTS */}

        <div className="user-card">
          <h3>Open Complaints</h3>

          <p>{userRepairs.length}</p>
        </div>

        {/* REPAIR REQUESTS */}

        <div className="user-card">
          <h3>Repair Requests</h3>

          <p>{userRepairs.length}</p>
        </div>
      </div>

      {/* ================= RECENT COMPLAINTS ================= */}

      <div className="recent-complaints">
        <h2>Recent Complaints</h2>

        <table className="complaint-tabel">
          <thead>
            <tr>
              <th>Repair ID</th>
              <th>Asset</th>
              <th>Complaint</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {userComplaints.length > 0 ? (
              userComplaints.slice(0, 5).map(function (item, index) {
                return (
                  <tr key={item._id || index}>
                    <td>{item.repairId || "-"}</td>

                    <td>{item.asset?.assetName || "-"}</td>

                    <td>{item.complaint}</td>

                    <td>{item.status || "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No complaints found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDashboard;
