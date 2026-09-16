import React from "react";
import "./Employees.css";
import { useState, useEffect } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdManageSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import PhoneInputModule from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

const PhoneInput = PhoneInputModule.default || PhoneInputModule;

function Employees() {
  const [search, setSeacrh] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const [employee, setEmployee] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showform, setShowform] = useState(false);

  const [empname, setempName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [employeestatus, setemployeeStatus] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");

  const [phoneCountry, setPhoneCountry] = useState({
    countryCode: "in",
    dialCode: "91",
  });

  // ================= TOKEN =================

  function getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    };
  }

  // ================= GET EMPLOYEES + ASSETS =================

  useEffect(function () {
    fetch("http://localhost:5000/api/employees", {
      method: "GET",
      headers: getAuthHeaders(),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        return response.json();
      })
      .then(function (data) {
        setEmployee(data);
      })
      .catch(function (error) {
        console.log("Error fetching employees:", error);
      });

    fetch("http://localhost:5000/api/assets", {
      method: "GET",
      headers: getAuthHeaders(),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }

        return response.json();
      })
      .then(function (data) {
        setAssets(data);
      })
      .catch(function (error) {
        console.log("Error fetching assets:", error);
      });
  }, []);

  // ================= ASSIGNED ASSETS =================

  function getAssignedAssets(employeeId) {
    return assets.filter(function (assetItem) {
      return assetItem.assignedTo && assetItem.assignedTo._id === employeeId;
    });
  }

  // ================= SEARCH =================

  const filteredEmployee = employee.filter(function (item) {
    return (
      String(item.employeeId).toLowerCase().includes(search.toLowerCase()) ||
      String(item.employeeName).toLowerCase().includes(search.toLowerCase()) ||
      String(item.department).toLowerCase().includes(search.toLowerCase())
    );
  });

  // ================= HIGHLIGHT SEARCH =================

  function highlightText(text) {
    if (!search) {
      return text;
    }

    const parts = text.split(new RegExp("(" + search + ")", "gi"));

    return parts.map(function (part, index) {
      if (part.toLowerCase() === search.toLowerCase()) {
        return <mark key={index}>{part}</mark>;
      }

      return part;
    });
  }

  // ================= SAVE EMPLOYEE =================

  function handleSaveEmployee() {
    // ================= PHONE VALIDATION =================

    if (!phoneno) {
      alert("Please enter phone number");
      return;
    }

    let cleanPhoneNumber = phoneno.replace(/\s/g, "");

    // Agar "+" missing hai
    if (!cleanPhoneNumber.startsWith("+")) {
      cleanPhoneNumber = "+" + phoneCountry.dialCode + cleanPhoneNumber;
    }

    if (!isValidPhoneNumber(cleanPhoneNumber)) {
      alert(
        "Please enter a valid phone number according to the selected country",
      );

      return;
    }

    // ================= UPDATE =================

    if (editingItem) {
      fetch("http://localhost:5000/api/employees/" + editingItem.id, {
        method: "PUT",

        headers: getAuthHeaders(),

        body: JSON.stringify({
          employeeName: empname,

          department: department,

          email: email,

          phone: phoneno,

          employeestatus: employeestatus,
        }),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message);
            });
          }

          return response.json();
        })
        .then(function (updatedEmployee) {
          setEmployee(function (currentEmployees) {
            return currentEmployees.map(function (employeeItem) {
              if (employeeItem.id === updatedEmployee.id) {
                return updatedEmployee;
              }

              return employeeItem;
            });
          });

          setShowform(false);
          setEditingItem(null);

          setempName("");
          setDepartment("");
          setEmail("");
          setPhoneno("");
          setemployeeStatus("");
        })
        .catch(function (error) {
          console.log("Error updating employee:", error);

          alert(error.message);
        });
    } else {
      // ================= CREATE =================

      const newEmployee = {
        employeeName: empname,

        department: department,

        email: email,

        phone: phoneno,

        password: password,

        employeestatus: employeestatus,
      };

      fetch("http://localhost:5000/api/employees", {
        method: "POST",

        headers: getAuthHeaders(),

        body: JSON.stringify(newEmployee),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message);
            });
          }

          return response.json();
        })
        .then(function (createdEmployee) {
          setEmployee(function (currentEmployees) {
            return [...currentEmployees, createdEmployee];
          });

          setShowform(false);
          setEditingItem(null);

          setempName("");
          setDepartment("");
          setEmail("");
          setPhoneno("");
          setemployeeStatus("");
          setPassword("");
        })
        .catch(function (error) {
          console.log("Error creating employee:", error);

          alert(error.message);
        });
    }
  }

  // ================= JSX =================

  return (
    <div className="employees">
      <div className="employees-header">
        <div className="employees-action">
          <h1>
            <BsFillPeopleFill />
            Employees
          </h1>

          <div className="employees-action-btn">
            <div className="search-box">
              <MdManageSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search by ID/Name/Department_____"
                value={search}
                onChange={function (x) {
                  setSeacrh(x.target.value);
                }}
              />
            </div>

            <button
              onClick={function () {
                setShowform(true);
              }}
            >
              <FaPlus />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="table-container">
        <table className="employees-tabel">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Assigned Assets</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployee.map(function (item) {
              const assignedAssets = getAssignedAssets(item._id);

              return (
                <tr key={item.id}>
                  <td>{highlightText(String(item.employeeId))}</td>

                  <td>{highlightText(item.employeeName)}</td>

                  <td>{highlightText(item.department)}</td>

                  <td>{item.email}</td>

                  <td>{item.phone}</td>

                  <td>
                    {assignedAssets.length > 0
                      ? assignedAssets
                          .map(function (assetItem) {
                            return assetItem.assetName;
                          })
                          .join(", ")
                      : "Not Assigned"}
                  </td>

                  <td>
                    <div className="action-buttons">
                      {/* VIEW */}

                      <button
                        className="view-btn"
                        onClick={function () {
                          setSelectedItem(item);
                        }}
                      >
                        View
                      </button>

                      {/* DELETE */}

                      <button
                        className="delete-btn"
                        onClick={function () {
                          fetch(
                            "http://localhost:5000/api/employees/" + item.id,
                            {
                              method: "DELETE",

                              headers: getAuthHeaders(),
                            },
                          )
                            .then(function (response) {
                              if (!response.ok) {
                                return response
                                  .json()
                                  .then(function (errorData) {
                                    throw new Error(errorData.message);
                                  });
                              }

                              return response.json();
                            })
                            .then(function () {
                              setEmployee(function (currentEmployees) {
                                return currentEmployees.filter(
                                  function (employeeItem) {
                                    return employeeItem.id !== item.id;
                                  },
                                );
                              });

                              setAssets(function (currentAssets) {
                                return currentAssets.map(function (assetItem) {
                                  if (
                                    assetItem.assignedTo &&
                                    assetItem.assignedTo._id === item._id
                                  ) {
                                    return {
                                      ...assetItem,

                                      assignedTo: null,

                                      status:
                                        assetItem.status === "Assigned"
                                          ? "Available"
                                          : assetItem.status,
                                    };
                                  }

                                  return assetItem;
                                });
                              });
                            })
                            .catch(function (error) {
                              console.log("Error deleting employee:", error);

                              alert(error.message);
                            });
                        }}
                      >
                        Delete
                      </button>

                      {/* UPDATE */}

                      <button
                        className="update-btn"
                        onClick={function () {
                          setEditingItem(item);

                          setempName(item.employeeName);

                          setDepartment(item.department);

                          setEmail(item.email);

                          setPhoneno(item.phone || "");

                          setemployeeStatus(item.employeestatus);

                          setPassword("");

                          setShowform(true);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ================= VIEW ================= */}

        {selecteditem && (
          <div className="view-overlay">
            <div className="view-form">
              <button
                className="close-btn"
                onClick={function () {
                  setSelectedItem(null);
                }}
              >
                ×
              </button>

              <h2>Employee Details</h2>

              <p>
                <strong>Employee ID:</strong> {selecteditem.employeeId}
              </p>

              <p>
                <strong>Employee Name:</strong> {selecteditem.employeeName}
              </p>

              <p>
                <strong>Department:</strong> {selecteditem.department}
              </p>

              <p>
                <strong>Email:</strong> {selecteditem.email}
              </p>

              <p>
                <strong>Phone No. :</strong> {selecteditem.phone}
              </p>

              <p>
                <strong>Employee Status:</strong> {selecteditem.employeestatus}
              </p>

              <p>
                <strong>Assigned Assets :</strong>{" "}
                {getAssignedAssets(selecteditem._id).length > 0
                  ? getAssignedAssets(selecteditem._id)
                      .map(function (assetItem) {
                        return assetItem.assetName;
                      })
                      .join(", ")
                  : "Not Assigned"}
              </p>

              <button
                onClick={function () {
                  setSelectedItem(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= ADD / UPDATE FORM ================= */}

      {showform && (
        <div className="employee-overlay">
          <div className="employee-form">
            <button
              className="close-btn"
              onClick={function () {
                setShowform(false);
                setEditingItem(null);

                setempName("");
                setDepartment("");
                setEmail("");
                setPhoneno("");
                setemployeeStatus("");
              }}
            >
              ×
            </button>

            <h2>{editingItem ? "Update details" : "Add Employee"}</h2>

            <div className="form-field">
              <label>Employee Name</label>

              <input
                type="text"
                placeholder="Employee Name"
                value={empname}
                onChange={function (x) {
                  setempName(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Department</label>

              <select
                className={department === "" ? "placeholder" : ""}
                value={department}
                onChange={function (x) {
                  setDepartment(x.target.value);
                }}
              >
                <option value="" disabled hidden>
                  Department
                </option>

                <option value="it">IT</option>

                <option value="hr">HR</option>

                <option value="finance">Finance</option>

                <option value="sales">Sales</option>

                <option value="marketing">Marketing</option>

                <option value="operation">Operations</option>

                <option value="administration">Administration</option>

                <option value="customer-support">Customer Support</option>

                <option value="procurement">Procurement</option>

                <option value="management">Management</option>
              </select>
            </div>

            <div className="form-field">
              <label>E-mail ID</label>

              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={function (x) {
                  setEmail(x.target.value);
                }}
              />
            </div>
            {!editingItem && (
              <div className="form-field">
                <label>Initial Password</label>

                <input
                  type="password"
                  placeholder="Enter initial password"
                  value={password}
                  onChange={function (x) {
                    setPassword(x.target.value);
                  }}
                />
              </div>
            )}

            <div className="form-field">
              <label>Phone No.</label>

              <PhoneInput
                country={"in"}
                value={phoneno.replace(/\D/g, "")}
                onChange={function (phone, country) {
                  if (!phone) {
                    setPhoneno("");

                    return;
                  }

                  setPhoneCountry({
                    countryCode: country.countryCode,

                    dialCode: country.dialCode,
                  });

                  const dialCode = country.dialCode;

                  const localNumber = phone.substring(dialCode.length);

                  setPhoneno("+" + dialCode + " " + localNumber);
                }}
                enableSearch={true}
                countryCodeEditable={false}
              />
            </div>

            <div className="form-field">
              <label>Employee Status</label>

              <select
                value={employeestatus}
                onChange={function (x) {
                  setemployeeStatus(x.target.value);
                }}
              >
                <option value="">---Select Status---</option>

                <option value="Active">Active</option>

                <option value="Inactive">In-Active</option>

                <option value="ON-leave">On-leave</option>

                <option value="probation">Probation(Training)</option>

                <option value="Notice Period">Notice Period</option>
              </select>
            </div>

            <div className="employee-form-buttons">
              <button
                className="cancel"
                onClick={function () {
                  setShowform(false);
                  setEditingItem(null);

                  setempName("");
                  setDepartment("");
                  setEmail("");
                  setPhoneno("");
                  setemployeeStatus("");
                  setPassword("");
                }}
              >
                Cancel
              </button>

              <button className="update-add" onClick={handleSaveEmployee}>
                {editingItem ? "Update Employee" : "Save Employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
