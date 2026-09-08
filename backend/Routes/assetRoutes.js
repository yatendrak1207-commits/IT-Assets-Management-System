const express = require("express");

const router = express.Router();
const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");

// GET
router.get("/", function (req, res) {

  Asset.find()
    .populate("assignedTo")
    .then(function (assets) {
      res.json(assets);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to fetch assets",
        error: error
      });
    });

});


// POST - Create new asset
router.post("/", async function (req, res) {

  const {
    id,
    assetId,
    assetName,
    category,
    assignedTo,
    status
  } = req.body;


  // Required fields check
  if (
    id === undefined ||
    assetId === undefined ||
    !assetName ||
    !category ||
    !status
  ) {
    return res.status(400).json({
      message: "All assets fields are required"
    });
  }


  // Number validation
  if (typeof id !== "number" || typeof assetId !== "number") {
    return res.status(400).json({
      message: "id and assetId must be numbers"
    });
  }


  // Status validation
  const allowedStatus = ["Available", "Assigned", "Repair"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }


  // Employee reference validation
  if (assignedTo) {

    const employee = await Employee.findById(assignedTo);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

  }


  // Duplicate validation
  const existingAsset = await Asset.findOne({
    $or: [
      { id: id },
      { assetId: assetId }
    ]
  });

  if (existingAsset) {
    return res.status(409).json({
      message: "id or assetId already exists"
    });
  }


  // Create asset
  const newAsset = new Asset({
    id,
    assetId,
    assetName,
    category,
    assignedTo,
    status
  });


  newAsset.save()
    .then(function (asset) {
      res.status(201).json(asset);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to create asset",
        error: error
      });
    });

});


// UPDATE
router.put("/:id", async function (req, res) {

  const id = Number(req.params.id);


  // ID validation
  if (isNaN(id)) {
    return res.status(400).json({
      message: "id must be a number"
    });
  }


  Asset.findOne({ id: id })
    .then(async function (asset) {

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found"
        });
      }


      // Asset name
      if (req.body.assetName !== undefined) {
        asset.assetName = req.body.assetName;
      }


      // Category
      if (req.body.category !== undefined) {
        asset.category = req.body.category;
      }


      // Employee reference
      if (req.body.assignedTo !== undefined) {

        if (req.body.assignedTo) {

          const employee = await Employee.findById(req.body.assignedTo);

          if (!employee) {
            return res.status(404).json({
              message: "Employee not found"
            });
          }

        }

        asset.assignedTo = req.body.assignedTo;
      }


      // Status
      if (req.body.status !== undefined) {

        const allowedStatus = ["Available", "Assigned", "Repair"];

        if (!allowedStatus.includes(req.body.status)) {
          return res.status(400).json({
            message: "Invalid status"
          });
        }

        asset.status = req.body.status;
      }


      asset.save()
        .then(function (updatedAsset) {
          res.json(updatedAsset);
        })
        .catch(function (error) {
          res.status(500).json({
            message: "Failed to update asset",
            error: error
          });
        });

    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to find asset",
        error: error
      });
    });

});


// DELETE
router.delete("/:id", function (req, res) {

  const id = Number(req.params.id);


  Asset.findOne({ id: id })
    .then(function (asset) {

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found"
        });
      }

      return asset.deleteOne();

    })
    .then(function () {

      res.json({
        message: "Asset deleted successfully"
      });

    })
    .catch(function (error) {

      res.status(500).json({
        message: "Failed to delete asset",
        error: error
      });

    });

});


module.exports = router;