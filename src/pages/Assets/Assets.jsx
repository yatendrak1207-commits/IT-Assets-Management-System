import { complaints } from "../../data/data";
import "./Assets.css";

function Assets() {
  return (
    <div className="assets">
      <div className="assets-header">
        <h1>Assets</h1>
        <div className="assets-action">
          <input type="text" placeholder="Search Assets" />
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
            {complaints.map(function (item) {
              return (
                <tr key={item.id}>
                  <td>{item.assetId}</td>
                  <td>{item.assetName}</td>
                  <td>{item.category}</td>
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
