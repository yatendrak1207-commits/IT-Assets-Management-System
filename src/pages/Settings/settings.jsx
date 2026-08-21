import React, { useState } from "react";
import "./settings.css";
import { use } from "react";
import { IoSettings } from "react-icons/io5";

function Settings() {
  /*------------------useStates----------------*/
  const [openSection, setOpensection] = useState(null);

  const [editmode, seteditmode] = useState(false);
  const [company, setCompany] = useState(
    localStorage.getItem("company") || "IT Assets World",
  );
  const [companyEmail, setCompanyEmail] = useState(
    localStorage.getItem("companyEmail") || "info@itassetsworld.com",
  );
  const [companyno, setCompanynNo] = useState(
    localStorage.getItem("companyno") || "+91 9310483219",
  );
  const [companyAddress, setCompanyAddress] = useState(
    localStorage.getItem("comapnyaddress") ||
      "A-19, Ground Floor, FIEE Complex, Suite No-1041, Okhla Industrial Area Phase-2, New Delhi – 110020",
  );
  const [emailNotification, setEmailNotification] = useState(
    localStorage.getItem("emailNotification") === "true",
  );
  const [complaintNotification, setComplaintNotification] = useState(
    localStorage.getItem("complaintNotification") === "true",
  );
  const [repairNotification, setRepairNotification] = useState(
    localStorage.getItem("repairNotification") === "true",
  );
  const [assetNotification, setAssetNotification] = useState(
    localStorage.getItem("assetNotification") === "true",
  );
  const [lowStockAlert, setLowStockAlert] = useState(
    localStorage.getItem("lowStockAlert") === "true",
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "day");
  const [items, setItems] = useState(localStorage.getItem("items") || "one");
  const [Date, setDate] = useState(localStorage.getItem("Date") || "days");
  const [currentpassword, setCurrentpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [conformpassword, setConformpassword] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [twofactor, setTwofactor] = useState(
    localStorage.getItem("twofactor") === "true",
  );
  const [logout, setLogout] = useState(
    localStorage.getItem("logout") || "Never",
  );
  const [changepassword, setChangepassword] = useState(false);

  function Changepassword() {
    const savedPassword = localStorage.getItem("currentpassword");
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
    localStorage.setItem("currentpassword", currentpassword);
    localStorage.setItem("newpassword", newpassword);
    localStorage.setItem("conformpassword", conformpassword);

    setCurrentpassword("");
    setNewpassword("");
    setConformpassword("");
    alert("Password changed successfully");
  }
  function saveNotificationSettings() {
    localStorage.setItem("emailNotification", emailNotification);
    localStorage.setItem("complaintNotification", complaintNotification);
    localStorage.setItem("repairNotification", repairNotification);
    localStorage.setItem("assetNotification", assetNotification);
    localStorage.setItem("lowStockAlert", lowStockAlert);

    alert("Notification settings saved successfully");
  }
  function saveDisplaySettings() {
    localStorage.setItem("theme", theme);
    localStorage.setItem("items", items);
    localStorage.setItem("Date", Date);

    alert("Display settings saved successfully");
  }
  function saveGenralSettings() {
    localStorage.setItem("company", company);
    localStorage.setItem("companyEmail", companyEmail);
    localStorage.setItem("companyno", companyno);
    localStorage.setItem("companyAddress", companyAddress);

    alert("General settings saved successfully");
  }
  function saveSecuritySettings() {
    localStorage.setItem("twofactor", twofactor);
    localStorage.setItem("logout", logout);

    alert("security settings saved successfully");
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
            {editmode ? (
              <input
                type="text"
                placeholder="company"
                value={company}
                onChange={function (x) {
                  setCompany(x.target.value);
                }}
              />
            ) : (
              <h4>{company}</h4>
            )}
          </div>
          <div className="settings-item">
            <label>Company Email</label>
            {editmode ? (
              <input
                type="text"
                placeholder="Company Email"
                value={companyEmail}
                onChange={function (x) {
                  setCompanyEmail(x.target.value);
                }}
              />
            ) : (
              <h4>{companyEmail}</h4>
            )}
          </div>
          <div className="settings-item">
            <label>Company phone No.</label>
            {editmode ? (
              <input
                type="text"
                placeholder="Company contact no."
                value={companyno}
                onChange={function (x) {
                  setCompanynNo(x.target.value);
                }}
              />
            ) : (
              <h4>{companyno}</h4>
            )}
          </div>
          <div className="settings-item">
            <label>Company Address</label>
            {editmode ? (
              <input
                type="text"
                placeholder="Company Address"
                value={companyAddress}
                onChange={function (x) {
                  setCompanyAddress(x.target.value);
                }}
              />
            ) : (
              <h4>{companyAddress}</h4>
            )}
          </div>
          <div className="save-button">
            <button
              onClick={function () {
                if (editmode) {
                  saveGenralSettings();
                }
                seteditmode(!editmode);
              }}
            >
              {editmode ? "Save Changes" : "update detail"}
            </button>
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
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={function () {
                  setEmailNotification(!emailNotification);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Complaint Notification</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={complaintNotification}
                onChange={function () {
                  setComplaintNotification(!complaintNotification);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Repair Notification</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={repairNotification}
                onChange={function () {
                  setRepairNotification(!repairNotification);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Asset Assignment Notification</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={assetNotification}
                onChange={function () {
                  setAssetNotification(!assetNotification);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <label>Low Stock Alert</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={lowStockAlert}
                onChange={function () {
                  setLowStockAlert(!lowStockAlert);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="save-button">
            <button onClick={saveDisplaySettings}>Save Changes</button>
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
            <button onClick={saveDisplaySettings}>Save Changes</button>
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
              <input
                type="checkbox"
                checked={twofactor}
                onChange={function () {
                  setTwofactor(!twofactor);
                }}
              />
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
            <button onClick={saveSecuritySettings}>save Changes</button>
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
