import UserSidebar from "../../Components/User/UserSidebar";
import UserNavbar from "../../Components/User/UserNavbar";
import "./UserLayout.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function UserLayout() {
  const [showlogout, setShowlogout] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <UserNavbar />
      <div className="layout">
        <UserSidebar setShowlogout={setShowlogout} />

        <div className="main-content">
          <Outlet />

          {showlogout && (
            <div className="logout-overlay">
              <div className="logout-box">
                <div className="logout-text">
                  <h2>Confirm Log-Out</h2>
                  <p>Are you sure you want to Log-Out?</p>
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
                      localStorage.removeItem("loggedInUser");
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

export default UserLayout;
