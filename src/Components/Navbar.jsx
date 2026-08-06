import "./Navbar.css";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2>Dashboard</h2>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="navbar-right">
        <FaBell className="nav-icon" />
        <FaUser className="nav-icon" />
        <span>Admin</span>
      </div>
    </div>
  );
}

export default Navbar;
