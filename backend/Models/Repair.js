const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema({
    id: Number,
    repairId: Number,
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
    complaint: String,
    complaintDate: Date,
    status: String,
});

const Repair = mongoose.model("Repair", repairSchema);
module.exports = Repair;