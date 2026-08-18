import React from "react";
import "./Suppiler.css";
import { complaints } from "../../data/data";
import { useState } from "react";
function Suppiler() {
  const [search, setSeacrh] = useState("");

  const filteredsupplier = complaints.filter(function (item) {
    return (
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(search.toLowerCase())
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
    <div className="suppiler">
      <div className="suppiler-header">
        <h1>Supplier</h1>
        <div className="suppiler-action">
          <input
            type="text"
            placeholder="Search by Supplier Name & Company"
            value={search}
            onChange={function (x) {
              setSeacrh(x.target.value);
            }}
          />
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
            {filteredsupplier.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{item.supplierId}</td>
                  <td>{highlightText(item.supplierName)}</td>
                  <td>{highlightText(item.companyName)}</td>
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
