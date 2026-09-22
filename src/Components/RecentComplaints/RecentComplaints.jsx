import "./RecentComplaints.css";

function RecentComplaints({ complaints }) {
  return (
    <div className="recent-complaint">
      <h2>Recent Complains</h2>

      <table className="complaint-tabel">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Assets</th>
            <th>Complains</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map(function (item) {
            return (
              <tr key={item.id}>
                <td>{item.employee ? item.employee.employeeName : "-"}</td>

                <td>{item.asset ? item.asset.assetName : "-"}</td>

                <td>{item.complaint}</td>

                <td>
                  {item.complaintDate
                    ? new Date(item.complaintDate).toLocaleDateString("en-GB")
                    : ""}
                </td>

                <td>
                  <span
                    className={`status-badge ${item.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RecentComplaints;
