import React from "react";
import "./Suppiler.css";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";
import PhoneInputModule from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import API_URL from "../../config/api";

const PhoneInput = PhoneInputModule.default || PhoneInputModule;

function Suppiler() {
  const [search, setSeacrh] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const [supplier, setsupplier] = useState([]);

  const [showform, setShowform] = useState(false);
  const [suppliername, setSuppliername] = useState("");
  const [company, setcompany] = useState("");
  const [contactno, setContactno] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [assetsSupplied, setAssetsSupplied] = useState("");
  const [supplierStatus, setSupplierStatus] = useState("");
  const [deleteSupplier, setDeleteSupplier] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(function () {
    fetch(`${API_URL}/api/suppliers`)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        return response.json();
      })
      .then(function (data) {
        setsupplier(data);
      })
      .catch(function (error) {
        console.log("Error fetching employees:", error);
      });
  }, []);

  const filteredsupplier = supplier.filter(function (item) {
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

  function handleSaveSupplier() {
    if (!contactno) {
      alert("Please enter contact number");
      return;
    }

    const fullPhoneNumber = contactno.replace(/\s/g, "");

    if (!isValidPhoneNumber(fullPhoneNumber)) {
      alert(
        "Please enter a valid contact number according to the selected country",
      );
      return;
    }

    if (editingItem) {
      fetch(`${API_URL}/api/suppliers/` + editingItem.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierName: suppliername,
          companyName: company,
          companyContactNumber: contactno,
          companyEmail: companyEmail,
          companyAddress: companyAddress,
          assetsSupplied: assetsSupplied,
          supplierStatus: supplierStatus,
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
        .then(function (updatedSupplier) {
          setsupplier(function (currentSuppliers) {
            return currentSuppliers.map(function (supplierItem) {
              if (supplierItem.id === updatedSupplier.id) {
                return updatedSupplier;
              }

              return supplierItem;
            });
          });

          setShowform(false);
          setEditingItem(null);

          setSuppliername("");
          setcompany("");
          setContactno("");
          setCompanyEmail("");
          setCompanyAddress("");
          setAssetsSupplied("");
          setSupplierStatus("");

          setSuccessMessage("Supplier details successfully updated");
          setTimeout(function () {
            setSuccessMessage("");
          }, 2500);
        })
        .catch(function (error) {
          console.log("Error updating supplier:", error);
        });
    } else {
      const newSupplier = {
        id: Date.now(),
        supplierName: suppliername,
        companyName: company,
        companyContactNumber: contactno,
        companyEmail: companyEmail,
        companyAddress: companyAddress,
        assetsSupplied: assetsSupplied,
        supplierStatus: supplierStatus,
      };

      fetch(`${API_URL}/api/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSupplier),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errorData) {
              throw new Error(errorData.message);
            });
          }

          return response.json();
        })
        .then(function (createdSupplier) {
          setsupplier(function (currentSuppliers) {
            return [...currentSuppliers, createdSupplier];
          });

          setShowform(false);
          setEditingItem(null);

          setSuppliername("");
          setcompany("");
          setContactno("");
          setCompanyEmail("");
          setCompanyAddress("");
          setAssetsSupplied("");
          setSupplierStatus("");
        })
        .catch(function (error) {
          console.log("Error creating supplier:", error);
        });
    }
  }

  return (
    <div className="suppiler">
      <div className="suppiler-header">
        <div className="suppiler-action">
          <h1>
            <FaTruck />
            Supplier
          </h1>

          <div className="supplier-action-btn">
            <div className="search-box">
              <MdManageSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search by Company/Supplier_____"
                value={search}
                onChange={function (x) {
                  setSeacrh(x.target.value);
                }}
              />
            </div>

            <button
              onClick={function () {
                setShowform(true);
              }}
            >
              <FaPlus />
              Add supplier
            </button>
          </div>
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
              <th>Status</th>
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
                    <span
                      className={`status-badge ${item.supplierStatus
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {item.supplierStatus || "-"}
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
                        className="update-btn"
                        onClick={function () {
                          setEditingItem(item);

                          setSuppliername(item.supplierName);
                          setcompany(item.companyName);
                          setContactno(item.companyContactNumber);
                          setCompanyEmail(item.companyEmail);
                          setCompanyAddress(item.companyAddress);
                          setAssetsSupplied(item.assetsSupplied);
                          setSupplierStatus(item.supplierStatus);

                          setShowform(true);
                        }}
                      >
                        Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={function () {
                          setDeleteSupplier(item);
                        }}
                      >
                        Delete
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
                <strong>Supplier ID:</strong> {selecteditem.supplierId}
              </p>

              <p>
                <strong>Supplier Name:</strong> {selecteditem.supplierName}
              </p>

              <p>
                <strong>Company Name:</strong> {selecteditem.companyName}
              </p>

              <p>
                <strong>Company Email:</strong> {selecteditem.companyEmail}
              </p>

              <p>
                <strong>Company phone No. :</strong>{" "}
                {selecteditem.companyContactNumber}
              </p>

              <p>
                <strong>Company Address :</strong> {selecteditem.companyAddress}
              </p>

              <p>
                <strong>Assets Supplied:</strong> {selecteditem.assetsSupplied}
              </p>

              {/* =================================================
                      SUPPLIED ASSETS DROPDOWN
                  ================================================= */}

              <details className="supplied-assets-dropdown">
                <summary className="supplied-assets-summary">
                  <div className="supplied-assets-title">
                    <strong>Assets Supplied:</strong>
                  </div>

                  <div className="supplied-assets-total">
                    {selecteditem.suppliedAssetsCount || 0}
                  </div>
                </summary>

                <div className="supplied-assets-content">
                  {selecteditem.suppliedAssetsSummary &&
                  selecteditem.suppliedAssetsSummary.length > 0 ? (
                    <div className="supplied-assets-list">
                      {selecteditem.suppliedAssetsSummary.map(function (asset) {
                        return (
                          <div
                            className="supplied-assets-row"
                            key={asset.assetName}
                          >
                            <span className="supplied-asset-name">
                              {asset.assetName}
                            </span>

                            <span className="supplied-asset-quantity">
                              {asset.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="no-supplied-assets">
                      No assets supplied by this supplier
                    </div>
                  )}
                </div>
              </details>

              <p>
                <strong>Supplier Status:</strong> {selecteditem.supplierStatus}
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
        <div className="supplier-overlay">
          <div className="supplier-form">
            <button
              className="close-btn"
              onClick={function () {
                setShowform(false);
                setEditingItem(null);

                setSuppliername("");
                setcompany("");
                setContactno("");
                setCompanyEmail("");
                setCompanyAddress("");
                setAssetsSupplied("");
                setSupplierStatus("");
              }}
            >
              ×
            </button>

            <h2>{editingItem ? "Update Supplier" : "Add supplier"}</h2>

            <div className="form-field">
              <label>Supplier Name</label>

              <input
                type="text"
                placeholder="Supplier Name"
                value={suppliername}
                onChange={function (x) {
                  setSuppliername(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Company Name</label>

              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={function (x) {
                  setcompany(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Contact No.</label>

              <PhoneInput
                country={"in"}
                value={contactno.replace(/\D/g, "")}
                onChange={function (phone, country) {
                  if (!phone) {
                    setContactno("");
                    return;
                  }

                  const dialCode = country.dialCode;
                  const localNumber = phone.substring(dialCode.length);

                  setContactno("+" + dialCode + " " + localNumber);
                }}
                enableSearch={true}
                countryCodeEditable={false}
              />
            </div>

            <div className="form-field">
              <label>Company Email</label>

              <input
                type="email"
                placeholder="Company Email"
                value={companyEmail}
                onChange={function (x) {
                  setCompanyEmail(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Company Address</label>

              <input
                type="text"
                placeholder="Company Address"
                value={companyAddress}
                onChange={function (x) {
                  setCompanyAddress(x.target.value);
                }}
              />
            </div>

            <div className="form-field">
              <label>Assets Supplied</label>

              <select
                value={assetsSupplied}
                onChange={function (x) {
                  setAssetsSupplied(x.target.value);
                }}
              >
                <option value="" disabled>
                  ----Select Asset----
                </option>

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
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
                <option value="Headset">Headset</option>
                <option value="Webcam">Webcam</option>
              </select>
            </div>

            <div className="form-field">
              <label>Supplier Status</label>

              <select
                value={supplierStatus}
                onChange={function (x) {
                  setSupplierStatus(x.target.value);
                }}
              >
                <option value="" disabled>
                  Select Status
                </option>

                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On-hold">On Hold</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
            </div>

            <div className="supplier-form-buttons">
              <button
                className="cancel"
                onClick={function () {
                  setShowform(false);
                  setEditingItem(null);

                  setSuppliername("");
                  setcompany("");
                  setContactno("");
                  setCompanyEmail("");
                  setCompanyAddress("");
                  setAssetsSupplied("");
                  setSupplierStatus("");
                }}
              >
                Cancel
              </button>

              <button className="update-add" onClick={handleSaveSupplier}>
                {editingItem ? "Update Supplier" : "Save Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteSupplier && (
        <div className="delete-overlay">
          <div className="delete-confirm-box">
            <h2>Confirm Delete</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteSupplier.supplierName}</strong>?
            </p>

            <div className="delete-confirm-buttons">
              <button
                className="delete-cancel-btn"
                onClick={function () {
                  setDeleteSupplier(null);
                }}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-btn"
                onClick={function () {
                  fetch(`${API_URL}/api/suppliers/` + deleteSupplier.id, {
                    method: "DELETE",
                  })
                    .then(function (response) {
                      if (!response.ok) {
                        return response.json().then(function (errorData) {
                          throw new Error(errorData.message);
                        });
                      }

                      return response.json();
                    })
                    .then(function () {
                      setsupplier(function (currentSuppliers) {
                        return currentSuppliers.filter(function (supplierItem) {
                          return supplierItem.id !== deleteSupplier.id;
                        });
                      });

                      setDeleteSupplier(null);
                      setSuccessMessage("Supplier deleted successfully");

                      setTimeout(function () {
                        setSuccessMessage("");
                      }, 2500);
                    })
                    .catch(function (error) {
                      console.log("Error deleting supplier:", error);

                      setDeleteSupplier(null);
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

export default Suppiler;
