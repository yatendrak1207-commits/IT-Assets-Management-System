const express = require("express");

const router = express.Router();

const Notification = require("../Models/Notification");
const Employee = require("../Models/Employee");

const {
    authMiddleware,
    requireRole
} = require("../middleware/authMiddleware");


// GET ADMIN NOTIFICATIONS
router.get(
    "/admin",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const notifications = await Notification.find({
                employee: null
            })
                .populate("asset")
                .sort({ createdAt: -1 });

            res.json(notifications);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch admin notifications",
                error: error
            });

        }
    }
);

// DELETE ONE NOTIFICATION - ADMIN
router.delete(
    "/admin/:id",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const notification = await Notification.findOne({
                _id: req.params.id,
                employee: null
            });

            if (!notification) {
                return res.status(404).json({
                    message: "Notification not found"
                });
            }

            await Notification.deleteOne({
                _id: req.params.id,
                employee: null
            });

            res.json({
                message: "Notification deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to delete notification",
                error: error
            });

        }
    }
);

// GET MY NOTIFICATIONS
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

            const notifications = await Notification.find({
                employee: employee._id
            })
                .populate("asset")
                .populate("repair")
                .sort({ createdAt: -1 });

            res.json(notifications);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch notifications",
                error: error
            });

        }
    }
);


// GET UNREAD COUNT
router.get(
    "/unread-count",
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

            const count = await Notification.countDocuments({
                employee: employee._id,
                isRead: false
            });

            res.json({
                count: count
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch unread notification count",
                error: error
            });

        }
    }
);


// MARK ONE NOTIFICATION AS READ
router.put(
    "/:id/read",
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

            const notification = await Notification.findOne({
                _id: req.params.id,
                employee: employee._id
            });

            if (!notification) {
                return res.status(404).json({
                    message: "Notification not found"
                });
            }

            notification.isRead = true;

            await notification.save();

            res.json(notification);

        } catch (error) {

            res.status(500).json({
                message: "Failed to mark notification as read",
                error: error
            });

        }
    }
);


// DELETE ONE NOTIFICATION
router.delete(
    "/:id",
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

            const notification = await Notification.findOne({
                _id: req.params.id,
                employee: employee._id
            });

            if (!notification) {
                return res.status(404).json({
                    message: "Notification not found"
                });
            }

            await Notification.deleteOne({
                _id: req.params.id,
                employee: employee._id
            });

            res.json({
                message: "Notification deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to delete notification",
                error: error
            });

        }
    }
);


// MARK ALL NOTIFICATIONS AS READ
router.put(
    "/read-all",
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

            await Notification.updateMany(
                {
                    employee: employee._id,
                    isRead: false
                },
                {
                    $set: {
                        isRead: true
                    }
                }
            );

            res.json({
                message: "All notifications marked as read"
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to mark notifications as read",
                error: error
            });

        }
    }
);


module.exports = router;