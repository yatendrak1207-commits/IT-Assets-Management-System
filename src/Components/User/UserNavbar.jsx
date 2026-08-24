import "./UserNavbar.css";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

function UserNavbar() {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2>👤 Hello, User</h2>
      </div>
      <div className="navbar-center">
        <h1>
          <FaUsers />
          IT Assets Management System
        </h1>
      </div>
      <div className="navbar-right">
        <FaBell className="nav-icon" />
        <div className="divider"></div>
        <FaUser className="nav-icon" />
        <span>User</span>
      </div>
    </div>
  );
}

export default UserNavbar;
