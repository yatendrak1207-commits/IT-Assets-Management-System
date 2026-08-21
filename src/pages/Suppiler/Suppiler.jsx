import React from "react";
import "./Suppiler.css";
import { complaints } from "../../data/data";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";

function Suppiler() {
  const [search, setSeacrh] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selecteditem, setSelectedItem] = useState(null);
  const [supplier, setsupplier] = useState(complaints);
  const [showform, setShowform] = useState(false);
  const [supplierid, setSupplierid] = useState("");
  const [suppliername, setSuppliername] = useState("");
  const [company, setcompany] = useState("");
  const [contactno, setContactno] = useState("");

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
    if (editingItem) {
      const updatedSupplier = supplier.map(function (supplierItem) {
        if (supplierItem.id === editingItem.id) {
          return {
            ...supplierItem,
            supplierId: supplierid,
            supplierName: suppliername,
            companyName: company,
            companyContactNumber: contactno,
          };
        }

        return supplierItem;
      });

      setsupplier(updatedSupplier);
    } else {
      const newSupplier = {
        id: Date.now(),
        supplierId: supplierid,
        supplierName: suppliername,
        companyName: company,
        companyContactNumber: contactno,
      };

      setsupplier([...supplier, newSupplier]);
    }

    setShowform(false);
    setEditingItem(null);

    setSupplierid("");
    setSuppliername("");
    setcompany("");
    setContactno("");
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
                placeholder="Search_________"
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

                          setSupplierid(item.supplierId);
                          setSuppliername(item.supplierName);
                          setcompany(item.companyName);
                          setContactno(item.companyContactNumber);

                          setShowform(true);
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="delete-btn"
                        onClick={function () {
                          setsupplier(
                            supplier.filter(function (x) {
                              return x.id !== item.id;
                            }),
                          );
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
                <strong>Assets Supplied :</strong> {selecteditem.assetsSupplied}
              </p>
              <p>
                <strong>Supplier Status :</strong> {selecteditem.supplierStatus}
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
            <h2>{editingItem ? "Update Supplier" : "Add supplier"}</h2>

            <div className="form-field">
              <label>Supplier Id</label>
              <input
                type="text"
                placeholder="Supplier ID"
                value={supplierid}
                onChange={function (x) {
                  setSupplierid(x.target.value);
                }}
              />
            </div>

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
              <input
                type="text"
                placeholder="Contact No."
                value={contactno}
                onChange={function (x) {
                  setContactno(x.target.value);
                }}
              />
            </div>
            <div className="supplier-form-buttons">
              <button
                className="cancel"
                onClick={function () {
                  setShowform(false);
                  setEditingItem(null);

                  setSupplierid("");
                  setSuppliername("");
                  setcompany("");
                  setContactno("");
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
    </div>
  );
}

export default Suppiler;
