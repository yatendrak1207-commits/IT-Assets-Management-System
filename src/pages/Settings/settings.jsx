import React, { useState } from "react";
import "./settings.css";

function Settings() {
  const [openSection, setOpensection] = useState(null);
  return (
    <div>
      <h1>settings</h1>
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection("general");
        }}
      >
        <h2>Gernal Settings</h2>
        <span>▼</span>
      </div>
      {openSection == "general" && (
        <div className="settings-content">
          <div className="settings-item">
            <label>Company Name</label>
            <input type="text" placeholder="Enter your Compan Name" />
          </div>
          <div className="settings-item">
            <label>Company Email</label>
            <input type="text" placeholder="Enter your Compan Email" />
          </div>
          <div className="settings-item">
            <label>Company phone No.</label>
            <input type="text" placeholder="Enter your Company Phone No." />
          </div>
          <div className="settings-item">
            <label>Company Address</label>
            <input type="text" placeholder="Enter your Compan Address" />
          </div>
          <div className="save-button">
            <button>Save Changes</button>
          </div>
        </div>
      )}
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection("notification");
        }}
      >
        <h2>Notification Settings</h2>
        <span>▼</span>
      </div>
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection("display");
        }}
      >
        <h2>Display Settings</h2>
        <span>▼</span>
      </div>
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection("security");
        }}
      >
        <h2>Security Settings</h2>
        <span>▼</span>
      </div>
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection("system");
        }}
      >
        <h2>System Information</h2>
        <span>▼</span>
      </div>
    </div>
  );
}

export default Settings;
