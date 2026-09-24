import "./Assets.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { LuMonitorSpeaker } from "react-icons/lu";
import { MdManageSearch } from "react-icons/md";
import { ButtonLoader } from "../../Components/Loader/Loader";
import API_URL from "../../config/api";

function Assets() {
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const [asset, setAsset] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [deleteAsset, setDeleteAsset] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [showform, setShowform] = useState(false);
  const [assetname, setAssetname] = useState("");
  const [category, setCategory] = useState("");
  const [assigned, setAssigned] = useState("");
  const [status, setStatus] = useState("");
  const [supplier, setSupplier] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(function () {
    fetch(`${API_URL}/api/assets`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }

        return response.json();
      })
      .then(function (data) {
        setAsset(data);
      })
      .catch(function (error) {
        console.log("Error fetching assets:", error);
      });

    fetch(`${API_URL}/api/employees`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        return response.json();
      })
      .then(function (data) {
        setEmployees(data);
      })
      .catch(function (error) {
        console.log("Error fetching employees:", error);
      });

    fetch(`${API_URL}/api/suppliers`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        return response.json();
      })
      .then(function (data) {
        setSuppliers(data);
      })
      .catch(function (error) {
        console.log("Error fetching suppliers:", error);
      });
  }, []);

  const assetNamesByCategory = {
    Laptop: [
      "Dell Inspiron 15",
      "Dell Latitude 5420",
      "HP Pavilion 15",
      "HP ProBook 450",
      "Lenovo ThinkPad E14",
      "Lenovo IdeaPad 3",
      "Asus VivoBook 15",
      "Acer Aspire 5",
      "MacBook Air M2",
    ],

    Desktop: [
      "Dell OptiPlex 3090",
      "Dell Vostro Desktop",
      "HP ProDesk 400",
      "HP EliteDesk 800",
      "Lenovo ThinkCentre M70",
      "Lenovo IdeaCentre 3",
    ],

    Monitor: [
      "Dell P2422H",
      "Dell S2421HN",
      "LG 24MP400",
      "Samsung LF24T350",
      "HP M24f",
      "Acer KA242Y",
      "BenQ GW2480",
    ],

    Keyboard: [
      "Logitech K120",
      "Logitech K380",
      "HP K1500",
      "Dell KB216",
      "Lenovo Preferred Pro II",
      "Microsoft Wired Keyboard 600",
    ],

    Mouse: [
      "Logitech M90",
      "Logitech M185",
      "HP M100",
      "Dell MS116",
      "Lenovo 300 USB Mouse",
      "Microsoft Basic Optical Mouse",
    ],

    Printer: [
      "HP LaserJet Pro M404",
      "HP DeskJet 2720",
      "Canon PIXMA G3010",
      "Epson EcoTank L3250",
      "Brother DCP-T520W",
      "Xerox Phaser 3020",
    ],

    Scanner: [
      "Canon LiDE 300",
      "Canon LiDE 400",
      "Epson V39",
      "HP ScanJet Pro 2600",
      "Brother ADS-1700W",
    ],

    Projector: [
      "Epson EB-E01",
      "Epson CO-FH02",
      "BenQ MX560",
      "Sony VPL-DX221",
      "ViewSonic PA503W",
    ],

    Server: [
      "Dell PowerEdge R250",
      "Dell PowerEdge R350",
      "HP ProLiant DL360",
      "HP ProLiant DL380",
      "Lenovo ThinkSystem SR250",
      "IBM Power System S1022",
    ],

    Router: [
      "Cisco RV340",
      "TP-Link Archer C6",
      "TP-Link Archer AX10",
      "D-Link DIR-825",
      "Netgear R6700",
    ],

    Switch: [
      "Cisco CBS250",
      "TP-Link TL-SG108",
      "D-Link DGS-108",
      "Netgear GS308",
    ],

    UPS: [
      "APC Back-UPS 600VA",
      "APC Back-UPS 1100VA",
      "Microtek UPS Legend 650",
      "Luminous Eco Volt 850",
      "Numeric Digital 600",
    ],

    Mobile: [
      "iPhone 15",
      "iPhone 15 Pro",
      "Samsung Galaxy S24",
      "Samsung Galaxy A55",
      "OnePlus 12",
      "OnePlus Nord CE 4",
      "Xiaomi Redmi Note 13",
      "Realme 12 Pro",
      "Vivo V30",
      "Oppo Reno 11",
    ],

    Tablet: [
      "iPad 10th Generation",
      "iPad Air M2",
      "Samsung Galaxy Tab S9",
      "Samsung Galaxy Tab A9",
      "Lenovo Tab P12",
      "Xiaomi Pad 6",
      "Microsoft Surface Go 4",
    ],

    Headset: [
      "JBL Quantum 100",
      "JBL Tune 510BT",
      "boAt Rockerz 450",
      "Sony WH-CH520",
      "Logitech H390",
      "HyperX Cloud Stinger 2",
    ],

    Webcam: [
      "Logitech C270",
      "Logitech C920",
      "HP 320 FHD Webcam",
      "Lenovo 300 FHD Webcam",
      "Microsoft Modern Webcam",
    ],

    "External Hard Drive": [
      "Seagate Expansion 1TB",
      "Seagate Expansion 2TB",
      "Western Digital Elements 1TB",
      "Western Digital Elements 2TB",
      "Toshiba Canvio Basics 1TB",
      "Samsung T7 1TB",
    ],

    "Docking Station": [
      "Dell WD19",
      "Dell WD22TB4",
      "HP USB-C Dock G5",
      "Lenovo ThinkPad Universal Dock",
      "Anker 575 USB-C Dock",
    ],
  };

  const filtereddAssets = asset.filter(function (item) {
    return (
      String(item.assetId).toLowerCase().includes(search.toLowerCase()) ||
      item.assetName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  function highlightText(text) {
    text = String(text);

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

  function resetForm() {
    setShowform(false);
    setEditingItem(null);
    setAssetname("");
    setCategory("");
    setAssigned("");
    setStatus("");
    setSupplier("");
  }

  function handleSaveAsset() {
    if (!assetname || !category || !status) {
      alert("Please fill all required fields");
      return;
    }

    setSaving(true);

    if (editingItem) {
      fetch(`${API_URL}/api/assets/${editingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          assetName: assetname,
          category: category,
          assignedTo: assigned || null,
          status: status,
          supplier: supplier || null,
        }),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message || "Failed to update asset");
            });
          }

          return response.json();
        })
        .then(function (updatedAsset) {
          setAsset(function (currentAssets) {
            return currentAssets.map(function (assetItem) {
              if (assetItem._id === updatedAsset._id) {
                return updatedAsset;
              }

              return assetItem;
            });
          });

          resetForm();

          setSuccessMessage("Asset details successfully updated");

          setTimeout(function () {
            setSuccessMessage("");
          }, 2500);
        })
        .catch(function (error) {
          console.log("Error updating asset:", error);
          alert(error.message);
        })
        .finally(function () {
          setSaving(false);
        });
    } else {
      const newAsset = {
        assetName: assetname,
        category: category,
        assignedTo: assigned || null,
        status: status,
        supplier: supplier || null,
      };

      console.log("Sending asset:", newAsset);

      fetch(`${API_URL}/api/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAsset),
      })
        .then(function (response) {
          console.log("STATUS:", response.status);

          return response.text().then(function (text) {
            console.log("SERVER RESPONSE:", text);

            if (!response.ok) {
              throw new Error(text || "Failed to create asset");
            }

            return text ? JSON.parse(text) : {};
          });
        })
        .then(function (createdAsset) {
          console.log("CREATED ASSET:", createdAsset);

          setAsset(function (currentAssets) {
            return [...currentAssets, createdAsset];
          });

          resetForm();

          setSuccessMessage("Asset added successfully");

          setTimeout(function () {
            setSuccessMessage("");
          }, 2500);
        })
        .catch(function (error) {
          console.log("Error creating asset:", error);
          alert(error.message);
        })
        .finally(function () {
          setSaving(false);
        });
    }
  }
  return (
    <div className="assets">
      <div className="assets-header">
        <div className="assets-action">
          <h1>
            <LuMonitorSpeaker />
            Assets
          </h1>

          <div className="assets-action-btn">
            <div className="search-box">
              <MdManageSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search by ID/Name/Category______"
                value={search}
                onChange={function (x) {
                  setSearch(x.target.value);
                }}
              />
            </div>

            <button
              onClick={function () {
                setEditingItem(null);
                setAssetname("");
                setCategory("");
                setAssigned("");
                setStatus("");
                setSupplier("");
                setShowform(true);
              }}
            >
              <FaPlus />
              Add Asset
            </button>
          </div>
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
              <th>Supplier</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtereddAssets.map(function (item) {
              return (
                <tr key={item._id}>
                  <td>{highlightText(item.assetId)}</td>

                  <td>{highlightText(item.assetName)}</td>

                  <td>{highlightText(item.category)}</td>

                  <td>
                    {item.assignedTo ? item.assignedTo.employeeName : "-"}
                  </td>

                  <td>
                    {item.supplier ? item.supplier.supplierName || "-" : "-"}
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
                          setDeleteAsset(item);
                        }}
                      >
                        Delete
                      </button>

                      <button
                        className="update-btn"
                        onClick={function () {
                          setEditingItem(item);

                          setAssetname(item.assetName);
                          setCategory(item.category);

                          setAssigned(
                            item.assignedTo ? item.assignedTo._id : "",
                          );

                          setStatus(item.status);

                          setSupplier(item.supplier ? item.supplier._id : "");

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
              <button
                className="close-btn"
                onClick={function () {
                  setSelectedItem(null);
                }}
              >
                ×
              </button>

              <h2>Assets Details</h2>

              <p>
                <strong>Assets ID:</strong> {selecteditem.assetId}
              </p>

              <p>
                <strong>Asset Name:</strong> {selecteditem.assetName}
              </p>

              <p>
                <strong>Category:</strong> {selecteditem.category}
              </p>

              <p>
                <strong>Assigned:</strong>{" "}
                {selecteditem.assignedTo
                  ? selecteditem.assignedTo.employeeName
                  : "-"}
              </p>

              <p>
                <strong>Supplier:</strong>{" "}
                {selecteditem.supplier
                  ? selecteditem.supplier.supplierName || "-"
                  : "-"}
              </p>

              <p>
                <strong>Status:</strong> {selecteditem.status}
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
        <div className="asset-overlay">
          <div className="asset-form">
            <button
              className="close-btn"
              onClick={function () {
                resetForm();
              }}
            >
              ×
            </button>

            <h2>{editingItem ? "Update Details" : "Assets Details"}</h2>

            <div className="form-field">
              <label>Category</label>

              <select
                value={category}
                onChange={function (x) {
                  setCategory(x.target.value);

                  setAssetname("");
                }}
              >
                <option value="">Select Asset Category</option>

                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Monitor">Monitor</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="Printer">Printer</option>
                <option value="Scanner">Scanner</option>
                <option value="Projector">Projector</option>
                <option value="Server">Server</option>
                <option value="Router">Router</option>
                <option value="Switch">Switch</option>
                <option value="UPS">UPS</option>
                <option value="Mobile">Mobile / Smartphone</option>
                <option value="Tablet">Tablet</option>
                <option value="Headset">Headset</option>
                <option value="Webcam">Webcam</option>
                <option value="External Hard Drive">External Hard Drive</option>
                <option value="Docking Station">Docking Station</option>
              </select>
            </div>

            <div className="form-field">
              <label>Assets Name</label>

              <select
                value={assetname}
                onChange={function (x) {
                  setAssetname(x.target.value);
                }}
                disabled={!category}
              >
                <option value="">
                  {category ? "Select Asset Name" : "Select Category First"}
                </option>

                {category &&
                  assetNamesByCategory[category] &&
                  assetNamesByCategory[category].map(function (name) {
                    return (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="form-field">
              <label>Assigned</label>

              <select
                value={assigned}
                onChange={function (x) {
                  setAssigned(x.target.value);
                }}
              >
                <option value="">Select Employee</option>

                {employees.map(function (emp) {
                  return (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-field">
              <label>Supplier</label>

              <select
                value={supplier}
                onChange={function (x) {
                  setSupplier(x.target.value);
                }}
              >
                <option value="">Select Supplier</option>

                {suppliers.map(function (item) {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.supplierName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-field">
              <label>Status</label>

              <select
                value={status}
                onChange={function (x) {
                  setStatus(x.target.value);
                }}
              >
                <option value="" disabled>
                  Select Status
                </option>

                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Repair">Repair</option>
              </select>
            </div>

            <div className="asset-form-buttons">
              <button
                className="cancel"
                onClick={function () {
                  resetForm();
                }}
              >
                Cancel
              </button>

              <button
                className="update-add"
                onClick={function () {
                  handleSaveAsset();
                }}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingItem
                    ? "Update Details"
                    : "Add Asset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteAsset && (
        <div className="delete-overlay">
          <div className="delete-confirm-box">
            <h2>Confirm Delete</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteAsset.assetName}</strong>?
            </p>

            <div className="delete-confirm-buttons">
              <button
                className="delete-cancel-btn"
                onClick={function () {
                  setDeleteAsset(null);
                }}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-btn"
                onClick={function () {
                  fetch(`${API_URL}/api/assets/` + deleteAsset._id, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                  })
                    .then(function (response) {
                      if (!response.ok) {
                        throw new Error("Failed to delete asset");
                      }

                      return response.json();
                    })
                    .then(function () {
                      setAsset(function (currentAssets) {
                        return currentAssets.filter(function (assetItem) {
                          return assetItem._id !== deleteAsset._id;
                        });
                      });

                      setDeleteAsset(null);

                      setSuccessMessage("Asset deleted successfully");

                      setTimeout(function () {
                        setSuccessMessage("");
                      }, 2500);
                    })
                    .catch(function (error) {
                      console.log("Error deleting asset:", error);

                      setDeleteAsset(null);

                      alert(error.message);
                    });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>

            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assets;
