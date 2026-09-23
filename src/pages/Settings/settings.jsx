import React, { useEffect, useState } from "react";
import "./settings.css";
import { IoSettings } from "react-icons/io5";
import API_URL from "../../config/api";

function Settings({ theme, setTheme }) {
  /*------------------ useStates ----------------*/

  const [openSection, setOpensection] = useState(null);

  const [editmode, seteditmode] = useState(false);

  const [company, setCompany] = useState("IT Assets World");
  const [companyEmail, setCompanyEmail] = useState("info@itassetsworld.com");
  const [companyno, setCompanynNo] = useState("+91 9310483219");
  const [companyAddress, setCompanyAddress] = useState(
    "A-19, Ground Floor, FIEE Complex, Suite No-1041, Okhla Industrial Area Phase-2, New Delhi – 110020",
  );

  const [emailNotification, setEmailNotification] = useState(false);
  const [complaintNotification, setComplaintNotification] = useState(false);
  const [repairNotification, setRepairNotification] = useState(false);
  const [assetNotification, setAssetNotification] = useState(false);
  const [lowStockAlert, setLowStockAlert] = useState(false);

  const [items, setItems] = useState("one");
  const [dateFormat, setDate] = useState("days");

  const [currentpassword, setCurrentpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [conformpassword, setConformpassword] = useState("");

  const [twofactor, setTwofactor] = useState(false);
  const [logout, setLogout] = useState("Never");
  const [uptime, setUptime] = useState("00:00:00");

  const [changepassword, setChangepassword] = useState(false);

  /*------------------ Admin ID ----------------*/

  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser") || "{}",
  );

  const adminId = loggedInUser.id;

  /*---------------------Up-time----------------------*/
  useEffect(function () {
    const loginTime = sessionStorage.getItem("loginTime");

    if (!loginTime) {
      setUptime("00:00:00");
      return;
    }

    function updateUptime() {
      const difference = Date.now() - Number(loginTime);

      const totalSeconds = Math.floor(difference / 1000);

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setUptime(
        String(hours).padStart(2, "0") +
          ":" +
          String(minutes).padStart(2, "0") +
          ":" +
          String(seconds).padStart(2, "0"),
      );
    }

    updateUptime();

    const timer = setInterval(updateUptime, 1000);

    return function () {
      clearInterval(timer);
    };
  }, []);

  /*------------------ GET SETTINGS ----------------*/

  useEffect(
    function () {
      if (!adminId) {
        return;
      }

      fetch(`${API_URL}/api/admins/` + adminId + "/settings", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to fetch settings");
          }

          return response.json();
        })
        .then(function (settings) {
          /* General */

          if (settings && settings.general) {
            setCompany(settings.general.company || "IT Assets World");

            setCompanyEmail(
              settings.general.companyEmail || "info@itassetsworld.com",
            );

            setCompanynNo(settings.general.companyno || "+91 9310483219");

            setCompanyAddress(
              settings.general.companyAddress ||
                "A-19, Ground Floor, FIEE Complex, Suite No-1041, Okhla Industrial Area Phase-2, New Delhi – 110020",
            );
          }

          /* Notifications */

          if (settings && settings.notifications) {
            setEmailNotification(
              settings.notifications.emailNotification || false,
            );

            setComplaintNotification(
              settings.notifications.complaintNotification || false,
            );

            setRepairNotification(
              settings.notifications.repairNotification || false,
            );

            setAssetNotification(
              settings.notifications.assetNotification || false,
            );

            setLowStockAlert(settings.notifications.lowStockAlert || false);
          }

          /* Display */

          if (settings && settings.display) {
            setTheme(settings.display.theme || "day");

            setItems(settings.display.items || "one");

            setDate(settings.display.dateFormat || "days");
          }

          /* Security */

          if (settings && settings.security) {
            setTwofactor(settings.security.twofactor || false);

            setLogout(settings.security.logout || "Never");

            sessionStorage.setItem(
              "autoLogoutMinutes",
              settings.security.logout || "Never",
            );
          }
        })
        .catch(function (error) {
          console.log("Settings fetch error:", error);
        });
    },
    [adminId],
  );

  /*------------------ GENERAL SETTINGS ----------------*/

  function saveGenralSettings() {
    fetch(`${API_URL}/api/admins/` + adminId + "/settings", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },

      body: JSON.stringify({
        general: {
          company: company,
          companyEmail: companyEmail,
          companyno: companyno,
          companyAddress: companyAddress,
        },
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return {
            ok: response.ok,
            data: data,
          };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          alert(result.data.message || "Failed to save general settings");
          return;
        }

        alert("General settings saved successfully");
        seteditmode(false);
      })
      .catch(function (error) {
        console.log("General settings error:", error);
        alert("Server se connection nahi ho raha");
      });
  }

  /*------------------ NOTIFICATION SETTINGS ----------------*/

  function saveNotificationSettings() {
    fetch(`${API_URL}/api/admins/` + adminId + "/settings", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },

      body: JSON.stringify({
        notifications: {
          emailNotification: emailNotification,
          complaintNotification: complaintNotification,
          repairNotification: repairNotification,
          assetNotification: assetNotification,
          lowStockAlert: lowStockAlert,
        },
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return {
            ok: response.ok,
            data: data,
          };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          alert(result.data.message || "Failed to save notification settings");
          return;
        }

        alert("Notification settings saved successfully");
      })
      .catch(function (error) {
        console.log("Notification settings error:", error);
        alert("Server se connection nahi ho raha");
      });
  }

  /*------------------ DISPLAY SETTINGS ----------------*/

  function saveDisplaySettings() {
    fetch(`${API_URL}/api/admins/` + adminId + "/settings", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },

      body: JSON.stringify({
        display: {
          theme: theme,
          items: items,
          dateFormat: dateFormat,
        },
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return {
            ok: response.ok,
            data: data,
          };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          alert(result.data.message || "Failed to save display settings");
          return;
        }

        alert("Display settings saved successfully");
      })
      .catch(function (error) {
        console.log("Display settings error:", error);
        alert("Server se connection nahi ho raha");
      });
  }

  /*------------------ SECURITY SETTINGS ----------------*/

  function saveSecuritySettings() {
    fetch(`${API_URL}/api/admins/` + adminId + "/settings", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },

      body: JSON.stringify({
        security: {
          twofactor: twofactor,
          logout: logout,
        },
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return {
            ok: response.ok,
            data: data,
          };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          alert(result.data.message || "Failed to save security settings");
          return;
        }

        alert("Security settings saved successfully");
        sessionStorage.setItem("autoLogoutMinutes", logout);
      })
      .catch(function (error) {
        console.log("Security settings error:", error);
        alert("Server se connection nahi ho raha");
      });
  }

  /*------------------ PASSWORD ----------------*/

  function Changepassword() {
    if (currentpassword == "") {
      alert("Please Enter your Current Password");
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

    fetch(`${API_URL}/api/admins/` + adminId + "/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        currentPassword: currentpassword,
        newPassword: newpassword,
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return {
            ok: response.ok,
            data: data,
          };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          alert(result.data.message || "Failed to change password");
          return;
        }

        alert("Password changed successfully");

        setCurrentpassword("");
        setNewpassword("");
        setConformpassword("");
        setChangepassword(false);
      })
      .catch(function (error) {
        console.log("Change password error:", error);
        alert("Server se connection nahi ho raha");
      });
  }

  return (
    <div className="settings">
      <h1>
        <IoSettings />
        Settings
      </h1>

      {/*-------------- General setting ------------*/}

      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "general" ? null : "general");
        }}
      >
        <h2>Gernal Settings</h2>

        <span className={openSection == "general" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
      </div>

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
                } else {
                  seteditmode(true);
                }
              }}
            >
              {editmode ? "Save Changes" : "Update detail"}
            </button>
          </div>
        </div>
      )}

      {/*-------------- Notification setting ------------*/}

      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "notification" ? null : "notification");
        }}
      >
        <h2>Notification Settings</h2>

        <span
          className={openSection == "notification" ? "arrow rotate" : "arrow"}
        >
          ▲
        </span>
      </div>

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
            <button onClick={saveNotificationSettings}>Save Changes</button>
          </div>
        </div>
      )}

      {/*-------------- Display setting ------------*/}

      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "display" ? null : "display");
        }}
      >
        <h2>Display Settings</h2>

        <span className={openSection == "display" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
      </div>

      {openSection == "display" && (
        <div className="settings-content">
          <div className="settings-item">
            <label>Theme</label>

            <select
              value={theme}
              onChange={function (item) {
                setTheme(item.target.value);
                localStorage.setItem("theme", item.target.value);
              }}
            >
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>
          </div>

          {/* <div className="settings-item">
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
              value={dateFormat}
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
          </div>*/}
        </div>
      )}

      {/*-------------- Security setting ------------*/}

      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection === "security" ? null : "security");
        }}
      >
        <h2>Security Settings</h2>

        <span className={openSection == "security" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
      </div>

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
                  placeholder="Conform your Password"
                  value={conformpassword}
                  onChange={function (item) {
                    setConformpassword(item.target.value);
                  }}
                />
              </div>

              <div className="save-button">
                <button onClick={Changepassword}>Save Changes</button>
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
              <option value="Never">Never</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

          <div className="save-button">
            <button onClick={saveSecuritySettings}>Save Changes</button>
          </div>
        </div>
      )}

      {/*-------------- System Information ------------*/}

      <div
        className="settings-section-header"
        onClick={function () {
          setOpensection(openSection == "system" ? null : "system");
        }}
      >
        <h2>System Information</h2>

        <span className={openSection == "system" ? "arrow rotate" : "arrow"}>
          ▲
        </span>
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
            <span>17 Aug 2026</span>
          </div>

          <div className="settings-item">
            <label>System Uptime</label>
            <span>{uptime}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
