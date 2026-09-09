const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema({
    id: Number,

    repairId: {
        type: String,
        unique: true
    },

    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true
    },

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    complaint: String,

    complaintDate: Date,

    status: String
});

const Repair = mongoose.model("Repair", repairSchema);

module.exports = Repair;