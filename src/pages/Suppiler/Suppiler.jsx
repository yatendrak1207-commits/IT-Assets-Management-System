import React from "react";
import "./Suppiler.css";
import { complaints } from "../../data/data";
function Suppiler() {
  return (
    <div className="suppiler">
      <div className="suppiler-header">
        <h1>Supplier</h1>
        <div className="suppiler-action">
          <input type="text" placeholder="Search Supplier" />
          <button>Add supplier</button>
        </div>
      </div>
      <div className="table-container">
        <table className="suppiler-tabel">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Company</th>
              <th>Contact No.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{item.supplierId}</td>
                  <td>{item.supplierName}</td>
                  <td>{item.companyName}</td>
                  <td>{item.companyContactNumber}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn">View</button>
                      <button className="update-btn">Update</button>
                      <button className="delete-btn">Delete</button>
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

export default Suppiler;
