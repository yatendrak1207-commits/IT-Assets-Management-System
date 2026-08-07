import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>IT Assets</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" className="sidebar-item">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/assets" className="sidebar-item">
            Assets
          </NavLink>
        </li>
        <li>
          <NavLink to="/employees" className="sidebar-item">
            Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/supplier" className="sidebar-item">
            Suppiler
          </NavLink>
        </li>
        <li>
          <NavLink to="/repair" className="sidebar-item">
            Repair
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className="sidebar-item">
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="sidebar-item">
            Settings
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="sidebar-item">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/logout" className="sidebar-item">
            Log-Out
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
