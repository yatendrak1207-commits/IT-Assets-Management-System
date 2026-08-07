import Sidebar from "../Components/Sidebar";
import "./layout.css";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
