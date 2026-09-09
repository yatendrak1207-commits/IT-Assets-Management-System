const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Repair = require("../Models/Repair");
const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");

// ================= GET =================

router.get("/", async function (req, res) {

    try {

        const repairs = await Repair.find()
            .populate("asset")
            .populate("employee");

        res.json(repairs);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch repairs",
            error: error
        });

    }

});

// ================= POST =================

router.post("/", async function (req, res) {

    try {

        const {
            id,
            asset,
            employee,
            complaint,
            complaintDate,
            status
        } = req.body;

        // Required fields

        if (
            id === undefined ||
            !asset ||
            !employee ||
            !complaint ||
            !complaintDate ||
            !status
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        // Internal ID validation

        if (typeof id !== "number") {

            return res.status(400).json({
                message: "ID must be a number"
            });

        }

        // ObjectId validation

        if (!mongoose.Types.ObjectId.isValid(asset)) {

            return res.status(400).json({
                message: "Invalid asset ID"
            });

        }

        if (!mongoose.Types.ObjectId.isValid(employee)) {

            return res.status(400).json({
                message: "Invalid employee ID"
            });

        }

        // Date validation

        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (!datePattern.test(complaintDate)) {

            return res.status(400).json({
                message: "Date must be in YYYY-MM-DD format"
            });

        }

        const date = new Date(complaintDate);

        if (isNaN(date.getTime())) {

            return res.status(400).json({
                message: "Invalid complaint date"
            });

        }

        // Status validation

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

        // Check asset

        const assetDoc = await Asset.findById(asset);

        if (!assetDoc) {

            return res.status(404).json({
                message: "Asset not found"
            });

        }

        // Check employee

        const employeeDoc = await Employee.findById(employee);

        if (!employeeDoc) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        // Duplicate internal ID

        const existingId = await Repair.findOne({
            id: id
        });

        if (existingId) {

            return res.status(409).json({
                message: "Internal ID already exists"
            });

        }

        // ================= AUTO REPAIR ID =================

        const lastRepair = await Repair.findOne({
            repairId: /^REP\d+$/
        }).sort({
            repairId: -1
        });

        let nextNumber = 1;

        if (lastRepair) {

            const lastNumber = Number(
                lastRepair.repairId.replace("REP", "")
            );

            nextNumber = lastNumber + 1;

        }

        const repairId =
            "REP" + String(nextNumber).padStart(3, "0");

        // ================= CREATE REPAIR =================

        const newRepair = new Repair({

            id: id,

            repairId: repairId,

            asset: asset,

            employee: employee,

            complaint: complaint,

            complaintDate: date,

            status: status

        });

        const repair = await newRepair.save();

        // Reverse sync

        const activeStatuses = [
            "Pending",
            "In Progress"
        ];

        if (activeStatuses.includes(status)) {

            assetDoc.status = "Repair";

        } else {

            assetDoc.status =
                assetDoc.assignedTo
                    ? "Assigned"
                    : "Available";

        }

        await assetDoc.save();

        const populatedRepair =
            await Repair.findById(repair._id)
                .populate("asset")
                .populate("employee");

        res.status(201).json(populatedRepair);

    } catch (error) {

        res.status(500).json({
            message: "Failed to create repair",
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
                message: "Invalid repair ID"
            });

        }

        const repair = await Repair.findOne({
            id: id
        });

        if (!repair) {

            return res.status(404).json({
                message: "Repair not found"
            });

        }

        const {
            asset,
            employee,
            complaint,
            complaintDate,
            status
        } = req.body;

        // Asset

        if (asset !== undefined) {

            if (!mongoose.Types.ObjectId.isValid(asset)) {

                return res.status(400).json({
                    message: "Invalid asset ID"
                });

            }

            const assetDoc = await Asset.findById(asset);

            if (!assetDoc) {

                return res.status(404).json({
                    message: "Asset not found"
                });

            }

            repair.asset = asset;

        }

        // Employee

        if (employee !== undefined) {

            if (!mongoose.Types.ObjectId.isValid(employee)) {

                return res.status(400).json({
                    message: "Invalid employee ID"
                });

            }

            const employeeDoc = await Employee.findById(employee);

            if (!employeeDoc) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

            repair.employee = employee;

        }

        // Complaint

        if (complaint !== undefined) {
            repair.complaint = complaint;
        }

        // Complaint date

        if (complaintDate !== undefined) {

            const datePattern = /^\d{4}-\d{2}-\d{2}$/;

            if (!datePattern.test(complaintDate)) {

                return res.status(400).json({
                    message: "Date must be in YYYY-MM-DD format"
                });

            }

            const date = new Date(complaintDate);

            if (isNaN(date.getTime())) {

                return res.status(400).json({
                    message: "Invalid complaint date"
                });

            }

            repair.complaintDate = date;

        }

        // Status

        if (status !== undefined) {

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

            repair.status = status;

        }

        // repairId intentionally NOT updated

        await repair.save();

        // Reverse sync

        const activeStatuses = [
            "Pending",
            "In Progress"
        ];

        const assetForStatus =
            await Asset.findById(repair.asset);

        if (assetForStatus) {

            if (activeStatuses.includes(repair.status)) {

                assetForStatus.status = "Repair";

            } else {

                assetForStatus.status =
                    assetForStatus.assignedTo
                        ? "Assigned"
                        : "Available";

            }

            await assetForStatus.save();

        }

        const updatedRepair =
            await Repair.findById(repair._id)
                .populate("asset")
                .populate("employee");

        res.json(updatedRepair);

    } catch (error) {

        res.status(500).json({
            message: "Failed to update repair",
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
                message: "Invalid repair ID"
            });

        }

        const repair = await Repair.findOne({
            id: id
        });

        if (!repair) {

            return res.status(404).json({
                message: "Repair not found"
            });

        }

        await repair.deleteOne();

        res.json({
            message: "Repair deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete repair",
            error: error
        });

    }

});

module.exports = router;