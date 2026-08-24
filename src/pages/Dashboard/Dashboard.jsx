import Card from "../../Components/Card/Card";
import "./Dashboard.css";
import RecentComplaints from "../../Components/RecentComplaints/RecentComplaints";
import { complaints } from "../../data/data";
import { MdOutlineDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <h1>
        <MdOutlineDashboard />
        DashBoard
      </h1>
      <div className="card-container">
        <Card title="Total Assets" value="250" />
        <Card title="Employees" value="80" />
        <Card title="Complaints" value="15" />
        <Card title="Repair" value="5" />
      </div>
      <RecentComplaints complaints={complaints.slice(0, 3)} />
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
