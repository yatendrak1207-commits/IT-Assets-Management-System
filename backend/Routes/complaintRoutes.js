const express = require("express");
const router = express.Router();
const Complaint = require("../Models/Complain");
const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");

// ================= GET =================
router.get("/", function (req, res) {

  Complaint.find()
    .populate("employee")
    .populate("asset")
    .then(function (complaints) {
      res.json(complaints);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to fetch complaints",
        error: error
      });
    });

});


// ================= POST =================
router.post("/", async function (req, res) {

  const {
    id,
    employee,
    asset,
    complaint,
    complaintDate,
    status
  } = req.body;

  if (
    id === undefined ||
    !employee ||
    !asset ||
    !complaint ||
    !complaintDate
  ) {
    return res.status(400).json({
      message: "All complaint fields are required"
    });
  }

  const employeeDoc = await Employee.findById(employee);
  if (!employeeDoc) {
    return res.status(404).json({
      message: "Employee not found"
    });
  }

  const assetDoc = await Asset.findById(asset);
  if (!assetDoc) {
    return res.status(404).json({
      message: "Asset not found"
    });
  }

  const existing = await Complaint.findOne({ id: id });
  if (existing) {
    return res.status(409).json({
      message: "id already exists"
    });
  }

  const newComplaint = new Complaint({
    id,
    employee,
    asset,
    complaint,
    complaintDate,
    status: status || "Pending"
  });

  newComplaint.save()
    .then(async function (savedComplaint) {
      const populated = await savedComplaint.populate(["employee", "asset"]);
      res.status(201).json(populated);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to create complaint",
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

    const complaint = await Complaint.findOne({ id: id });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    if (req.body.employee !== undefined) {
      const employeeDoc = await Employee.findById(req.body.employee);
      if (!employeeDoc) {
        return res.status(404).json({ message: "Employee not found" });
      }
      complaint.employee = req.body.employee;
    }

    if (req.body.asset !== undefined) {
      const assetDoc = await Asset.findById(req.body.asset);
      if (!assetDoc) {
        return res.status(404).json({ message: "Asset not found" });
      }
      complaint.asset = req.body.asset;
    }

    if (req.body.complaint !== undefined) {
      complaint.complaint = req.body.complaint;
    }

    if (req.body.complaintDate !== undefined) {
      complaint.complaintDate = req.body.complaintDate;
    }

    if (req.body.status !== undefined) {
      complaint.status = req.body.status;
    }

    const updated = await complaint.save();
    const populated = await updated.populate(["employee", "asset"]);
    res.json(populated);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update complaint",
      error: error
    });
  }

});


// ================= DELETE =================
router.delete("/:id", function (req, res) {

  const id = Number(req.params.id);

  Complaint.findOne({ id: id })
    .then(function (complaint) {

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      return complaint.deleteOne();
    })
    .then(function () {
      res.json({ message: "Complaint deleted successfully" });
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to delete complaint",
        error: error
      });
    });

});

module.exports = router;