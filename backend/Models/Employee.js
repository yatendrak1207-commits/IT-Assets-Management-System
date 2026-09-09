const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

    id: Number,

    employeeId: {
        type: String,
        unique: true
    },

    employeeName: String,

    department: String,

    phone: String,

    email: {
        type: String,
        unique: true
    },

    password: String,

    employeestatus: String

});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;