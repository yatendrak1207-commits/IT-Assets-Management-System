const mongoose = require("mongoose");

const supplierSchema= new mongoose.Schema({
    id : Number,
    supplierId: Number,
    supplierName: String,
    companyName: String,
    companyContactNumber: String,
});

const Supplier=mongoose.model("Supplier",supplierSchema);
module.exports=Supplier;