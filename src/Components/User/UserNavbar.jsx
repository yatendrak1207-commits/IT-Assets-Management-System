import "./UserNavbar.css";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserNavbar() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const userName = loggedInUser?.employeeName || "User";
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2>👤 Hello, {userName} </h2>
      </div>
      <div className="navbar-center">
        <h1>
          <FaUsers className="users-icon" />
          IT Assets Management System
        </h1>
      </div>
      <div className="navbar-right">
        <FaBell
          className="nav-icon"
          onClick={function () {
            navigate("/user/notifications");
          }}
        />
        <div className="divider"></div>
        <FaUser
          className="nav-icon"
          onClick={function () {
            navigate("/user/profile");
          }}
        />
        <span
          onClick={function () {
            navigate("/user/profile");
          }}
        >
          User
        </span>
      </div>
    </div>
  );
}

export default UserNavbar;
