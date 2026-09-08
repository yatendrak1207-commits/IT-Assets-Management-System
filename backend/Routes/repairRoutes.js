const express = require("express");
const router = express.Router();
const Repair = require("../Models/Repair");
const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");

// ================= GET =================
router.get("/", function (req, res) {

  Repair.find()
    .populate("asset")
    .populate("employee")
    .then(function (repair) {
      res.json(repair);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to fetch repair data",
        error: error
      });
    });

});


// ================= POST =================
router.post("/", async function (req, res) {

  const {
    id,
    repairId,
    assetName,
    employeeName,
    complaint,
    complaintDate,
    status
  } = req.body;

  // Required fields check
  if (
    id === undefined ||
    repairId === undefined ||
    !assetName ||
    !employeeName||
    !complaint ||
    !complaintDate ||
    !status
  ) {
    return res.status(400).json({
      message: "All repairs fields are required"
    });
  }

  // Number validation
  if (typeof id !== "number" || typeof repairId !== "number") {
    return res.status(400).json({
      message: "id and repairId must be numbers"
    });
  }

  // Date format validation
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(complaintDate)) {
    return res.status(400).json({
      message: "Complaint date must be in YYYY-MM-DD format"
    });
  }

  // Actual date validation
  const dateParts = complaintDate.split("-");

  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return res.status(400).json({
      message: "Invalid complaint date"
    });
  }

  // Status Validation
  const allowedStatus = [
    "Pending",
    "In Progress",
    "Completed",
    "Cancelled"
  ];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid repair status"
    });
  }

  // Asset reference validation
 const assetDoc = await Asset.findOne({ assetName: assetName });

if (!assetDoc) {
  return res.status(404).json({
    message: "Asset not found"
  });
}

  // Employee reference validation
 const employeeDoc = await Employee.findOne({ employeeName: employeeName });

if (!employeeDoc) {
  return res.status(404).json({
    message: "Employee not found"
  });
}

  // Duplicate validation
  const existingrepair = await Repair.findOne({
    $or: [
      { id: id },
      { repairId: repairId }
    ]
  });

  if (existingrepair) {
    return res.status(409).json({
      message: "id or repairId already exists"
    });
  }

  const newRepair = new Repair({
    id,
    repairId,
    asset:assetDoc._id,
    employee:employeeDoc._id,
    complaint,
    complaintDate,
    status
  });

  newRepair.save()
    .then(async function (repair) {
      const populated = await repair.populate(["asset", "employee"]);
      res.status(201).json(populated);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to create repair data",
        error: error
      });
    });

});


// ================= PUT =================
router.put("/:id", async function (req, res) {

  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: "id must be a number"
    });
  }

  try {

    const repair = await Repair.findOne({ id: id });

    if (!repair) {
      return res.status(404).json({
        message: "Repair not found"
      });
    }

    if (req.body.repairId !== undefined) {
      repair.repairId = req.body.repairId;
    }

    // Asset reference
    if (req.body.asset !== undefined) {

      const assetDoc = await Asset.findById(req.body.asset);

      if (!assetDoc) {
        return res.status(404).json({
          message: "Asset not found"
        });
      }

      repair.asset = req.body.asset;
    }

    // Asset Name update
    if (req.body.assetName !== undefined) {

      const assetDoc = await Asset.findById(repair.asset);

      if (!assetDoc) {
        return res.status(404).json({
          message: "Asset not found"
        });
      }

      assetDoc.assetName = req.body.assetName;

      await assetDoc.save();
    }

    // Employee reference
    if (req.body.employee !== undefined) {

      const employeeDoc = await Employee.findById(req.body.employee);

      if (!employeeDoc) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      repair.employee = req.body.employee;
    }
    // Employee Name update
if (req.body.employeeName !== undefined) {

  const employeeDoc = await Employee.findById(repair.employee);

  if (!employeeDoc) {
    return res.status(404).json({
      message: "Employee not found"
    });
  }

  employeeDoc.employeeName = req.body.employeeName;

  await employeeDoc.save();
}

    if (req.body.complaint !== undefined) {
      repair.complaint = req.body.complaint;
    }

    if (req.body.complaintDate !== undefined) {

      const datePattern = /^\d{4}-\d{2}-\d{2}$/;

      if (!datePattern.test(req.body.complaintDate)) {
        return res.status(400).json({
          message: "Complaint date must be in YYYY-MM-DD format"
        });
      }

      const dateParts = req.body.complaintDate.split("-");

      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);

      const date = new Date(year, month - 1, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return res.status(400).json({
          message: "Invalid complaint date"
        });
      }

      repair.complaintDate = req.body.complaintDate;
    }

    if (req.body.status !== undefined) {

      const allowedStatus = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled"
      ];

      if (!allowedStatus.includes(req.body.status)) {
        return res.status(400).json({
          message: "Invalid repair status"
        });
      }

      repair.status = req.body.status;
    }

    const updatedRepair = await repair.save();

    const populated = await updatedRepair.populate([
      "asset",
      "employee"
    ]);

    res.json(populated);

  } catch (error) {

    res.status(500).json({
      message: "Failed to update repair",
      error: error
    });

  }

});

// ================= DELETE =================
router.delete("/:id", function (req, res) {

  const id = Number(req.params.id);

  Repair.findOne({ id: id })
    .then(function (repair) {

      if (!repair) {
        return res.status(404).json({
          message: "Repair not found"
        });
      }

      return repair.deleteOne();

    })
    .then(function () {

      res.json({
        message: "Repair deleted successfully"
      });

    })
    .catch(function (error) {

      res.status(500).json({
        message: "Failed to delete repair",
        error: error
      });

    });

});


// ================= EXPORT =================
module.exports = router;