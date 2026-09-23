import Card from "../../Components/Card/Card";
import "./Dashboard.css";
import RecentComplaints from "../../Components/RecentComplaints/RecentComplaints";
import { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [activeModal, setActiveModal] = useState(null); // "assets" | "employees" | "repair" | "supplier" | null

  const navigate = useNavigate();

  useEffect(function () {
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_URL}/api/assets`, { headers })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setAssets(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Asset API Error:", error);
      });

    fetch(`${API_URL}/api/employees`, { headers })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setEmployees(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Employee API Error:", error);
      });

    fetch(`${API_URL}/api/repairs`, { headers })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setRepairs(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Repair API Error:", error);
      });

    fetch(`${API_URL}/api/suppliers`, { headers })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setSuppliers(Array.isArray(data) ? data : []);
      })
      .catch(function (error) {
        console.log("Supplier API Error:", error);
      });
  }, []);

  // ================= ASSETS =================
  const totalAssets = assets.length;

  const assignedAssets = assets.filter(function (item) {
    return item.assignedTo;
  }).length;

  const availableAssets = assets.filter(function (item) {
    return !item.assignedTo && item.status !== "Repair";
  }).length;

  const repairAssets = assets.filter(function (item) {
    return item.status === "Repair";
  }).length;

  // ================= EMPLOYEES =================
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(function (item) {
    return item.employeestatus === "Active";
  }).length;

  const inactiveEmployees = employees.filter(function (item) {
    return item.employeestatus === "Inactive";
  }).length;

  // ================= REPAIRS =================
  const totalRepairs = repairs.length;

  const pendingRepairs = repairs.filter(function (item) {
    return item.status === "Pending";
  }).length;

  const inProgressRepairs = repairs.filter(function (item) {
    return item.status === "In Progress";
  }).length;

  const completedRepairs = repairs.filter(function (item) {
    return item.status === "Completed";
  }).length;

  // ================= SUPPLIERS =================
  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(function (item) {
    return item.supplierStatus === "Active";
  }).length;

  const inactiveSuppliers = suppliers.filter(function (item) {
    return item.supplierStatus === "Inactive";
  }).length;

  // ================= MAIN 4 CARDS =================
  const mainCards = [
    { key: "assets", title: "Assets", value: totalAssets },
    { key: "employees", title: "Employees", value: totalEmployees },
    { key: "repair", title: "Repair", value: totalRepairs },
    { key: "supplier", title: "Supplier", value: totalSuppliers },
  ];

  // ================= MODAL FIELDS =================
  const modalFieldsMap = {
    assets: {
      title: "Assets Breakdown",
      fields: [
        { label: "Total", value: totalAssets },
        { label: "Assigned", value: assignedAssets },
        { label: "Available", value: availableAssets },
        { label: "Repair", value: repairAssets },
      ],
    },
    employees: {
      title: "Employees Breakdown",
      fields: [
        { label: "Active", value: activeEmployees },
        { label: "Inactive", value: inactiveEmployees },
      ],
    },
    repair: {
      title: "Repairs Breakdown",
      fields: [
        { label: "Pending", value: pendingRepairs },
        { label: "In Progress", value: inProgressRepairs },
        { label: "Completed", value: completedRepairs },
      ],
    },
    supplier: {
      title: "Suppliers Breakdown",
      fields: [
        { label: "Total", value: totalSuppliers },
        { label: "Active", value: activeSuppliers },
        { label: "Inactive", value: inactiveSuppliers },
      ],
    },
  };

  return (
    <div className="dashboard">
      <h1>
        <MdOutlineDashboard />
        DashBoard
      </h1>

      {/* ================= MAIN 4 CARDS ================= */}
      <div className="card-container">
        {mainCards.map(function (card) {
          return (
            <Card
              key={card.key}
              title={card.title}
              value={card.value}
              onClick={function () {
                setActiveModal(card.key);
              }}
            />
          );
        })}
      </div>

      {/* ================= POPUP MODAL ================= */}
      {activeModal && (
        <div
          className="dashboard-modal-overlay"
          onClick={function () {
            setActiveModal(null);
          }}
        >
          <div
            className="dashboard-modal-box"
            onClick={function (event) {
              event.stopPropagation();
            }}
          >
            <div className="dashboard-modal-header">
              <h3>{modalFieldsMap[activeModal].title}</h3>

              <button
                className="dashboard-modal-close"
                onClick={function () {
                  setActiveModal(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="dashboard-modal-fields">
              {modalFieldsMap[activeModal].fields.map(function (field) {
                return (
                  <div className="dashboard-modal-field" key={field.label}>
                    <p className="field-label">{field.label}</p>
                    <p className="field-value">{field.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <RecentComplaints complaints={repairs} />

      <button
        onClick={function () {
          navigate("/assets");
        }}
      >
        View All{" "}
      </button>
    </div>
  );
}

export default Dashboard;
