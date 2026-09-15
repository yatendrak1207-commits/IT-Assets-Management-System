const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Repair = require("../Models/Repair");
const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");
const Notification = require("../Models/Notification");

const {
    authMiddleware,
    requireRole
} = require("../middleware/authMiddleware");


// =====================================================
// GET MY REPAIRS - EMPLOYEE
// =====================================================

router.get(
    "/my",
    authMiddleware,
    requireRole("user"),
    async function (req, res) {

        try {

            const employee = await Employee.findOne({
                id: req.user.id
            });

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

            const repairs = await Repair.find({
                employee: employee._id
            })
                .populate("asset")
                .populate("employee");

            res.json(repairs);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch your repair requests",
                error: error
            });

        }

    }
);


// =====================================================
// GET ALL REPAIRS - ADMIN
// =====================================================

router.get(
    "/",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

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

    }
);


// =====================================================
// POST REPAIR
// EMPLOYEE = CREATE FOR SELF
// ADMIN = CREATE FOR SELECTED EMPLOYEE
// =====================================================

router.post(
    "/",
    authMiddleware,
    async function (req, res) {

        try {

            const {
                asset,
                employee,
                complaint,
                complaintDate,
                status
            } = req.body;


            // ===============================
            // BASIC VALIDATION
            // ===============================

            if (!asset || !complaint || !complaintDate) {

                return res.status(400).json({
                    message: "Asset, complaint and date are required"
                });

            }


            // ===============================
            // ASSET ID VALIDATION
            // ===============================

            if (!mongoose.Types.ObjectId.isValid(asset)) {

                return res.status(400).json({
                    message: "Invalid asset ID"
                });

            }


            // ===============================
            // DATE VALIDATION
            // ===============================

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


            // ===============================
            // FIND ASSET
            // ===============================

            const assetDoc = await Asset.findById(asset);

            if (!assetDoc) {

                return res.status(404).json({
                    message: "Asset not found"
                });

            }


            // ===============================
            // FIND EMPLOYEE
            // ===============================

            let employeeDoc;


            if (req.user.role === "user") {

                employeeDoc = await Employee.findOne({
                    id: req.user.id
                });

                if (!employeeDoc) {

                    return res.status(404).json({
                        message: "Employee not found"
                    });

                }

                // Employee can only complain
                // about own assigned asset

                if (
                    !assetDoc.assignedTo ||
                    assetDoc.assignedTo.toString() !==
                    employeeDoc._id.toString()
                ) {

                    return res.status(403).json({
                        message:
                            "You can only create a repair request for your assigned asset"
                    });

                }

            } else {

                // ===============================
                // ADMIN
                // ===============================

                if (!employee) {

                    return res.status(400).json({
                        message:
                            "Employee is required"
                    });

                }

                if (
                    !mongoose.Types.ObjectId.isValid(
                        employee
                    )
                ) {

                    return res.status(400).json({
                        message:
                            "Invalid employee ID"
                    });

                }

                employeeDoc =
                    await Employee.findById(
                        employee
                    );

                if (!employeeDoc) {

                    return res.status(404).json({
                        message:
                            "Employee not found"
                    });

                }

            }


            // ===============================
            // STATUS
            // ===============================

            let finalStatus = "Pending";

            if (req.user.role === "admin") {

                const allowedStatus = [
                    "Pending",
                    "In Progress",
                    "Completed",
                    "Cancelled"
                ];

                if (
                    status &&
                    !allowedStatus.includes(status)
                ) {

                    return res.status(400).json({
                        message:
                            "Invalid repair status"
                    });

                }

                if (status) {
                    finalStatus = status;
                }

            }


            // ===============================
            // INTERNAL ID
            // ===============================

            const lastRepairById =
                await Repair.findOne()
                    .sort({ id: -1 });

            let nextInternalId = 1;

            if (
                lastRepairById &&
                typeof lastRepairById.id === "number"
            ) {

                nextInternalId =
                    lastRepairById.id + 1;

            }


            // ===============================
            // REPAIR ID
            // ===============================

            const lastRepair =
                await Repair.findOne({
                    repairId: /^REP\d+$/
                }).sort({
                    repairId: -1
                });

            let nextNumber = 1;

            if (lastRepair) {

                const lastNumber = Number(
                    lastRepair.repairId.replace(
                        "REP",
                        ""
                    )
                );

                nextNumber =
                    lastNumber + 1;

            }

            const repairId =
                "REP" +
                String(nextNumber).padStart(3, "0");


            // ===============================
            // CREATE REPAIR
            // ===============================

            const newRepair = new Repair({

                id: nextInternalId,

                repairId: repairId,

                asset: asset,

                employee: employeeDoc._id,

                complaint: complaint,

                complaintDate: date,

                status: finalStatus

            });


            const repair =
                await newRepair.save();


            // ===============================
            // ASSET STATUS
            // ===============================

            const activeStatuses = [
                "Pending",
                "In Progress"
            ];

            if (
                activeStatuses.includes(
                    finalStatus
                )
            ) {

                assetDoc.status = "Repair";

            } else {

                assetDoc.status =
                    assetDoc.assignedTo
                        ? "Assigned"
                        : "Available";

            }

            await assetDoc.save();


            // ===============================
            // POPULATE
            // ===============================

            const populatedRepair =
                await Repair.findById(
                    repair._id
                )
                    .populate("asset")
                    .populate("employee");
            
            // ===============================
            // CREATE NOTIFICATION
            // ===============================

            if (req.user.role === "user") {

                const lastNotification =
                    await Notification.findOne()
                        .sort({ id: -1 });

                const nextNotificationId =
                    lastNotification
                        ? lastNotification.id + 1
                        : 1;

                await Notification.create({
                    id: nextNotificationId,
                    employee: employeeDoc._id,
                    type: "Repair Request Created",
                    title: "Repair Request Created",
                    message: `Your repair request for ${populatedRepair.asset?.assetName || "asset"} has been submitted.`,
                    asset: populatedRepair.asset?._id || null,
                    repair: populatedRepair._id,
                    isRead: false
                });

            }


            res.status(201).json(
                populatedRepair
            );

        } catch (error) {

            console.log(
                "Error creating repair:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to create repair",
                error: error
            });

        }

    }
);


// =====================================================
// PUT REPAIR - ADMIN ONLY
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {

                return res.status(400).json({
                    message:
                        "Invalid repair ID"
                });

            }


            const repair =
                await Repair.findOne({
                    id: id
                });

            if (!repair) {

                return res.status(404).json({
                    message:
                        "Repair not found"
                });

            }

            const oldStatus = repair.status;


            const {
                asset,
                employee,
                complaint,
                complaintDate,
                status
            } = req.body;


            // ===============================
            // OLD ASSET
            // ===============================

            const oldAsset =
                await Asset.findById(
                    repair.asset
                );


            // ===============================
            // ASSET
            // ===============================

            if (asset !== undefined) {

                if (
                    !mongoose.Types.ObjectId.isValid(
                        asset
                    )
                ) {

                    return res.status(400).json({
                        message:
                            "Invalid asset ID"
                    });

                }

                const assetDoc =
                    await Asset.findById(asset);

                if (!assetDoc) {

                    return res.status(404).json({
                        message:
                            "Asset not found"
                    });

                }

                repair.asset = asset;

            }


            // ===============================
            // EMPLOYEE
            // ===============================

            if (employee !== undefined) {

                if (
                    !mongoose.Types.ObjectId.isValid(
                        employee
                    )
                ) {

                    return res.status(400).json({
                        message:
                            "Invalid employee ID"
                    });

                }

                const employeeDoc =
                    await Employee.findById(
                        employee
                    );

                if (!employeeDoc) {

                    return res.status(404).json({
                        message:
                            "Employee not found"
                    });

                }

                repair.employee =
                    employee;

            }


            // ===============================
            // ISSUE
            // ===============================

            if (complaint !== undefined) {

                if (!complaint.trim()) {

                    return res.status(400).json({
                        message:
                            "Issue cannot be empty"
                    });

                }

                repair.complaint =
                    complaint;

            }


            // ===============================
            // DATE
            // ===============================

            if (
                complaintDate !==
                undefined
            ) {

                const datePattern =
                    /^\d{4}-\d{2}-\d{2}$/;

                if (
                    !datePattern.test(
                        complaintDate
                    )
                ) {

                    return res.status(400).json({
                        message:
                            "Date must be in YYYY-MM-DD format"
                    });

                }

                const date =
                    new Date(
                        complaintDate
                    );

                if (
                    isNaN(
                        date.getTime()
                    )
                ) {

                    return res.status(400).json({
                        message:
                            "Invalid complaint date"
                    });

                }

                repair.complaintDate =
                    date;

            }


            // ===============================
            // STATUS
            // ===============================

            if (status !== undefined) {

                const allowedStatus = [
                    "Pending",
                    "In Progress",
                    "Completed",
                    "Cancelled"
                ];

                if (
                    !allowedStatus.includes(
                        status
                    )
                ) {

                    return res.status(400).json({
                        message:
                            "Invalid repair status"
                    });

                }

                repair.status =
                    status;

            }


            await repair.save();

            // ===============================
                // CREATE STATUS NOTIFICATION
                // ===============================

                if (
                    status !== undefined &&
                    oldStatus !== repair.status
                ) {

                    const lastNotification =
                        await Notification.findOne()
                            .sort({ id: -1 });

                    const nextNotificationId =
                        lastNotification
                            ? lastNotification.id + 1
                            : 1;

                    let notificationType =
                        "Repair Status Updated";

                    let notificationTitle =
                        "Repair Status Updated";

                    if (repair.status === "Completed") {

                        notificationType =
                            "Repair Completed";

                        notificationTitle =
                            "Repair Completed";

                    }

                    if (repair.status === "Cancelled") {

                        notificationType =
                            "Repair Cancelled";

                        notificationTitle =
                            "Repair Cancelled";

                    }

                    const assetForNotification =
                        await Asset.findById(
                            repair.asset
                        );

                    await Notification.create({

                        id: nextNotificationId,

                        employee:
                            repair.employee,

                        type:
                            notificationType,

                        title:
                            notificationTitle,

                        message:
                            `Your repair request for ${assetForNotification?.assetName || "asset"} is now ${repair.status}.`,

                        asset:
                            repair.asset,

                        repair:
                            repair._id,

                        isRead:
                            false
                    });
                }

            // ===============================
            // OLD ASSET STATUS
            // ===============================

            if (
                oldAsset &&
                oldAsset._id.toString() !==
                repair.asset.toString()
            ) {

                oldAsset.status =
                    oldAsset.assignedTo
                        ? "Assigned"
                        : "Available";

                await oldAsset.save();

            }


            // ===============================
            // CURRENT ASSET STATUS
            // ===============================

            const currentAsset =
                await Asset.findById(
                    repair.asset
                );

            if (currentAsset) {

                if (
                    repair.status ===
                    "Pending" ||
                    repair.status ===
                    "In Progress"
                ) {

                    currentAsset.status =
                        "Repair";

                } else {

                    currentAsset.status =
                        currentAsset.assignedTo
                            ? "Assigned"
                            : "Available";

                }

                await currentAsset.save();

            }


            // ===============================
            // RESPONSE
            // ===============================

            const updatedRepair =
                await Repair.findById(
                    repair._id
                )
                    .populate("asset")
                    .populate("employee");


            res.json(updatedRepair);

        } catch (error) {

            console.log(
                "Error updating repair:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update repair",
                error: error
            });

        }

    }
);


// =====================================================
// DELETE REPAIR - ADMIN ONLY
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const id =
                Number(req.params.id);

            if (isNaN(id)) {

                return res.status(400).json({
                    message:
                        "Invalid repair ID"
                });

            }


            const repair =
                await Repair.findOne({
                    id: id
                });

            if (!repair) {

                return res.status(404).json({
                    message:
                        "Repair not found"
                });

            }


            // Restore asset status

            const asset =
                await Asset.findById(
                    repair.asset
                );

            if (asset) {

                asset.status =
                    asset.assignedTo
                        ? "Assigned"
                        : "Available";

                await asset.save();

            }


            await repair.deleteOne();


            res.json({
                message:
                    "Repair deleted successfully"
            });

        } catch (error) {

            console.log(
                "Error deleting repair:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete repair",
                error: error
            });

        }

    }
);


module.exports = router;