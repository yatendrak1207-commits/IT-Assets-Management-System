import Card from "../../Components/Card/Card";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>DashBoard</h1>
      <div className="card-container">
        <Card title="Total Assets" value="250" />
        <Card title="Employees" value="80" />
        <Card title="Complaints" value="15" />
        <Card title="Repair" value="5" />
      </div>
    </div>
  );
}

export default Dashboard;
