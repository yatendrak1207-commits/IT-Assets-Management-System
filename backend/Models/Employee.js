const mongoose = require("mongoose");

const employeeSchema= new mongoose.Schema({
    id : Number,
    employeeId:Number,
    name:String,
    department:String,
    phoneno:String,
    email:String,
});

const Employee=mongoose.model("Employee",employeeSchema);
module.exports=Employee;