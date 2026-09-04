const express = require("express");

const router = express.Router();
const Asset = require("../Models/Asset");

//GET
router.get("/", function (req, res) {

  Asset.find()
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
router.post("/",  async function (req, res) {

  const {
    id,
    assetId,
    assetName,
    category,
    status

  } = req.body;

  // Required fields check
  if (
    id === undefined ||
    assetId === undefined ||
    !assetName||
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

 const newAsset = new Asset({
  id,
  assetId,
  assetName,
  category,
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
router.put("/:id", function (req, res) {
  const id = Number(req.params.id);

  Asset.findOne({ id: id })
    .then(function (asset) {

      if (!asset) {
        return res.status(404).json({
          message: "Asset not found"
        });
      }
      

      
      if (req.body.assetName !== undefined) {
         asset.assetName = req.body.name;
        }

    if (req.body.category !== undefined) {
        asset.category = req.body.category;
        }   

    if (req.body.status !== undefined) {
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
    .then(function (deletedAsset) {
      res.json({
        message: "Asset deleted successfully",
        
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