const mongoose = require("mongoose"); 
 
const assetSchema = new mongoose.Schema({ 
 
    id: Number, 
 
    assetId: String, 
 
    assetName: String, 
 
    category: String, 
 
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Employee", 
        default: null 
    }, 

    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Supplier", 
        default: null 
    }, 
 
    status: String 
 
}); 
 
const Asset = mongoose.model("Asset", assetSchema); 
 
module.exports = Asset;