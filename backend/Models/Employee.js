const mongoose = require("mongoose");

const employeeSchema= new mongoose.Schema({
    id : Number,
    employeeId:Number,
    employeeName:String,
    department:String,
    phone:String,
    email:String,
    employeestatus:String,
   assignedAsset: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Asset"
},
    

});

const Employee=mongoose.model("Employee",employeeSchema);
module.exports=Employee;