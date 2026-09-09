const express = require("express");
const router = express.Router();

const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");


// ================= GET =================
router.get("/", async function (req, res) {

    try {

        const assets = await Asset.find().populate("assignedTo");

        res.json(assets);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch assets",
            error: error
        });

    }

});


// ================= POST =================
router.post("/", async function (req, res) {

    try {

        const {
            id,
            assetName,
            category,
            assignedTo,
            status
        } = req.body;


        // Required fields
        if (
            id === undefined ||
            !assetName ||
            !category ||
            !status
        ) {

            return res.status(400).json({
                message: "All required fields are required"
            });

        }


        // ID validation
        if (typeof id !== "number") {

            return res.status(400).json({
                message: "ID must be a number"
            });

        }


        // Status validation
        const allowedStatus = [
            "Available",
            "Assigned",
            "Repair"
        ];

        if (!allowedStatus.includes(status)) {

            return res.status(400).json({
                message: "Invalid asset status"
            });

        }


        // Check employee
        if (assignedTo) {

            const employee = await Employee.findById(assignedTo);

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

        }


        // Duplicate id
        const existingId = await Asset.findOne({
            id: id
        });

        if (existingId) {

            return res.status(409).json({
                message: "ID already exists"
            });

        }


        // ================= AUTO ASSET ID =================

        const totalAssets = await Asset.countDocuments();

        const nextNumber = totalAssets + 1;

        const assetId = "AST" + String(nextNumber).padStart(3, "0");


        // Create asset
        const newAsset = new Asset({

            id: id,

            assetId: assetId,

            assetName: assetName,

            category: category,

            assignedTo: assignedTo || null,

            status: status

        });


        const asset = await newAsset.save();

        const populatedAsset = await asset.populate("assignedTo");

        res.status(201).json(populatedAsset);


    } catch (error) {

        res.status(500).json({
            message: "Failed to create asset",
            error: error
        });

    }

});


// ================= PUT =================
router.put("/:id", async function (req, res) {

    try {

        const id = Number(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({
                message: "Invalid asset ID"
            });

        }


        const asset = await Asset.findOne({
            id: id
        });


        if (!asset) {

            return res.status(404).json({
                message: "Asset not found"
            });

        }


        const {
            assetName,
            category,
            assignedTo,
            status
        } = req.body;


        // Check employee when assigning asset
        if (assignedTo) {

            const employee = await Employee.findById(assignedTo);

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

        }


        // Update fields
        if (assetName !== undefined) {

            asset.assetName = assetName;

        }


        if (category !== undefined) {

            asset.category = category;

        }


        if (assignedTo !== undefined) {

            asset.assignedTo = assignedTo || null;

        }


        if (status !== undefined) {

            const allowedStatus = [
                "Available",
                "Assigned",
                "Repair"
            ];

            if (!allowedStatus.includes(status)) {

                return res.status(400).json({
                    message: "Invalid asset status"
                });

            }

            asset.status = status;

        }


        const updatedAsset = await asset.save();

        const populatedAsset = await updatedAsset.populate("assignedTo");

        res.json(populatedAsset);


    } catch (error) {

        res.status(500).json({
            message: "Failed to update asset",
            error: error
        });

    }

});


// ================= DELETE =================
router.delete("/:id", async function (req, res) {

    try {

        const id = Number(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({
                message: "Invalid asset ID"
            });

        }


        const asset = await Asset.findOne({
            id: id
        });


        if (!asset) {

            return res.status(404).json({
                message: "Asset not found"
            });

        }


        await asset.deleteOne();


        res.json({
            message: "Asset deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: "Failed to delete asset",
            error: error
        });

    }

});


module.exports = router;