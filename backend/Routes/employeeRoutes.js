const express = require("express");
const router = express.Router();
const { isValidPhoneNumber } = require("libphonenumber-js");

const Employee = require("../Models/Employee");
const Asset = require("../Models/Asset");

// ================= GET =================

router.get("/", async function (req, res) {

    try {

        const employees = await Employee.find();

        res.json(employees);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch employees",
            error: error
        });

    }

});

// ================= POST =================

router.post("/", async function (req, res) {

    try {

        const {
            id,
            employeeName,
            department,
            phone,
            email,
            employeestatus
        } = req.body;

        // Required fields
        if (
            id === undefined ||
            !employeeName ||
            !department ||
            !phone ||
            !email ||
            !employeestatus
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        // Internal ID validation
        if (typeof id !== "number") {

            return res.status(400).json({
                message: "ID must be a number"
            });

        }

        // Phone validation
        const fullPhoneNumber = phone.replace(/\s/g, "");

        if (!isValidPhoneNumber(fullPhoneNumber)) {

            return res.status(400).json({
                message: "Invalid phone number for selected country"
            });

        }

        // Duplicate internal ID
        const existingId = await Employee.findOne({
            id: id
        });

        if (existingId) {

            return res.status(409).json({
                message: "Internal ID already exists"
            });

        }

        // ================= AUTO EMPLOYEE ID =================

        const lastEmployee = await Employee.findOne({
            employeeId: /^EMP\d+$/
        }).sort({
            employeeId: -1
        });

        let nextNumber = 1;

        if (lastEmployee) {

            const lastNumber = Number(
                lastEmployee.employeeId.replace("EMP", "")
            );

            nextNumber = lastNumber + 1;

        }

        const employeeId =
            "EMP" + String(nextNumber).padStart(3, "0");

        // ================= CREATE =================

        const newEmployee = new Employee({

            id: id,

            employeeId: employeeId,

            employeeName: employeeName,

            department: department,

            phone: phone,

            email: email,

            employeestatus: employeestatus

        });

        const employee = await newEmployee.save();

        res.status(201).json(employee);

    } catch (error) {

        res.status(500).json({
            message: "Failed to create employee",
            error: error
        });

    }

});

// ================= PUT =================

router.put("/:id", async function (req, res) {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                message: "Invalid employee ID"
            });

        }

        const employee = await Employee.findOne({
            id: id
        });

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        const {
            employeeName,
            department,
            phone,
            email,
            employeestatus
        } = req.body;

        // Phone validation
        if (phone !== undefined) {

            const fullPhoneNumber = phone.replace(/\s/g, "");

            if (!isValidPhoneNumber(fullPhoneNumber)) {

                return res.status(400).json({
                    message: "Invalid phone number for selected country"
                });

            }

            employee.phone = phone;

        }

        // Update fields

        if (employeeName !== undefined) {
            employee.employeeName = employeeName;
        }

        if (department !== undefined) {
            employee.department = department;
        }

        if (email !== undefined) {
            employee.email = email;
        }

        if (employeestatus !== undefined) {
            employee.employeestatus = employeestatus;
        }

        // employeeId intentionally NOT updated

        const updatedEmployee = await employee.save();

        res.json(updatedEmployee);

    } catch (error) {

        res.status(500).json({
            message: "Failed to update employee",
            error: error
        });

    }

});

// ================= DELETE =================

router.delete("/:id", async function (req, res) {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                message: "Invalid employee ID"
            });

        }

        const employee = await Employee.findOne({
            id: id
        });

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        // Unassign assets from this employee

        await Asset.updateMany(
            {
                assignedTo: employee._id,
                status: "Assigned"
            },
            {
                $set: {
                    assignedTo: null,
                    status: "Available"
                }
            }
        );

        // Repair assets
        await Asset.updateMany(
            {
                assignedTo: employee._id
            },
            {
                $set: {
                    assignedTo: null
                }
            }
        );

        await employee.deleteOne();

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete employee",
            error: error
        });

    }

});

module.exports = router;