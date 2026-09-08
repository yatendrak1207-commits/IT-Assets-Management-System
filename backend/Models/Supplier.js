const mongoose = require("mongoose");

const supplierSchema= new mongoose.Schema({
    id : Number,
    supplierId: Number,
    supplierName: String,
    companyName: String,
    companyContactNumber: String,
    companyEmail: String,
    companyAddress: String,
    assetsSupplied: String,
    supplierStatus: String,
});

const Supplier=mongoose.model("Supplier",supplierSchema);
module.exports=Supplier;