const express = require("express");
const router = express.Router();
const Repair = require("../Models/Repair");

// ================= GET =================
router.get("/", function (req, res) {

  Repair.find()
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
    assigned,
    complaint,
    complaintDate,
    status
  } = req.body;

  // Required fields check
  if (
    id === undefined ||
    repairId === undefined ||
    !assigned||
    !assetName ||
    !complaint||
    !complaintDate||
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
  assetName,
  assigned,
  complaint,
  complaintDate,
  status
});
  newRepair.save()
    .then(function (repair) {
      res.status(201).json(repair);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to create repair data",
        error: error
      });
    });

});


// ================= PUT =================
router.put("/:id", function (req, res) {

  const id = Number(req.params.id);

  Repair.findOne({ id: id })
    .then(function (repair) {

      if (!repair) {
        return res.status(404).json({
          message: "Repair not found"
        });
      }

      if (req.body.repairId !== undefined) {
        repair.repairId = req.body.repairId;
      }

      if (req.body.assetName !== undefined) {
        repair.assetName = req.body.assetName;
      }

      if (req.body.assigned !== undefined) {
        repair.assigned = req.body.assigned;
      }

      if (req.body.complaint !== undefined) {
        repair.complaint = req.body.complaint;
      }

      if (req.body.complaintDate !== undefined) {
        repair.complaintDate = req.body.complaintDate;
      }

      if (req.body.status !== undefined) {
        repair.status = req.body.status;
      }

      return repair.save();

    })
    .then(function (updatedRepair) {

      res.json(updatedRepair);

    })
    .catch(function (error) {

      res.status(500).json({
        message: "Failed to update repair",
        error: error
      });

    });

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