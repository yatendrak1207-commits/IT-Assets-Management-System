const express = require("express");
const router = express.Router();
const Supplier = require("../Models/Supplier");

// ================= GET =================
router.get("/", function (req, res) {

  Supplier.find()
    .then(function (supplier) {
      res.json(supplier);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to fetch supplier",
        error: error
      });
    });

});


// ================= POST =================
router.post("/",async function (req, res) {

    const {
    id,
    supplierId,
    supplierName,
    companyName,
    companyContactNumber,
    companyEmail,
    companyAddress,
    assetsSupplied,
    supplierStatus
  } = req.body;

  // Required fields check
  if (
    id === undefined ||
    supplierId === undefined ||
    !supplierName ||
    !companyName ||
    !companyContactNumber||
    !companyEmail||
    !companyAddress||
    !assetsSupplied||
    !supplierStatus
  ) {
    return res.status(400).json({
      message: "All supplier fields are required"
    });
  }

   // Number validation
  if (typeof id !== "number" || typeof supplierId !== "number") {
  return res.status(400).json({
    message: "id and supplierId must be numbers"
  });
}
// Phone validation
const phonePattern = /^[0-9]{10}$/;

if (!phonePattern.test(companyContactNumber)) {
  return res.status(400).json({
    message: "Phone number must be exactly 10 digits"
  });
}
// Duplicate validation
const existingsupplier = await Supplier.findOne({
  $or: [
    { id: id },
    { supplierId: supplierId }
  ]
});

if (existingsupplier) {
  return res.status(409).json({
    message: "id or supplierId already exists"
  });
}


 const newSupplier = new Supplier({
  id,
  supplierId,
  supplierName,
  companyName,
  companyContactNumber,
  companyEmail,
  companyAddress,
  assetsSupplied,
  supplierStatus

});
  newSupplier.save()
    .then(function (supplier) {
      res.status(201).json(supplier);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to create supplier",
        error: error
      });
    });

});


// ================= PUT =================
router.put("/:id", function (req, res) {

  const id = Number(req.params.id);

  
// ID validation
  if (isNaN(id)) {
    return res.status(400).json({
      message: "id must be a number"
    });
  }

  Supplier.findOne({ id: id })
    .then(function (supplier) {

      if (!supplier) {
        return res.status(404).json({
          message: "Supplier not found"
        });
      }

      if (req.body.supplierId !== undefined) {
        supplier.supplierId = req.body.supplierId;
      }

      if (req.body.supplierName !== undefined) {
        supplier.supplierName = req.body.supplierName;
      }

      if (req.body.companyName !== undefined) {
        supplier.companyName = req.body.companyName;
      }

      if (req.body.companyContactNumber !== undefined) {

        const phonePattern = /^[0-9]{10}$/;

      if (!phonePattern.test(req.body.companyContactNumber)) {
        return res.status(400).json({
          message: "Phone number must be exactly 10 digits"
        });
      }

        supplier.companyContactNumber = req.body.companyContactNumber;
      }
      if (req.body.companyEmail !== undefined) {
           supplier.companyEmail = req.body.companyEmail;
        }

        if (req.body.companyAddress !== undefined) {
          supplier.companyAddress = req.body.companyAddress;
        }

        if (req.body.assetsSupplied !== undefined) {
          supplier.assetsSupplied = req.body.assetsSupplied;
        }

        if (req.body.supplierStatus !== undefined) {
          supplier.supplierStatus = req.body.supplierStatus;
        }


      return supplier.save();

    })
    .then(function (updatedSupplier) {

      res.json(updatedSupplier);

    })
    .catch(function (error) {

      res.status(500).json({
        message: "Failed to update supplier",
        error: error
      });

    });

});


// ================= DELETE =================
router.delete("/:id", function (req, res) {

  const id = Number(req.params.id);

  Supplier.findOne({ id: id })
    .then(function (supplier) {

      if (!supplier) {
        return res.status(404).json({
          message: "Supplier not found"
        });
      }

      return supplier.deleteOne();

    })
    .then(function () {

      res.json({
        message: "Supplier deleted successfully"
      });

    })
    .catch(function (error) {

      res.status(500).json({
        message: "Failed to delete supplier",
        error: error
      });

    });

});


// ================= EXPORT =================
module.exports = router;