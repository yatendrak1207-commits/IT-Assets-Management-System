const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true
        },

        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null
        },

        type: {
            type: String,
            enum: [
                "Asset Assigned",
                "Asset Unassigned",
                "Asset Updated",
                "Asset Status Updated",
                "Repair Request Created",
                "Repair Status Updated",
                "Repair Completed",
                "Repair Cancelled",
                "Complaint Created",
                "Complaint Created",
                "System Notification"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            default: null
        },

        repair: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repair",
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;