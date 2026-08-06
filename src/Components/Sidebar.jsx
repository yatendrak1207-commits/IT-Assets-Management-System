import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>IT Assets</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">Dashboard</li>
        <li className="sidebar-item">Assets</li>
        <li className="sidebar-item">Employees</li>
        <li className="sidebar-item">Suppiler</li>
        <li className="sidebar-item">Repair</li>
        <li className="sidebar-item">Reports</li>
        <li className="sidebar-item">Settings</li>
        <li className="sidebar-item">Profile</li>
        <li className="sidebar-item">Log-Out</li>
      </ul>
    </div>
  );
}

export default Sidebar;
