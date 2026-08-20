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
                <td>{item.employeeName}</td>
                <td>{item.assetName}</td>
                <td>{item.complaint}</td>
                <td>{item.complaintDate}</td>
                <td
                  className={
                    item.status === "Open"
                      ? "Open"
                      : item.status === "In Progress"
                        ? "Progress"
                        : "Resolved"
                  }
                >
                  {item.status}
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
