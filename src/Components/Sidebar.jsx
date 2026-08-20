import "./Sidebar.css";
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
function Sidebar({ setShowlogout }) {
  return (
    <div className="sidebar">
      <h2>IT Assets</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" className="sidebar-item">
            <MdOutlineDashboard />
            Dashboard
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/assets" className="sidebar-item">
            <LuMonitorSpeaker />
            Assets
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/employees" className="sidebar-item">
            <BsFillPeopleFill />
            Employees
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/suppiler" className="sidebar-item">
            <FaTruck />
            Suppiler
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/repair" className="sidebar-item">
            <GiAutoRepair />
            Repair
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/report" className="sidebar-item">
            <IoBarChart />
            Reports
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/settings" className="sidebar-item">
            <IoSettings />
            Settings
          </NavLink>
        </li>
        <hr />
        <li>
          <NavLink to="/profile" className="sidebar-item">
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

export default Sidebar;
