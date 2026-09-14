import "./UserSidebar.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { LuMonitorSpeaker } from "react-icons/lu";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaTruck } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";
import { IoBarChart } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { MdNotificationsActive } from "react-icons/md";
function UserSidebar({ setShowlogout }) {
  return (
    <div className="user-sidebar">
      <h2>IT Assets</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/User" end className="sidebar-item">
            <MdOutlineDashboard />
            Dashboard
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/user/assets" className="sidebar-item">
            <LuMonitorSpeaker />
            MY Assets
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/user/complaints" className="sidebar-item">
            <BsFillPeopleFill />
            Complaints
          </NavLink>
        </li>
        <hr />

        <li>
          <NavLink to="/user/repairs" className="sidebar-item">
            <GiAutoRepair />
            Repair
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/user/notifications" className="sidebar-item">
            <MdNotificationsActive />
            Notification
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/user/settings" className="sidebar-item">
            <IoSettings />
            Settings
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/user/profile" className="sidebar-item">
            <FaUser />
            Profile
          </NavLink>
        </li>
        <hr />
        <li>
          <button
            className="sidebar-item"
            onClick={function () {
              console.log("logout   clickerd");
              setShowlogout(true);
            }}
          >
            <RiLogoutBoxRFill />
            Log-Out
          </button>
        </li>
      </ul>
    </div>
  );
}

export default UserSidebar;
