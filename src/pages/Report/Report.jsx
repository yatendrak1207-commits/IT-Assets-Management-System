import React from "react";
import { useState } from "react";
import "./Report.css";
import { complaints } from "../../data/data";

export default function Report() {
  const [reportFor, setReportFor] = useState("assets");
  const assetIds = complaints.map(function (item) {
    return item.assetId;
  });
  const uniqueAssets = new Set(assetIds);
  const totalAssets = uniqueAssets.size;
  const assigned = complaints.filter(function (item) {
    return item.assigned;
  }).length;
  const avaliable = totalAssets - assigned;
  const repair = complaints.filter(function (item) {
    return item.status == "Pending";
  }).length;

  const assetReport = {
    total: totalAssets,
    assigned: assigned,
    available: avaliable,
    repair: repair,
  };
  return (
    <div className="report">
      <div className="report-header">
        <h1>Report</h1>
        <div className="report-filter">
          <label>Report for</label>
          <select
            value={reportFor}
            onChange={function (event) {
              setReportFor(event.target.value);
            }}
          >
            <option value="assets">Assets</option>
            <option value="employees">Employees</option>
            <option value="suppliers">Supplier</option>
            <option value="repair">Repair</option>
            <option value="complains">Complain</option>
          </select>
        </div>
      </div>
      <div className="report-cards">
        <div className="report-card">
          <h3>Total Assets</h3>
          <p>{totalAssets}</p>
        </div>
        <div className="report-card">
          <h3>Assigned</h3>
          <p>{assigned}</p>
        </div>
        <div className="report-card">
          <h3>Avaliable</h3>
          <p>{avaliable}</p>
        </div>
        <div className="report-card">
          <h3>Under Repair</h3>
          <p>{repair}</p>
        </div>
      </div>
      <div className="chart-section">
        <h2>Report chart</h2>

        <div className="chart-placeholder">Chart will appear here</div>
      </div>
    </div>
  );
}
