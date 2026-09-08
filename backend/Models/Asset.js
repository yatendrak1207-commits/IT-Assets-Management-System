const mongoose=require("mongoose");
const { BiCategory } = require("react-icons/bi");

const assetSchema=new mongoose.Schema({
    id : Number,
    assetId:Number,
    assetName:String,
    category: String,
   assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Employee"
},
    status:String,
});

const Asset= mongoose.model("Asset",assetSchema);
module.exports = Asset;