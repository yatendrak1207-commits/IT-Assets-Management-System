import React from "react";
import { complaints } from "../../data/data";
import "./Employees.css";
import { useState } from "react";
import { FunnelChart } from "recharts";
function Employees() {
  const [search, setSeacrh] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const [employee, setEmployee] = useState(complaints);
  const [showform, setShowform] = useState(false);
  const [empid, setEmpid] = useState("");
  const [empname, setempName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const filteredEmployee = employee.filter(function (item) {
    return (
      item.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase())
    );
  });
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
  function handleSaveEmployee() {
    if (editingItem) {
      const updatedemployee = employee.map(function (employeeItem) {
        if (employeeItem.id === editingItem.id) {
          return {
            ...employeeItem,
            employeeId: empid,
            employeeName: empname,
            department: department,
            email: email,
            phone: phoneno,
          };
        }

        return employeeItem;
      });

      setEmployee(updatedemployee);
    } else {
      const newemployee = {
        id: Date.now(),
        employeeId: empid,
        employeeName: empname,
        department: department,
        email: email,
        phone: phoneno,
      };

      setEmployee([...employee, newemployee]);
    }

    setShowform(false);

    setEditingItem(null);

    setEmpid("");
    setempName("");
    setDepartment("");
    setEmail("");
    setPhoneno("");
  }
  return (
    <div className="employees">
      <div className="employees-header">
        <h1>Employees</h1>
        <div className="employees-action">
          <input
            type="text"
            placeholder="Search by employee Name/ID/Department"
            value={search}
            onChange={function (x) {
              setSeacrh(x.target.value);
            }}
          />
          <button
            onClick={function () {
              setShowform(true);
            }}
          >
            Add Employee
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="employees-tabel">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th> Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployee.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{highlightText(item.employeeId)}</td>
                  <td>{highlightText(item.employeeName)}</td>
                  <td>{highlightText(item.department)}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={function () {
                          setSelectedItem(item);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={function () {
                          setEmployee(
                            employee.filter(function (x) {
                              return x.id !== item.id;
                            }),
                          );
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="update-btn"
                        onClick={function () {
                          setEditingItem(item);

                          setEmpid(item.employeeId);
                          setempName(item.employeeName);
                          setDepartment(item.department);
                          setEmail(item.email);
                          setPhoneno(item.phone);

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
        {selecteditem && (
          <div className="view-overlay">
            <div className="view-form">
              <h2>Assets Details</h2>

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
                <strong>Employee Status :</strong> {selecteditem.employeeStatus}
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
      {showform && (
        <div className="employee-overlay">
          <div className="employee-form">
            <h2>{editingItem ? "Update details" : "Add Employee"}</h2>
            <div className="form-field">
              <label>Employee ID</label>
              <input
                type="text"
                placeholder="Employee ID"
                value={empid}
                onChange={function (x) {
                  setEmpid(x.target.value);
                }}
              />
            </div>
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
                value={department}
                onChange={function (x) {
                  setDepartment(x.target.value);
                }}
              >
                <option value="" disabled>
                  {" "}
                  Department
                </option>
                <option value="it">IT</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="operation">Opertions</option>
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
            <div className="form-field">
              <label>Phone No.</label>
              <input
                type="text"
                placeholder="Employee phone No."
                value={phoneno}
                onChange={function (x) {
                  setPhoneno(x.target.value);
                }}
              />
            </div>

            <div className="employee-form-buttons">
              <button
                className="cancel-btn"
                onClick={function () {
                  setShowform(false);
                  setEditingItem(null);

                  setEmpid("");
                  setempName("");
                  setDepartment("");
                  setEmail("");
                  setPhoneno("");
                }}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={handleSaveEmployee}>
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
