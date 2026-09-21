const express = require("express");
const router = express.Router();
const { isValidPhoneNumber } = require("libphonenumber-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// ================= PROFILE PHOTO UPLOAD =================

const profileUploadPath = path.join(
    __dirname,
    "../uploads/profile"
);

if (!fs.existsSync(profileUploadPath)) {
    fs.mkdirSync(profileUploadPath, {
        recursive: true
    });
}

const profileStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, profileUploadPath);

    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const uniqueName =
            "employee-" +
            req.params.id +
            "-" +
            Date.now() +
            extension;

        cb(null, uniqueName);

    }

});

const profileUpload = multer({

    storage: profileStorage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
                )
            );

        }

    }

});

const Employee = require("../Models/Employee");
const Asset = require("../Models/Asset");
const Notification = require("../Models/Notification");
const {
    authMiddleware,
    requireRole
} = require("../middleware/authMiddleware");


// ================= GET ALL EMPLOYEES =================
// ONLY ADMIN

router.get(
    "/",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const employees = await Employee.find()
                .select("-password");

            res.json(employees);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch employees",
                error: error
            });

        }

    }
);

// ================= USER SIGNUP =================
// PUBLIC USER REGISTRATION

router.post(
    "/register",
    async function (req, res) {

        try {

            const {
                email,
                password,
                employeeName,
                department,
                phone
            } = req.body;


            // Required fields

            if (
                !email ||
                !password ||
                !employeeName ||
                !department ||
                !phone
            ) {

                return res.status(400).json({
                    message: "All fields are required"
                });

            }


            // Email

            const emailLower =
                email.trim().toLowerCase();


            // Password

            if (password.length < 6) {

                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                });

            }


            // Phone validation

            const fullPhoneNumber =
                phone.replace(/\s/g, "");


            if (!isValidPhoneNumber(fullPhoneNumber)) {

                return res.status(400).json({
                    message:
                        "Invalid phone number"
                });

            }


            // Check duplicate email

            const existingEmployee =
                await Employee.findOne({
                    email: emailLower
                });


            if (existingEmployee) {

                return res.status(409).json({
                    message:
                        "An account with this email already exists"
                });

            }


            // ================= AUTO INTERNAL ID =================

            const lastEmployeeById =
                await Employee.findOne()
                    .sort({ id: -1 });


            let nextId = 1;


            if (
                lastEmployeeById &&
                typeof lastEmployeeById.id === "number"
            ) {

                nextId =
                    lastEmployeeById.id + 1;

            }


            // ================= AUTO EMPLOYEE ID =================

            const lastEmployee =
                await Employee.findOne({
                    employeeId: /^EMP\d+$/
                }).sort({
                    employeeId: -1
                });


            let nextNumber = 1;


            if (
                lastEmployee &&
                lastEmployee.employeeId
            ) {

                const lastNumber =
                    Number(
                        lastEmployee.employeeId.replace(
                            "EMP",
                            ""
                        )
                    );


                nextNumber =
                    lastNumber + 1;

            }


            const employeeId =
                "EMP" +
                String(nextNumber).padStart(3, "0");


            // ================= PASSWORD HASH =================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // ================= CREATE USER =================

            const newEmployee =
                new Employee({

                    id: nextId,

                    employeeId: employeeId,

                    employeeName:
                        employeeName.trim(),

                    department:
                        department.trim(),

                    phone:
                        phone.trim(),

                    email:
                        emailLower,

                    password:
                        hashedPassword,

                    employeestatus:
                        "Active"

                });


            const employee =
                await newEmployee.save();


            // Password return nahi karna

            res.status(201).json({

                message:
                    "User account created successfully",

                employee: {

                    id:
                        employee.id,

                    employeeId:
                        employee.employeeId,

                    employeeName:
                        employee.employeeName,

                    department:
                        employee.department,

                    phone:
                        employee.phone,

                    email:
                        employee.email,

                    employeestatus:
                        employee.employeestatus,
                    profilePhoto: employee.profilePhoto || ""

                }

            });


        } catch (error) {

            console.log(
                "USER REGISTER ERROR:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to create user account",

                error:
                    error.message

            });

        }

    }
);
// ================= GET SINGLE EMPLOYEE =================
// ADMIN CAN ACCESS ANY EMPLOYEE
// EMPLOYEE CAN ACCESS ONLY HIS OWN PROFILE

router.get(
    "/:id",
    authMiddleware,
    async function (req, res) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {

                return res.status(400).json({
                    message: "Invalid employee ID"
                });

            }


            // Employee can access only his own profile

            if (
                req.user.role === "user" &&
                Number(req.user.id) !== id
            ) {

                return res.status(403).json({
                    message: "Access denied"
                });

            }


            const employee = await Employee.findOne({
                id: id
            }).select("-password");


            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }


            res.json(employee);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch employee",
                error: error
            });

        }

    }
);


// ================= POST =================
// ONLY ADMIN


router.post(
    "/",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const {
                employeeName,
                department,
                phone,
                email,
                password,
                employeestatus
            } = req.body;


            // Required fields

            if (
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


            // Phone validation

            const fullPhoneNumber =
                phone.replace(/\s/g, "");

            if (!isValidPhoneNumber(fullPhoneNumber)) {

                return res.status(400).json({
                    message:
                        "Invalid phone number for selected country"
                });

            }


            // ================= AUTO INTERNAL ID =================

            const lastEmployeeById =
                await Employee.findOne()
                    .sort({ id: -1 });


            let nextId = 1;

            if (
                lastEmployeeById &&
                typeof lastEmployeeById.id === "number"
            ) {

                nextId =
                    lastEmployeeById.id + 1;

            }


            // ================= DUPLICATE EMAIL =================

            const existingEmail =
                await Employee.findOne({
                    email: email.toLowerCase()
                });

            if (existingEmail) {

                return res.status(409).json({
                    message:
                        "Employee with this email already exists"
                });

            }


            // ================= AUTO EMPLOYEE ID =================

            const lastEmployee =
                await Employee.findOne({
                    employeeId: /^EMP\d+$/
                }).sort({
                    employeeId: -1
                });


            let nextNumber = 1;

            if (lastEmployee) {

                const lastNumber =
                    Number(
                        lastEmployee.employeeId.replace(
                            "EMP",
                            ""
                        )
                    );

                nextNumber =
                    lastNumber + 1;

            }


            const employeeId =
                "EMP" +
                String(nextNumber).padStart(3, "0");


            // ================= PASSWORD HASH =================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // ================= CREATE EMPLOYEE =================

            const newEmployee =
                new Employee({

                    id: nextId,

                    employeeId: employeeId,

                    employeeName: employeeName,

                    department: department,

                    phone: phone,

                    email: email.toLowerCase(),

                    password: hashedPassword,

                    employeestatus:
                        employeestatus

                });


            const employee =
                await newEmployee.save();


            // Password frontend ko return nahi karna

            const employeeResponse = {

                id: employee.id,

                employeeId:
                    employee.employeeId,

                employeeName:
                    employee.employeeName,

                department:
                    employee.department,

                phone:
                    employee.phone,

                email:
                    employee.email,

                employeestatus:
                    employee.employeestatus,
                profilePhoto: employee.profilePhoto || ""

            };


            res.status(201).json(
                employeeResponse
            );


        } catch (error) {

            console.log(
                "CREATE EMPLOYEE ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to create employee",

                error:
                    error

            });

        }

    }
);;


// ================= PUT =================
// ADMIN CAN UPDATE ANY EMPLOYEE
// EMPLOYEE CAN UPDATE ONLY HIS OWN PROFILE

router.put(
    "/:id",
    authMiddleware,
    async function (req, res) {

        try {

            const id = Number(req.params.id);


            if (isNaN(id)) {

                return res.status(400).json({
                    message: "Invalid employee ID"
                });

            }


            // Employee can update only his own profile

            if (
                req.user.role === "user" &&
                Number(req.user.id) !== id
            ) {

                return res.status(403).json({
                    message: "Access denied"
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

                const fullPhoneNumber =
                    phone.replace(/\s/g, "");


                if (!isValidPhoneNumber(fullPhoneNumber)) {

                    return res.status(400).json({
                        message:
                            "Invalid phone number for selected country"
                    });

                }


                employee.phone = phone;

            }


            // Update employee name

            if (employeeName !== undefined) {

                employee.employeeName =
                    employeeName;

            }


            // Update department

            if (department !== undefined) {

                employee.department =
                    department;

            }


            // Update email

            if (email !== undefined) {

                employee.email =
                    email.toLowerCase();

            }


            // Employee status
            // ONLY ADMIN CAN CHANGE STATUS

            if (
                employeestatus !== undefined &&
                req.user.role === "admin"
            ) {

                employee.employeestatus =
                    employeestatus;

            }


            // Password intentionally NOT updated here


            const updatedEmployee =
                await employee.save();


            // Password frontend ko return nahi karna

            const employeeResponse = {

                id: updatedEmployee.id,

                employeeId:
                    updatedEmployee.employeeId,

                employeeName:
                    updatedEmployee.employeeName,

                department:
                    updatedEmployee.department,

                phone:
                    updatedEmployee.phone,

                email:
                    updatedEmployee.email,

                employeestatus:
                    updatedEmployee.employeestatus,

                profilePhoto:
                    updatedEmployee.profilePhoto || ""

            };


            res.json(employeeResponse);

        } catch (error) {

            console.log("UPDATE EMPLOYEE ERROR:", error);


            res.status(500).json({

                message:
                    "Failed to update employee",

                error:
                    error.message

            });

        }

    }
);
// ================= UPLOAD EMPLOYEE PROFILE PHOTO =================

router.post(
    "/:id/profile-photo",
    authMiddleware,
    profileUpload.single("profilePhoto"),
    async function (req, res) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid employee ID"
                });
            }

            // User can upload only his own profile photo
            if (
                req.user.role === "user" &&
                Number(req.user.id) !== id
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            if (
                req.user.role !== "user" &&
                req.user.role !== "admin"
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "Please select an image"
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

            // Delete old photo if it exists
            if (employee.profilePhoto) {

                const oldPhotoPath = path.join(
                    __dirname,
                    "..",
                    employee.profilePhoto
                );

                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }

            const photoPath =
                "/uploads/profile/" +
                req.file.filename;

            employee.profilePhoto = photoPath;

            await employee.save();

            res.json({
                message: "Profile photo uploaded successfully",
                profilePhoto: photoPath
            });

        } catch (error) {

            console.log(
                "Employee profile photo upload error:",
                error
            );

            res.status(500).json({
                message: "Failed to upload profile photo",
                error: error.message
            });
        }
    }
);
// ================= REMOVE EMPLOYEE PROFILE PHOTO =================

router.delete(
    "/:id/profile-photo",
    authMiddleware,
    async function (req, res) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid employee ID"
                });
            }

            // User can remove only his own profile photo
            if (
                req.user.role === "user" &&
                Number(req.user.id) !== id
            ) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

            // Only user or admin can access
            if (
                req.user.role !== "user" &&
                req.user.role !== "admin"
            ) {
                return res.status(403).json({
                    message: "Access denied"
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

            // Delete photo file from uploads folder
            if (employee.profilePhoto) {

                const photoPath = path.join(
                    __dirname,
                    "..",
                    employee.profilePhoto
                );

                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            }

            // Remove photo path from database
            employee.profilePhoto = "";

            await employee.save();

            res.json({
                message: "Profile photo removed successfully",
                profilePhoto: ""
            });

        } catch (error) {

            console.log(
                "Employee profile photo remove error:",
                error
            );

            res.status(500).json({
                message: "Failed to remove profile photo",
                error: error.message
            });
        }
    }
);
// ================= CHANGE PASSWORD =================
// EMPLOYEE CAN CHANGE ONLY HIS OWN PASSWORD
// ADMIN CAN ACCESS THIS ROUTE

router.put(
    "/change-password/:id",
    authMiddleware,
    async function (req, res) {

        try {

            const id = Number(req.params.id);


            const {
                currentPassword,
                newPassword
            } = req.body;


            if (!currentPassword || !newPassword) {

                return res.status(400).json({

                    message:
                        "Current password and new password are required"

                });

            }


            if (isNaN(id)) {

                return res.status(400).json({
                    message: "Invalid employee ID"
                });

            }


            // USER can change only his own password

            if (
                req.user.role === "user" &&
                Number(req.user.id) !== id
            ) {

                return res.status(403).json({

                    message: "Access denied"

                });

            }


            const employee = await Employee.findOne({
                id: id
            });


            if (!employee) {

                return res.status(404).json({

                    message:
                        "Employee not found"

                });

            }


            // Check current password

            const isCorrect =
                await bcrypt.compare(
                    currentPassword,
                    employee.password
                );


            if (!isCorrect) {

                return res.status(401).json({

                    message:
                        "Current password is incorrect"

                });

            }


            // Hash new password

            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            employee.password =
                hashedPassword;


            await employee.save();


            res.json({

                message:
                    "Password changed successfully"

            });

        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to change password",

                error:
                    error

            });

        }

    }
);


// ================= DELETE =================
// ONLY ADMIN

router.delete(
    "/:id",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid employee ID"
                });
            }

            const employee = await Employee.findOne({ id: id });

            if (!employee) {
                return res.status(404).json({
                    message: "Employee not found"
                });
            }

            // 👈 NAYA — delete se pehle assigned assets nikal lo
            const assignedAssets = await Asset.find({
                assignedTo: employee._id
            });


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


            // ================= NOTIFICATION ================= 👈 NAYA
            let notificationCount = await Notification.countDocuments();

            for (const assetItem of assignedAssets) {

                notificationCount = notificationCount + 1;

                await Notification.create({
                    id: notificationCount,
                    employee: employee._id,
                    type: "Asset Unassigned",
                    title: "Asset Unassigned",
                    message: `The asset ${assetItem.assetName} has been unassigned from you.`,
                    asset: assetItem._id,
                    repair: null,
                    isRead: false
                });

            }


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

    }
);

// ================= EMPLOYEE LOGIN =================
// PUBLIC ROUTE
// LOGIN PAR TOKEN MILEGA

router.post(
    "/login",
    async function (req, res) {

        try {

            const {
                email,
                password
            } = req.body;


            // Check email and password

            if (!email || !password) {

                return res.status(400).json({

                    message:
                        "Email and password are required"

                });

            }


            // Find employee by email

            const employee =
                await Employee.findOne({

                    email:
                        email.toLowerCase()

                });


            // Employee not found

            if (!employee) {

                return res.status(401).json({

                    message:
                        "Email is incorrect"

                });

            }


            // Check employee status

            if (
                employee.employeestatus !==
                "Active"
            ) {

                return res.status(403).json({

                    message:
                        "Employee account is not active"

                });

            }


            // Check password

            if (!employee.password) {

                return res.status(500).json({

                    message:
                        "Employee password is missing in database"

                });

            }


            const isCorrect =
                await bcrypt.compare(
                    password,
                    employee.password
                );


            // Wrong password

            if (!isCorrect) {

                return res.status(401).json({

                    message:
                        "Password is incorrect"

                });

            }


            // Check JWT secret

            if (!process.env.JWT_SECRET) {

                return res.status(500).json({

                    message:
                        "JWT_SECRET is not configured"

                });

            }


            // Create JWT token

            const token = jwt.sign(

                {

                    id: employee.id,

                    employeeId:
                        employee.employeeId,

                    role: "user"

                },

                process.env.JWT_SECRET,

                {

                    expiresIn: "1d"

                }

            );


            // Successful login

            res.json({

                message:
                    "Login successful",

                token: token,

                employee: {

                    id: employee.id,

                    employeeId:
                        employee.employeeId,

                    name:
                        employee.employeeName,

                    email:
                        employee.email,

                    phone:
                        employee.phone,

                    department:
                        employee.department,

                    role: "user",

                    status:
                        employee.employeestatus,
                    profilePhoto: employee.profilePhoto || ""

                }

            });

        } catch (error) {

            console.error(
                "Employee Login Error:",
                error
            );

            res.status(500).json({

                message:
                    "Login failed",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;