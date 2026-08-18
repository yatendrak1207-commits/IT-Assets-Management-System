import React from "react";
import { complaints } from "../../data/data";
import "./Employees.css";
import { useState } from "react";
import { FunnelChart } from "recharts";
function Employees() {
  const [search, setSeacrh] = useState("");
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
                      <button className="view-btn">View</button>
                      <button className="delete-btn">Delete</button>
                      <button className="update-btn">Update</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showform && (
        <div className="employee-overlay">
          <div className="employee-form">
            <h2>Add Employee</h2>

            <input
              type="text"
              placeholder="Employee ID"
              value={empid}
              onChange={function (x) {
                setEmpid(x.target.value);
              }}
            />

            <input
              type="text"
              placeholder="Employee Name"
              value={empname}
              onChange={function (x) {
                setempName(x.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={function (x) {
                setDepartment(x.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={function (x) {
                setEmail(x.target.value);
              }}
            />
            <input
              type="number"
              placeholder="Employee phone No."
              value={phoneno}
              onChange={function (x) {
                setPhoneno(x.target.value);
              }}
            />

            <div className="employee-form-buttons">
              <button
                className="cancel-btn"
                onClick={function () {
                  setShowform(false);
                }}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={function () {
                  const newemployee = {
                    id: Date.now(),
                    employeeId: empid,
                    employeeName: empname,
                    department: department,
                    email: email,
                    phone: phoneno,
                  };

                  setEmployee([...employee, newemployee]);
                  setShowform(false);

                  setEmpid("");
                  setempName("");
                  setDepartment("");
                  setEmail("");
                  setPhoneno("");
                }}
              >
                Save Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
