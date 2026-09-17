import React, { useState } from "react";
import "./UserSetting.css";
import { IoSettings } from "react-icons/io5";

function UserSettings({ theme, setTheme }) {
  const [openSection, setOpenSection] = useState(null);

  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  const [emailNotification, setEmailNotification] = useState(
    localStorage.getItem("userEmailNotification") === "true",
  );

  const [complaintNotification, setComplaintNotification] = useState(
    localStorage.getItem("userComplaintNotification") === "true",
  );

  const [repairNotification, setRepairNotification] = useState(
    localStorage.getItem("userRepairNotification") === "true",
  );

  const [assetNotification, setAssetNotification] = useState(
    localStorage.getItem("userAssetNotification") === "true",
  );

  const [items, setItems] = useState(
    localStorage.getItem("userItems") || "one",
  );

  const [dateFormat, setDateFormat] = useState(
    localStorage.getItem("userDateFormat") || "days",
  );

  const [currentpassword, setCurrentpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [conformpassword, setConformpassword] = useState("");

  const [changepassword, setChangepassword] = useState(false);

  const [twofactor, setTwofactor] = useState(
    localStorage.getItem("userTwofactor") === "true",
  );

  function saveNotificationSettings() {
    localStorage.setItem("userEmailNotification", emailNotification);

    localStorage.setItem("userComplaintNotification", complaintNotification);

    localStorage.setItem("userRepairNotification", repairNotification);

    localStorage.setItem("userAssetNotification", assetNotification);

    alert("Notification settings saved successfully");
  }

  function saveDisplaySettings() {
    localStorage.setItem("userTheme", theme);
    localStorage.setItem("userItems", items);
    localStorage.setItem("userDateFormat", dateFormat);

    alert("Display settings saved successfully");
  }

  function saveSecuritySettings() {
    localStorage.setItem("userTwofactor", twofactor);

    alert("Security settings saved successfully");
  }

  async function ChangePassword() {
    if (currentpassword === "") {
      alert("Please enter your current password");
      return;
    }

    if (newpassword === "") {
      alert("Please enter your new password");
      return;
    }

    if (conformpassword === "") {
      alert("Please confirm your new password");
      return;
    }

    if (newpassword !== conformpassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (newpassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/employees/change-password/${loggedInUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword: currentpassword,
            newPassword: newpassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setCurrentpassword("");
      setNewpassword("");
      setConformpassword("");
      setChangepassword(false);

      alert("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.message);
    }
  }

  return (
    <div className="user-settings">
      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <h1>
        <IoSettings />
        Settings
      </h1>

      {/* =================================================
          ACCOUNT SETTINGS
      ================================================= */}

      <div
        className="user-settings-section-header"
        onClick={function () {
          setOpenSection(openSection === "account" ? null : "account");
        }}
      >
        <h2>Account Settings</h2>

        <span className={openSection == "account" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
      </div>

      {openSection === "account" && (
        <div className="user-settings-content">
          <div className="user-settings-item">
            <label>Name</label>
            <span>{loggedInUser?.employeeName || "User"}</span>
          </div>

          <div className="user-settings-item">
            <label>Email</label>
            <span>{loggedInUser?.email || "Not Available"}</span>
          </div>

          <div className="user-settings-item">
            <label>Employee ID</label>
            <span>{loggedInUser?.employeeId || "Not Available"}</span>
          </div>

          <div className="user-settings-item">
            <label>Department</label>
            <span>{loggedInUser?.department || "Not Available"}</span>
          </div>

          <div className="user-settings-item">
            <label>Phone</label>
            <span>{loggedInUser?.phone || "Not Available"}</span>
          </div>
        </div>
      )}

      {/* =================================================
          NOTIFICATION SETTINGS
      ================================================= */}

      <div
        className="user-settings-section-header"
        onClick={function () {
          setOpenSection(
            openSection === "notification" ? null : "notification",
          );
        }}
      >
        <h2>Notification Settings</h2>
        <span
          className={openSection == "notification" ? "arrow rotate" : "arrow"}
        >
          ▲
        </span>
      </div>

      {openSection === "notification" && (
        <div className="user-settings-content">
          <div className="user-settings-item">
            <label>Email Notification</label>

            <label className="user-switch">
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={function () {
                  setEmailNotification(!emailNotification);
                }}
              />

              <span className="user-slider"></span>
            </label>
          </div>

          <div className="user-settings-item">
            <label>Complaint Notification</label>

            <label className="user-switch">
              <input
                type="checkbox"
                checked={complaintNotification}
                onChange={function () {
                  setComplaintNotification(!complaintNotification);
                }}
              />

              <span className="user-slider"></span>
            </label>
          </div>

          <div className="user-settings-item">
            <label>Repair Notification</label>

            <label className="user-switch">
              <input
                type="checkbox"
                checked={repairNotification}
                onChange={function () {
                  setRepairNotification(!repairNotification);
                }}
              />

              <span className="user-slider"></span>
            </label>
          </div>

          <div className="user-settings-item">
            <label>Asset Assignment Notification</label>

            <label className="user-switch">
              <input
                type="checkbox"
                checked={assetNotification}
                onChange={function () {
                  setAssetNotification(!assetNotification);
                }}
              />

              <span className="user-slider"></span>
            </label>
          </div>

          <div className="user-save-button">
            <button onClick={saveNotificationSettings}>Save Changes</button>
          </div>
        </div>
      )}

      {/* =================================================
          DISPLAY SETTINGS
      ================================================= */}

      <div
        className="user-settings-section-header"
        onClick={function () {
          setOpenSection(openSection === "display" ? null : "display");
        }}
      >
        <h2>Display Settings</h2>
        <span className={openSection == "display" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
      </div>

      {openSection === "display" && (
        <div className="user-settings-content">
          <div className="user-settings-item">
            <label>Theme</label>

            <select
              value={theme}
              onChange={function (item) {
                setTheme(item.target.value);
                localStorage.setItem("userTheme", item.target.value);
              }}
            >
              <option value="day">Day</option>

              <option value="night">Night</option>
            </select>
          </div>

          <div className="user-settings-item">
            <label>Items Per Page</label>

            <select
              value={items}
              onChange={function (item) {
                setItems(item.target.value);
              }}
            >
              <option value="one">10 Items</option>
              <option value="two">20 Items</option>
              <option value="three">30 Items</option>
              <option value="four">40 Items</option>
              <option value="five">50 Items</option>
            </select>
          </div>

          <div className="user-settings-item">
            <label>Date Format</label>

            <select
              value={dateFormat}
              onChange={function (item) {
                setDateFormat(item.target.value);
              }}
            >
              <option value="days">DD/MM/YYYY</option>
              <option value="month">MM/DD/YYYY</option>
              <option value="year">YYYY/MM/DD</option>
            </select>
          </div>

          <div className="user-save-button">
            <button onClick={saveDisplaySettings}>Save Changes</button>
          </div>
        </div>
      )}

      {/* =================================================
          SECURITY SETTINGS
      ================================================= */}

      <div
        className="user-settings-section-header"
        onClick={function () {
          setOpenSection(openSection === "security" ? null : "security");
        }}
      >
        <h2>Security Settings</h2>
        <span className={openSection == "security" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
      </div>

      {openSection === "security" && (
        <div className="user-settings-content">
          {/* Change Password */}

          <div className="user-settings-item">
            <label>Change Password</label>

            <label className="user-switch">
              <input
                type="checkbox"
                checked={changepassword}
                onChange={function () {
                  setChangepassword(!changepassword);
                }}
              />

              <span className="user-slider"></span>
            </label>
          </div>

          {changepassword && (
            <div className="user-password-fields">
              <div className="user-settings-item">
                <label>Current Password</label>

                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentpassword}
                  onChange={function (item) {
                    setCurrentpassword(item.target.value);
                  }}
                />
              </div>

              <div className="user-settings-item">
                <label>New Password</label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newpassword}
                  onChange={function (item) {
                    setNewpassword(item.target.value);
                  }}
                />
              </div>

              <div className="user-settings-item">
                <label>Confirm Password</label>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={conformpassword}
                  onChange={function (item) {
                    setConformpassword(item.target.value);
                  }}
                />
              </div>

              <div className="user-save-button">
                <button onClick={ChangePassword}>Save Changes</button>
              </div>
            </div>
          )}

          {/* Two Factor */}

          <div className="user-settings-item">
            <label>Two-Factor Authentication</label>

            <label className="user-switch">
              <input
                type="checkbox"
                checked={twofactor}
                onChange={function () {
                  setTwofactor(!twofactor);
                }}
              />

              <span className="user-slider"></span>
            </label>
          </div>

          <div className="user-save-button">
            <button onClick={saveSecuritySettings}>Save Changes</button>
          </div>
        </div>
      )}

      {/* =================================================
          SYSTEM INFORMATION
      ================================================= */}

      <div
        className="user-settings-section-header"
        onClick={function () {
          setOpenSection(openSection === "system" ? null : "system");
        }}
      >
        <h2>System Information</h2>
        <span className={openSection == "system" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
      </div>

      {openSection === "system" && (
        <div className="user-settings-content">
          <div className="user-settings-item">
            <label>Application Version</label>
            <span>1.0.0</span>
          </div>

          <div className="user-settings-item">
            <label>System Status</label>
            <span>Running</span>
          </div>

          <div className="user-settings-item">
            <label>Browser</label>
            <span>Chrome / Edge</span>
          </div>

          <div className="user-settings-item">
            <label>Last Update</label>
            <span>24 Aug 2026</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSettings;
