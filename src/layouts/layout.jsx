import Sidebar from "../Components/Sidebar";
import "./layout.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

function Layout({ className }) {
  const [showlogout, setShowlogout] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`admin-shell ${className || ""}`}>
      <Navbar />

      <div className="layout">
        <Sidebar setShowlogout={setShowlogout} />

        <div className="main-content">
          <Outlet />

          {showlogout && (
            <div className="logout-overlay">
              <div className="logout-box">
                <div className="logout-text">
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

                  <button
                    className="logout-btn"
                    onClick={function () {
                      // Remove login token
                      sessionStorage.removeItem("token");

                      // Remove logged in user
                      sessionStorage.removeItem("loggedInUser");

                      //restart uptime
                      sessionStorage.removeItem("loginTime");

                      setShowlogout(false);

                      navigate("/login");
                    }}
                  >
                    Log-out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
