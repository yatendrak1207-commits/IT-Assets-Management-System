import Card from "../../Components/Card/Card";
import "./Dashboard.css";
import RecentComplaints from "../../Components/RecentComplaints/RecentComplaints";
import { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [employee, setEmployees] = useState([]);
  const [repair, setRepairs] = useState([]);

  useEffect(function () {
    const token = sessionStorage.getItem("token");

    // Assets
    fetch("http://localhost:5000/api/assets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("ASSETS DATA", data);
        setAssets(data);
      });

    // Employees
    fetch("http://localhost:5000/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("EMPLOYEE DATA", data);
        setEmployees(data);
      });

    // Repairs
    fetch("http://localhost:5000/api/repairs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("REPAIR DATA", data);
        setRepairs(data);
      });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>
        <MdOutlineDashboard />
        DashBoard
      </h1>

      <div className="card-container">
        <Card title="Total Assets" value={assets.length} />

        <Card title="Employees" value={employee.length} />

        <Card title="Complaints" value={repair.length} />

        <Card title="Repair" value={repair.length} />
      </div>

      <RecentComplaints complaints={repair} />

      <button
        onClick={function () {
          navigate("/assets");
        }}
      >
        View All{" "}
      </button>
    </div>
  );
}

export default Dashboard;
