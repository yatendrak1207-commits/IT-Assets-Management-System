const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  id: Number,
  employeeName: String,
  assetName: String,
  complaint: String,
  complaintDate: Date,
  status: String
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;