const express = require("express");
const router = express.Router();
const { isValidPhoneNumber } = require("libphonenumber-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Employee = require("../Models/Employee");
const Asset = require("../Models/Asset");

// ================= GET =================

router.get("/", async function (req, res) {

    try {

        const employees = await Employee.find().select("-password");

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
            password,
            employeestatus
        } = req.body;

        // Required fields
        if (
            id === undefined ||
            !employeeName ||
            !department ||
            !phone ||
            !email ||
            !password ||
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

        // Duplicate email
        const existingEmail = await Employee.findOne({
            email: email.toLowerCase()
        });

        if (existingEmail) {

            return res.status(409).json({
                message: "Employee with this email already exists"
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new Employee({

            id: id,

            employeeId: employeeId,

            employeeName: employeeName,

            department: department,

            phone: phone,

            email: email.toLowerCase(),

            password: hashedPassword,

            employeestatus: employeestatus

        });

        const employee = await newEmployee.save();

        // Password frontend ko return nahi karna
        const employeeResponse = {
            id: employee.id,
            employeeId: employee.employeeId,
            employeeName: employee.employeeName,
            department: employee.department,
            phone: employee.phone,
            email: employee.email,
            employeestatus: employee.employeestatus
        };

        res.status(201).json(employeeResponse);

    } catch (error) {
            console.log("EMPLOYEE LOGIN ERROR:", error);

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
            employee.email = email.toLowerCase();
        }

        if (employeestatus !== undefined) {
            employee.employeestatus = employeestatus;
        }

        // Password intentionally NOT updated by Admin

        const updatedEmployee = await employee.save();

        const employeeResponse = {
            id: updatedEmployee.id,
            employeeId: updatedEmployee.employeeId,
            employeeName: updatedEmployee.employeeName,
            department: updatedEmployee.department,
            phone: updatedEmployee.phone,
            email: updatedEmployee.email,
            employeestatus: updatedEmployee.employeestatus
        };

        res.json(employeeResponse);

    } catch (error) {

        res.status(500).json({
            message: "Failed to update employee",
            error: error
        });

    }

});

// ================= CHANGE PASSWORD =================

router.put("/change-password/:id", async function (req, res) {

    try {

        const id = Number(req.params.id);

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "Current password and new password are required"
            });

        }

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

        // Check current password
        const isCorrect = await bcrypt.compare(
            currentPassword,
            employee.password
        );

        if (!isCorrect) {

            return res.status(401).json({
                message: "Current password is incorrect"
            });

        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        employee.password = hashedPassword;

        await employee.save();

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to change password",
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

// ================= EMPLOYEE LOGIN =================

router.post("/login", async function (req, res) {

    try {

        const {
            email,
            password
        } = req.body;

        // Check email and password
        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }

        // Find employee by email
        const employee = await Employee.findOne({
            email: email.toLowerCase()
        });

        // Employee not found
        if (!employee) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        // Check employee status
        if (employee.employeestatus !== "Active") {

            return res.status(403).json({
                message: "Employee account is not active"
            });

        }

       // Check password
        if (!employee.password) {
            return res.status(500).json({
                message: "Employee password is missing in database"
            });
        }

        const isCorrect = await bcrypt.compare(
            password,
            employee.password
        );

        // Wrong password
        if (!isCorrect) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        // Check JWT secret
        if (!process.env.JWT_SECRET) {

            return res.status(500).json({
                message: "JWT_SECRET is not configured"
            });

        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: employee.id,
                employeeId: employee.employeeId,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Successful login
        res.json({

            message: "Login successful",

            token: token,

            employee: {

                id: employee.id,

                employeeId: employee.employeeId,

                name: employee.employeeName,

                email: employee.email,

                phone: employee.phone,

                department: employee.department,

                role: "user",

                status: employee.employeestatus

            }

        });

    } catch (error) {

        console.error("Employee Login Error:", error);

        res.status(500).json({

            message: "Login failed",

            error: error.message

        });

    }

});

module.exports = router;