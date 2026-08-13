import React from "react";
import Card from "../../Components/Card/Card";
import { useState } from "react";
import "./Report.css";
import { complaints } from "../../data/data";

import {
  BarChart,
  Bar,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Report() {
  const [reportFor, setReportFor] = useState("assets");
  const [chartType, setCharttype] = useState("bar");
  //---------------Assets calculation--------------
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
    title: "Assets",
    totalLabel: "Total Assets",
    assignedLabel: "Assigned Employees",
    availableLabel: "Avaliabel Assets",
    ReapairLabel: "Repairing",

    total: totalAssets,
    assigned: assigned,
    available: avaliable,
    repair: repair,
  };

  //------------------Employee calculation----------------
  const employeeId = complaints.map(function (item) {
    return item.employeeId;
  });
  const totalemployees = employeeId.length;

  const assignedemployees = complaints.filter(function (item) {
    return item.assigned && item.employeeStatus == "Active";
  }).length;

  const avaliableemployee = totalemployees - assignedemployees;
  const inactiveemployees = complaints.filter(function (item) {
    return item.employeeStatus == "Inactive";
  }).length;

  const employeeReport = {
    title: "Employee",
    totalLabel: "Total Employee Seats",
    assignedLabel: "Assigned Employees Seats",
    availableLabel: "Avaliabel Employees Seats",
    ReapairLabel: "In-Active Employee",

    total: totalemployees,
    assigned: assignedemployees,
    available: avaliableemployee,
    repair: inactiveemployees,
  };
  //-------------Suppiler calculation-------
  const supplierId = complaints.map(function (item) {
    return item.supplierId;
  });
  const uniqueSuppilers = new Set(supplierId);
  const totalsupplier = uniqueSuppilers.size;

  const activesupplier = complaints.filter(function (item) {
    return item.supplierStatus == "Active";
  }).length;

  const Inactivesupplier = complaints.filter(function (item) {
    return item.supplierStatus == "Inactive";
  }).length;

  const assetsSupplied = complaints.map(function (item) {
    return item.category;
  });
  const Uniqueassetssupplie = new Set(assetsSupplied);
  const totalAssetsupplier = Uniqueassetssupplie.size;

  const supplierReport = {
    title: "supplier",
    totalLabel: "Total Suppliers",
    assignedLabel: "Active Suppliers",
    availableLabel: "Inactive Suppliers",
    ReapairLabel: "Total Assets Supplied",

    total: totalsupplier,
    assigned: activesupplier,
    available: Inactivesupplier,
    repair: totalAssetsupplier,
  };

  //-----------Repair Calculation--------
  const repairId = complaints.map(function (item) {
    return item.repairId;
  });
  const totalrepairs = repairId.length;

  const pendingrepair = complaints.filter(function (item) {
    return item.repairStatus == "Pending";
  }).length;

  const Inprogressrepair = complaints.filter(function (item) {
    return item.repairStatus == "In Progress";
  }).length;

  const completerepairs = complaints.filter(function (item) {
    return item.repairStatus == "Complete";
  }).length;

  const repairReport = {
    title: "Repair",
    totalLabel: "Total Repairs",
    assignedLabel: "Pending Repairs",
    availableLabel: "In Progress",
    ReapairLabel: "Completed Repairs",

    total: totalrepairs,
    assigned: pendingrepair,
    available: Inprogressrepair,
    repair: completerepairs,
  };

  //---------------complaint calculation-------------------
  const complainsId = complaints.map(function (item) {
    return item.complaint;
  });
  const totalcomplain = complainsId.length;

  const opencomplain = complaints.filter(function (item) {
    return item.status == "Open";
  }).length;

  const inprogresscomplain = complaints.filter(function (item) {
    return item.status == "In Progress";
  }).length;

  const Resolvedcomplain = complaints.filter(function (item) {
    return item.status == "Resolved";
  }).length;

  const complainReport = {
    title: "Complain",
    totalLabel: "Total Complaints",
    assignedLabel: "Open Complaints",
    availableLabel: "In Progress",
    ReapairLabel: "Resolved Complaints",

    total: totalcomplain,
    assigned: opencomplain,
    available: inprogresscomplain,
    repair: Resolvedcomplain,
  };

  //--------card change according to report for------------
  let currentReport = assetReport;
  if (reportFor == "employees") {
    currentReport = employeeReport;
  } else if (reportFor == "supplier") {
    currentReport = supplierReport;
  } else if (reportFor == "repair") {
    currentReport = repairReport;
  } else if (reportFor == "complains") {
    currentReport = complainReport;
  }

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
            <option value="supplier">Supplier</option>
            <option value="repair">Repair</option>
            <option value="complains">Complain</option>
          </select>
        </div>
      </div>
      <div className="report-cards">
        <div className="report-card">
          <h3>{currentReport.totalLabel}</h3>
          <p>{currentReport.total}</p>
        </div>
        <div className="report-card">
          <h3>{currentReport.assignedLabel}</h3>
          <p>{currentReport.assigned}</p>
        </div>
        <div className="report-card">
          <h3>{currentReport.availableLabel}</h3>
          <p>{currentReport.available}</p>
        </div>
        <div className="report-card">
          <h3>{currentReport.ReapairLabel}</h3>
          <p>{currentReport.repair}</p>
        </div>
      </div>
      <div className="chart-filter">
        <label>Chart Type</label>
        <select
          value={chartType}
          onChange={function (item) {
            setCharttype(item.target.value);
          }}
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div className="chart-heading">
        <h2>{currentReport.title}Report chart</h2>
      </div>
      <div className="chart-section">
        <ResponsiveContainer
          width="60%"
          height={250}
          className={chartType === "pie" ? "pie-chart " : "bar-line-chart"}
        >
          {chartType == "bar" && (
            <BarChart
              data={[
                {
                  name: "Report",
                  assigned: currentReport.assigned,
                  available: currentReport.available,
                  repair: currentReport.repair,
                },
              ]}
              barCategoryGap={60}
            >
              <Bar
                dataKey="assigned"
                name={currentReport.assignedLabel}
                fill="blue"
              />
              <Bar
                dataKey="available"
                name={currentReport.avaliableLabel}
                fill="green"
              />
              <Bar
                dataKey="repair"
                name={currentReport.ReapairLabel}
                fill="yellow"
              />
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip />
            </BarChart>
          )}
          {chartType == "line" && (
            <LineChart
              data={[
                {
                  name: currentReport.assignedLabel,
                  value: currentReport.assigned,
                },
                {
                  name: currentReport.availableLabel,
                  value: currentReport.available,
                },
                {
                  name: currentReport.ReapairLabel,
                  value: currentReport.repair,
                },
              ]}
            >
              <Line
                dataKey="value"
                name={currentReport.assignedLabel}
                type="monotone"
                dot={{ r: 6, fill: "blue", stroke: "black", strokeWidth: 2 }}
              />
              <Line
                dataKey="value"
                name={currentReport.avaliableLabel}
                type="monotone"
              />
              <Line
                dataKey="value"
                name={currentReport.ReapairLabel}
                type="monotone"
              />
              <XAxis dataKey="name" />
              <YAxis width={40} />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip />
            </LineChart>
          )}
          {chartType == "pie" && (
            <PieChart>
              <Pie
                data={[
                  {
                    name: currentReport.assignedLabel,
                    value: currentReport.assigned,
                  },
                  {
                    name: currentReport.availableLabel,
                    value: currentReport.available,
                  },
                  {
                    name: currentReport.ReapairLabel,
                    value: currentReport.repair,
                  },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
              >
                <Cell fill="blue" />
                <Cell fill="green" />
                <Cell fill="red" />
              </Pie>

              <Legend
                layout="vertical"
                align="center"
                verticalAlign="middle"
                iconType="circle"
                iconSize={20}
                wrapperStyle={{ lineHeight: "50px", marginLeft: "250px" }}
              />
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
