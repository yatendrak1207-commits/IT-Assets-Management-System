const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  id: Number,
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset",
  },
  complaint: String,
  complaintDate: Date,
  status: String
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;