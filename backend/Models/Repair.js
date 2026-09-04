const mongoose = require("mongoose");

const repairSchema= new mongoose.Schema({
    id : Number,
    repairId: Number,
    assetName: String,
    assigned: String,
    complaint: String,
    complaintDate: Date,
    status: String,
});

const Repair=mongoose.model("Repair",repairSchema);
module.exports=Repair;