import "./Assets.css";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { LuMonitorSpeaker } from "react-icons/lu";
import { MdManageSearch } from "react-icons/md";
function Assets() {
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const [asset, setAsset] = useState([]);

  useEffect(function () {
    fetch("http://localhost:5000/api/assets")
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
  }, []);
  const [showform, setShowform] = useState(false);
  const [assetid, setAssetid] = useState("");
  const [assetname, setAssetname] = useState("");
  const [category, setCategory] = useState("");
  const [assigned, setAssigned] = useState("");
  const [status, setStatus] = useState("");
  const filtereddAssets = asset.filter(function (item) {
    return (
      String(item.assetId).toLowerCase().includes(search.toLowerCase()) ||
      item.assetName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  function formatAssetId(id) {
    return "AST" + String(id).padStart(3, "0");
  }

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
  function handleSaveAsset() {
    console.log("start");
    if (editingItem) {
      fetch("http://localhost:5000/api/assets/" + editingItem.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetName: assetname,
          category: category,
          assigned: assigned,
          status: status,
        }),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message);
            });
          }

          return response.json();
        })
        .then(function (updatedAsset) {
          setAsset(function (currentAssets) {
            return currentAssets.map(function (assetItem) {
              if (assetItem.id === updatedAsset.id) {
                return updatedAsset;
              }

              return assetItem;
            });
          });

          setShowform(false);
          setEditingItem(null);
          setAssetid("");
          setAssetname("");
          setCategory("");
          setAssigned("");
          setStatus("");
        })
        .catch(function (error) {
          console.log("Error updating asset:", error);
        });
    } else {
      const newAsset = {
        id: Date.now(),
        assetId: Number(assetid),
        assetName: assetname,
        category: category,
        assigned: assigned,
        status: status,
      };
      console.log("Sending asset:", newAsset);
      fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAsset),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message);
            });
          }

          return response.json();
        })
        .then(function (createdAsset) {
          setAsset(function (currentAssets) {
            return [...currentAssets, createdAsset];
          });

          setShowform(false);
          setEditingItem(null);
          setAssetid("");
          setAssetname("");
          setCategory("");
          setAssigned("");
          setStatus("");
        })
        .catch(function (error) {
          console.log("Error creating asset:", error);
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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtereddAssets.map(function (item) {
              return (
                <tr key={item._id}>
                  <td>{highlightText(formatAssetId(item.assetId))}</td>
                  <td>{highlightText(item.assetName)}</td>
                  <td>{highlightText(item.category)}</td>
                  <td>{item.assigned}</td>
                  <td>{item.status}</td>
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
                          fetch("http://localhost:5000/api/assets/" + item.id, {
                            method: "DELETE",
                          })
                            .then(function (response) {
                              if (!response.ok) {
                                throw new Error("Failed to delete asset");
                              }

                              return response.json();
                            })
                            .then(function () {
                              setAsset(
                                asset.filter(function (assetItem) {
                                  return assetItem.id !== item.id;
                                }),
                              );
                            })
                            .catch(function (error) {
                              console.log("Error deleting asset:", error);
                            });
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="update-btn"
                        onClick={function () {
                          setEditingItem(item);

                          setAssetid(String(item.assetId));
                          setAssetname(item.assetName);
                          setCategory(item.category);
                          setAssigned(item.assigned);
                          setStatus(item.status);

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
                <strong>Assets ID:</strong>{" "}
                {formatAssetId(selecteditem.assetId)}
              </p>
              <p>
                <strong>Asset Name:</strong> {selecteditem.assetName}
              </p>
              <p>
                <strong>Category:</strong> {selecteditem.category}
              </p>
              <p>
                <strong>Assigned:</strong> {selecteditem.assigned}
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
                setShowform(false);
                setEditingItem(null);

                setAssetid("");
                setAssetname("");
                setCategory("");
                setAssigned("");
                setStatus("");
              }}
            >
              ×
            </button>
            <h2>{editingItem ? "Update Details" : "Assets Details"}</h2>
            <div className="form-field">
              <label>Assets ID</label>
              <input
                type="text"
                placeholder="Assets ID"
                value={assetid}
                onChange={function (x) {
                  setAssetid(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Assets Name</label>
              <input
                type="text"
                placeholder="Assets Name"
                value={assetname}
                onChange={function (x) {
                  setAssetname(x.target.value);
                }}
              />
            </div>
            <div className="form-field">
              <label>Category</label>
              <select
                value={category}
                onChange={function (x) {
                  setCategory(x.target.value);
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
              <label>Assigned </label>
              <input
                type="text"
                placeholder="Assigned"
                value={assigned}
                onChange={function (x) {
                  setAssigned(x.target.value);
                }}
              />
            </div>
            <div className="form-field">
              <label>Status</label>
              <select
                type="text"
                placeholder="Status"
                value={status}
                onChange={function (x) {
                  setStatus(x.target.value);
                }}
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Repair">Repair</option>
              </select>
            </div>

            <div className="asset-form-buttons">
              <button
                className="cancel"
                onClick={function () {
                  setShowform(false);
                  setEditingItem(null);

                  setAssetid("");
                  setAssetname("");
                  setCategory("");
                  setAssigned("");
                  setStatus("");
                }}
              >
                Cancel
              </button>

              <button
                className="update-add"
                onClick={function () {
                  console.log("button clicked");
                  handleSaveAsset();
                }}
              >
                {editingItem ? "Update Details" : "Assets Details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assets;
