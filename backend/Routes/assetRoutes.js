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
router.post("/", function (req, res) {

  const newAsset = new Asset(req.body);

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

      if (req.body.name !== undefined) {
         asset.name = req.body.name;
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