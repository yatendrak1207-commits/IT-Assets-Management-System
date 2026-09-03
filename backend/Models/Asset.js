const mongoose=require("mongoose");
const { BiCategory } = require("react-icons/bi");

const assetSchema=new mongoose.Schema({
    id : Number,
    name:String,
    category: String,
    status:String,
});

const Asset= mongoose.model("Asset",assetSchema);
module.exports = Asset;