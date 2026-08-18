import { complaints } from "../../data/data";
import "./Assets.css";
import { useState } from "react";

function Assets() {
  const [search, setSearch] = useState("");
  const filtereddAssets = complaints.filter(function (item) {
    return (
      item.assetId.toLowerCase().includes(search.toLowerCase()) ||
      item.assetName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
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
    <div className="assets">
      <div className="assets-header">
        <h1>Assets</h1>
        <div className="assets-action">
          <input
            type="text"
            placeholder="Search by Asset Name/ID/Category"
            value={search}
            onChange={function (x) {
              setSearch(x.target.value);
            }}
          />
          <button>Add Asset</button>
        </div>
      </div>
      <div className="table-container">
        <table className="assets-tabel">
          <thead>
            <tr>
              <th>Assets ID</th>
              <th>Assets Name</th>
              <th>Category</th>
              <th>Assigned</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtereddAssets.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{highlightText(item.assetId)}</td>
                  <td>{highlightText(item.assetName)}</td>
                  <td>{highlightText(item.category)}</td>
                  <td>{item.assigned}</td>
                  <td>{item.status}</td>
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

export default Assets;
