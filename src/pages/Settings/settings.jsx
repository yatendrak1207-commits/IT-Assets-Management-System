import React, { useState } from "react";
import "./settings.css";
import { use } from "react";
import { IoSettings } from "react-icons/io5";

function Settings() {
  /*------------------useStates----------------*/
  const [openSection, setOpensection] = useState(null);
  const [theme, setTheme] = useState("");

  const [items, setItems] = useState("");
  const [Date, setDate] = useState("");
  const [currentpassword, setCurrentpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [conformpassword, setConformpassword] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [logout, setLogout] = useState(null);
  const [changepassword, setChangepassword] = useState(false);

  function Changepassword() {
    if (currentpassword == "") {
      alert("Please Enter your Currrent Password");
      return;
    }
    if (newpassword == "") {
      alert("Please Enter your New Password");
      return;
    }
    if (conformpassword == "") {
      alert("Please Enter your Conform Password");
      return;
    }
    if (newpassword != conformpassword) {
      alert("Your New password and Conform password is not match");
      return;
    }
    if (newpassword.length < 6) {
      alert("Password must be at least 6 character");
      return;
    }
    alert("Password changed successfully");

    setCurrentpassword("");
    setNewpassword("");
    setConformpassword("");
  }
  return (
    /*----------setting--------------- */
    <div className="settings">
      <h1>
        <IoSettings />
        Settings
      </h1>
      {/*--------------Gernal setting------------*/}
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "general" ? null : "general");
        }}
      >
        <h2>Gernal Settings</h2>
        <span>▼</span>
      </div>
      {/*-------General setting options--------------*/}
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
      {/*--------------Notification setting------------*/}
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "notification" ? null : "notification");
        }}
      >
        <h2>Notification Settings</h2>
        <span>▼</span>
      </div>
      {/*--------------Notification setting options------------*/}
      {openSection == "notification" && (
        <div className="settings-content">
          <div className="settings-item">
            <label>Email Notification</label>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Complaint Notification</label>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Repair Notification</label>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Asset Assignment Notification</label>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Low Stock Alert</label>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="save-button">
            <button>Save Changes</button>
          </div>
        </div>
      )}
      {/*--------------Display setting------------*/}
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "display" ? null : "display");
        }}
      >
        <h2>Display Settings</h2>
        <span>▼</span>
      </div>
      {/*--------------Display setting option------------*/}
      {openSection == "display" && (
        <div className="settings-content">
          <div className="settings-item">
            <label>Theme</label>
            <select
              value={theme}
              onChange={function (item) {
                setTheme(item.target.value);
              }}
            >
              <option value="day">Day</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div className="settings-item">
            <label>Items per page</label>
            <select
              value={items}
              onChange={function (item) {
                setItems(item.target.value);
              }}
            >
              <option value="one">10 items Per page</option>
              <option value="two">20 items Per page</option>
              <option value="three">30 items Per page</option>
              <option value="four">40 items Per page</option>
              <option value="five">50 items Per page</option>
            </select>
          </div>
          <div className="settings-item">
            <label>Date Format</label>
            <select
              value={Date}
              onChange={function (item) {
                setDate(item.target.value);
              }}
            >
              <option value="days">DD/MM/YYYY</option>
              <option value="month">MM/DD/YYYY</option>
              <option value="year">YYYY/MM/DD</option>
            </select>
          </div>
          <div className="save-button">
            <button>Save Changes</button>
          </div>
        </div>
      )}
      {/*--------------Security setting------------*/}
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection === "security" ? null : "security");
        }}
      >
        <h2>Security Settings</h2>
        <span>▼</span>
      </div>
      {/*--------------Security setting option------------*/}
      {openSection == "security" && (
        <div className="settings-content">
          <div className="settings-item">
            <label>Change Password</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={changepassword}
                onChange={function () {
                  setChangepassword(!changepassword);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          {changepassword && (
            <div className="password-fields">
              <div className="settings-item">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter your Current Password"
                  value={currentpassword}
                  onChange={function (item) {
                    setCurrentpassword(item.target.value);
                  }}
                />
              </div>
              <div className="settings-item">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter your New Password"
                  value={newpassword}
                  onChange={function (item) {
                    setNewpassword(item.target.value);
                  }}
                />
              </div>
              <div className="settings-item">
                <label>Conform Password</label>
                <input
                  type="password"
                  placeholder=" Conform your Password"
                  value={conformpassword}
                  onChange={function (item) {
                    setConformpassword(item.target.value);
                  }}
                />
              </div>
              <div className="save-button">
                <button onClick={Changepassword}>save Changes</button>
              </div>
            </div>
          )}
          <div className="settings-item">
            <label>Two-Factor Authentication</label>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Auto Log-Out</label>
            <select
              value={logout}
              onChange={function (item) {
                setLogout(item.target.value);
              }}
            >
              <option value="null">Never</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">60 min</option>
            </select>
          </div>
          <div className="save-button">
            <button>save Changes</button>
          </div>
        </div>
      )}
      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "system" ? null : "system");
        }}
      >
        <h2>System Information</h2>
        <span>▼</span>
      </div>
      {openSection == "system" && (
        <div className="settings-content">
          <div className="settings-item">
            <label>Operating System</label>
            <span>Window 11</span>
          </div>
          <div className="settings-item">
            <label>Browser</label>
            <span>Chrome / Edge</span>
          </div>
          <div className="settings-item">
            <label>Screen Resolution</label>
            <span>1920 × 1080</span>
          </div>
          <div className="settings-item">
            <label>Application Version</label>
            <span>1.0.0</span>
          </div>
          <div className="settings-item">
            <label>System Status</label>
            <span>Running</span>
          </div>
          <div className="settings-item">
            <label>Last Update</label>
            <span> 17 Aug 2026</span>
          </div>
          <div className="settings-item">
            <label>System Uptime</label>
            <span>5 hours 32 minutes</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
