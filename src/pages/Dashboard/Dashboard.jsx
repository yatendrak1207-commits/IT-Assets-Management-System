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
    fetch("http://localhost:5000/api/assets")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("ASSETS DATA", data);
        setAssets(data);
      });

    fetch("http://localhost:5000/api/employees")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("EMPLOYEE DATA", data);
        setEmployees(data);
      });

    fetch("http://localhost:5000/api/repairs")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
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
        <Card title="Complaints" value="15" />
        <Card title="Repair" value={repair.length} />
      </div>
      <RecentComplaints complaints={[]} />
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
