import React from "react";
import Card from "../../Components/Card/Card";
import { useState, useEffect } from "react";
import "./Report.css";

import { IoBarChart } from "react-icons/io5";
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

  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    // Assets
    fetch("http://localhost:5000/api/assets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch assets");
          }

          return data;
        });
      })
      .then(function (data) {
        setAssets(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Error fetching assets:", error);
        setAssets([]);
      });

    // Employees
    fetch("http://localhost:5000/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch employees");
          }

          return data;
        });
      })
      .then(function (data) {
        setEmployees(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Error fetching employees:", error);
        setEmployees([]);
      });

    // Repairs
    fetch("http://localhost:5000/api/repairs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch repairs");
          }

          return data;
        });
      })
      .then(function (data) {
        setRepairs(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Error fetching repairs:", error);
        setRepairs([]);
      });

    // Suppliers
    fetch("http://localhost:5000/api/suppliers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch suppliers");
          }

          return data;
        });
      })
      .then(function (data) {
        setSuppliers(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Error fetching suppliers:", error);
        setSuppliers([]);
      });
  }, []);

  //---------------Assets calculation--------------

  const totalAssets = assets.length;

  const assigned = assets.filter(function (item) {
    return item.assignedTo;
  }).length;

  const avaliable = totalAssets - assigned;

  const repair = repairs.filter(function (item) {
    return item.status === "Pending";
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

  const totalemployees = employees.length;

  const assignedemployees = employees.filter(function (item) {
    return item.assignedAsset;
  }).length;

  const avaliableemployee = totalemployees - assignedemployees;

  const inactiveemployees = employees.filter(function (item) {
    return item.employeestatus === "Inactive";
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

  //-------------Supplier calculation-------

  const totalsupplier = suppliers.length;

  const activeSuppliers = suppliers.filter(function (item) {
    return item.status === "Active";
  }).length;

  const inactiveSuppliers = suppliers.filter(function (item) {
    return item.status === "Inactive";
  }).length;

  const totalAssetsSupplied = suppliers.reduce(function (total, item) {
    return total + (item.assetsSupplied || 0);
  }, 0);

  const supplierReport = {
    title: "supplier",
    totalLabel: "Total Suppliers",
    assignedLabel: "Active Suppliers",
    availableLabel: "Inactive Suppliers",
    ReapairLabel: "Total Assets Supplied",

    total: totalsupplier,
    assigned: activeSuppliers,
    available: inactiveSuppliers,
    repair: totalAssetsSupplied,
  };

  //-----------Repair Calculation--------

  const totalrepairs = repairs.length;

  const pendingrepair = repairs.filter(function (item) {
    return item.status === "Pending";
  }).length;

  const Inprogressrepair = repairs.filter(function (item) {
    return item.status === "In Progress";
  }).length;

  const completerepairs = repairs.filter(function (item) {
    return item.status === "Completed";
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

  //--------card change according to report for------------

  let currentReport = assetReport;

  if (reportFor === "employees") {
    currentReport = employeeReport;
  } else if (reportFor === "supplier") {
    currentReport = supplierReport;
  } else if (reportFor === "repair") {
    currentReport = repairReport;
  }

  return (
    <div className="report">
      <div className="report-header">
        <h1>
          <IoBarChart />
          Report
        </h1>

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
          {chartType === "bar" && (
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
                fill="#09325a"
              />

              <Bar
                dataKey="available"
                name={currentReport.availableLabel}
                fill="#10865e"
              />

              <Bar
                dataKey="repair"
                name={currentReport.ReapairLabel}
                fill="#710202"
              />

              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip />
            </BarChart>
          )}

          {chartType === "line" && (
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
                dot={{
                  r: 4,
                  fill: "#09325a",
                  stroke: "#043927",
                  strokeWidth: 3,
                }}
              />

              <XAxis dataKey="name" />
              <YAxis width={40} />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip />
            </LineChart>
          )}

          {chartType === "pie" && (
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
                <Cell fill="#09325a" />
                <Cell fill="#10865e" />
                <Cell fill="#710202" />
              </Pie>

              <Legend
                layout="vertical"
                align="center"
                verticalAlign="middle"
                iconType="circle"
                iconSize={20}
                wrapperStyle={{
                  lineHeight: "50px",
                  marginLeft: "250px",
                }}
              />

              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
