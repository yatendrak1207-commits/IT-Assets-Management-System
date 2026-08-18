import Sidebar from "../Components/Sidebar";
import "./layout.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const [showlogout, setShowlogout] = useState(false);
  return (
    <div className="layout">
      <Sidebar setShowlogout={setShowlogout} />
      <div className="main-content">
        <Outlet />
        {showlogout && (
          <div className="logout-overlay">
            <div className="logout-box">
              <div className="logout-text ">
                <h2>Conform Log-Out</h2>
                <p>Are you sure you want Log-Out</p>
              </div>
              <div className="logout-button">
                <button
                  className="cancel-btn"
                  onClick={function () {
                    setShowlogout(false);
                  }}
                >
                  Cancel
                </button>
                <button className="logout-btn">Log-out</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
