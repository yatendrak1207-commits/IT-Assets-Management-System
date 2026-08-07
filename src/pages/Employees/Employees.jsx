import React from "react";
import { complaints } from "../../data/data";
import "./Employees.css";
function Employees() {
  return (
    <div className="employees">
      <div className="employees-header">
        <h1>Employees</h1>
        <div className="employees-action">
          <input type="text" placeholder="Search Employee" />
          <button>Add Employee</button>
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
            {complaints.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{item.employeeId}</td>
                  <td>{item.employeeName}</td>
                  <td>{item.department}</td>
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
    </div>
  );
}

export default Employees;
