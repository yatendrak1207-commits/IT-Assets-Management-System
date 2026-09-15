const express = require("express");

const router = express.Router();

const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");
const Notification = require("../Models/Notification");

const {
    authMiddleware,
    requireRole
} = require("../middleware/authMiddleware");


// ======================================================
// HELPER - GET NEXT NOTIFICATION ID
// ======================================================

async function getNextNotificationId() {

    const lastNotification = await Notification
        .findOne()
        .sort({ id: -1 });

    return lastNotification
        ? lastNotification.id + 1
        : 1;
}


// ======================================================
// HELPER - CREATE NOTIFICATION
// ======================================================

async function createNotification({
    employee,
    type,
    title,
    message,
    asset = null,
    repair = null
}) {

    if (!employee) {
        return;
    }

    const nextNotificationId = await getNextNotificationId();

    await Notification.create({
        id: nextNotificationId,
        employee: employee,
        type: type,
        title: title,
        message: message,
        asset: asset,
        repair: repair,
        isRead: false
    });
}


// ======================================================
// GET MY ASSETS
// Employee apne assigned assets dekhega
// ======================================================

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

            const assets = await Asset.find({
                assignedTo: employee._id
            }).populate(
                "assignedTo",
                "employeeName employeeId email department"
            );

            res.json(assets);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Failed to fetch my assets",
                error: error.message
            });
        }
    }
);


// ======================================================
// GET ALL ASSETS
// Admin
// ======================================================

router.get(
    "/",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const assets = await Asset.find()
                .populate(
                    "assignedTo",
                    "employeeName employeeId email department"
                )
                .sort({ id: 1 });

            res.json(assets);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Failed to fetch assets",
                error: error.message
            });
        }
    }
);


// ======================================================
// CREATE ASSET
// Admin
// ======================================================

router.post(
    "/",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const {
                id,
                assetName,
                category,
                assignedTo,
                status
            } = req.body;


            // -------------------------------
            // VALIDATION
            // -------------------------------

            if (!assetName || !category) {

                return res.status(400).json({
                    message: "Asset name and category are required"
                });

            }


            // -------------------------------
            // CHECK EMPLOYEE
            // -------------------------------

            let employee = null;

            if (assignedTo) {

                employee = await Employee.findById(assignedTo);

                if (!employee) {

                    return res.status(404).json({
                        message: "Assigned employee not found"
                    });

                }
            }


            // -------------------------------
            // CHECK DUPLICATE ID
            // -------------------------------

            if (id) {

                const existingAsset = await Asset.findOne({
                    id: Number(id)
                });

                if (existingAsset) {

                    return res.status(400).json({
                        message: "Asset ID already exists"
                    });

                }
            }


            // -------------------------------
            // GENERATE ID
            // -------------------------------

            let assetNumber = Number(id);

            if (!assetNumber) {

                const lastAsset = await Asset
                    .findOne()
                    .sort({ id: -1 });

                assetNumber = lastAsset
                    ? lastAsset.id + 1
                    : 1;
            }


            // -------------------------------
            // GENERATE ASSET ID
            // -------------------------------

            const assetId = `AST${String(assetNumber).padStart(3, "0")}`;


            // -------------------------------
            // CREATE ASSET
            // -------------------------------

            const asset = new Asset({

                id: assetNumber,

                assetId: assetId,

                assetName: assetName,

                category: category,

                assignedTo: assignedTo || null,

                status: status || "Available"
            });


            await asset.save();


            // -------------------------------
            // POPULATE
            // -------------------------------

            const updatedAsset = await Asset
                .findById(asset._id)
                .populate(
                    "assignedTo",
                    "employeeName employeeId email department"
                );


            // ==================================================
            // NOTIFICATION
            // NEW ASSET ASSIGNED
            // ==================================================

            if (employee) {

                await createNotification({

                    employee: employee._id,

                    type: "Asset Assigned",

                    title: "Asset Assigned",

                    message:
                        `The asset ${updatedAsset.assetName} has been assigned to you.`,

                    asset: updatedAsset._id
                });
            }


            // -------------------------------
            // RESPONSE
            // -------------------------------

            res.status(201).json(updatedAsset);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Failed to create asset",
                error: error.message
            });
        }
    }
);


// ======================================================
// UPDATE ASSET
// Admin
// ======================================================

router.put(
    "/:id",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const assetIdNumber = Number(req.params.id);


            // -------------------------------
            // FIND ASSET
            // -------------------------------

            const asset = await Asset.findOne({
                id: assetIdNumber
            });

            if (!asset) {

                return res.status(404).json({
                    message: "Asset not found"
                });

            }


            // ==================================================
            // OLD VALUES
            // ==================================================

            const oldAssignedTo = asset.assignedTo
                ? String(asset.assignedTo)
                : null;

            const oldAssetName = asset.assetName;

            const oldCategory = asset.category;

            const oldStatus = asset.status;


            // ==================================================
            // NEW VALUES
            // ==================================================

            const {
                assetName,
                category,
                assignedTo,
                status
            } = req.body;


            const newAssignedTo = assignedTo
                ? String(assignedTo)
                : null;


            // ==================================================
            // CHECK EMPLOYEE
            // ==================================================

            let newEmployee = null;

            if (newAssignedTo) {

                newEmployee = await Employee.findById(
                    newAssignedTo
                );

                if (!newEmployee) {

                    return res.status(404).json({
                        message: "Assigned employee not found"
                    });

                }
            }


            // ==================================================
            // CHECK CHANGES
            // ==================================================

            const assignmentChanged =
                oldAssignedTo !== newAssignedTo;


            const nameChanged =
                assetName !== undefined &&
                assetName !== oldAssetName;


            const categoryChanged =
                category !== undefined &&
                category !== oldCategory;


            const statusChanged =
                status !== undefined &&
                status !== oldStatus;


            const detailsChanged =
                nameChanged ||
                categoryChanged;


            // ==================================================
            // UPDATE ASSET
            // ==================================================

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
                asset.status = status;
            }


            await asset.save();


            // ==================================================
            // POPULATE UPDATED ASSET
            // ==================================================

            const updatedAsset = await Asset
                .findById(asset._id)
                .populate(
                    "assignedTo",
                    "employeeName employeeId email department"
                );


            // ==================================================
            // 1. OLD EMPLOYEE - UNASSIGNED
            // ==================================================

            if (
                assignmentChanged &&
                oldAssignedTo
            ) {

                await createNotification({

                    employee: oldAssignedTo,

                    type: "Asset Unassigned",

                    title: "Asset Unassigned",

                    message:
                        `The asset ${updatedAsset.assetName} has been unassigned from you.`,

                    asset: updatedAsset._id
                });
            }


            // ==================================================
            // 2. NEW EMPLOYEE - ASSIGNED
            // ==================================================

            if (
                assignmentChanged &&
                newAssignedTo
            ) {

                await createNotification({

                    employee: newAssignedTo,

                    type: "Asset Assigned",

                    title: "Asset Assigned",

                    message:
                        `The asset ${updatedAsset.assetName} has been assigned to you.`,

                    asset: updatedAsset._id
                });
            }


            // ==================================================
            // 3. ASSET DETAILS UPDATED
            // ==================================================

            if (
                detailsChanged &&
                newAssignedTo
            ) {

                await createNotification({

                    employee: newAssignedTo,

                    type: "Asset Updated",

                    title: "Asset Updated",

                    message:
                        `The details of your asset ${updatedAsset.assetName} have been updated.`,

                    asset: updatedAsset._id
                });
            }


            // ==================================================
            // 4. ASSET STATUS UPDATED
            // ==================================================

            if (
                statusChanged &&
                newAssignedTo
            ) {

                await createNotification({

                    employee: newAssignedTo,

                    type: "Asset Status Updated",

                    title: "Asset Status Updated",

                    message:
                        `The status of your asset ${updatedAsset.assetName} has been changed to ${updatedAsset.status}.`,

                    asset: updatedAsset._id
                });
            }


            // ==================================================
            // RESPONSE
            // ==================================================

            res.json(updatedAsset);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Failed to update asset",
                error: error.message
            });
        }
    }
);


// ======================================================
// DELETE ASSET
// Admin
// ======================================================

router.delete(
    "/:id",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const assetIdNumber = Number(req.params.id);

            const asset = await Asset.findOne({
                id: assetIdNumber
            });

            if (!asset) {

                return res.status(404).json({
                    message: "Asset not found"
                });

            }


            // -------------------------------
            // DELETE
            // -------------------------------

            await Asset.findOneAndDelete({
                id: assetIdNumber
            });


            // -------------------------------
            // RESPONSE
            // -------------------------------

            res.json({
                message: "Asset deleted successfully"
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Failed to delete asset",
                error: error.message
            });
        }
    }
);


module.exports = router;