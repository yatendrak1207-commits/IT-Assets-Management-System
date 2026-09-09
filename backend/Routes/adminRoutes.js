const express = require("express");
const router = express.Router();
const Admin = require("../Models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= GET ALL ADMINS =================
router.get("/", function (req, res) {

    Admin.find()
        .then(function (admins) {
            res.json(admins);
        })
        .catch(function (error) {
            res.status(500).json({
                message: "Failed to fetch admins",
                error: error
            });
        });

});


// ================= GET ADMIN BY ID =================
router.get("/:id", function (req, res) {

    Admin.findOne({
        id: Number(req.params.id)
    })
        .then(function (admin) {

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            res.json(admin);

        })
        .catch(function (error) {

            res.status(500).json({
                message: "Failed to fetch admin",
                error: error
            });

        });

});


// ================= POST ADMIN =================
router.post("/", function (req, res) {

    const {
        id,
        name,
        email,
        phone,
        password,
        department,
        designation,
        role,
        status
    } = req.body;


    if (!id || !name || !email || !phone || !password) {

        return res.status(400).json({
            message: "All required fields are required"
        });

    }


    Admin.findOne({
        id: Number(id)
    })
        .then(function (existingAdmin) {

            if (existingAdmin) {

                return res.status(409).json({
                    message: "Admin with this ID already exists"
                });

            }

            return Admin.findOne({
                email: email.toLowerCase()
            });

        })
        .then(function (existingEmail) {

            if (existingEmail) {

                return res.status(409).json({
                    message: "Admin with this email already exists"
                });

            }

            return Admin.findOne({
                adminId: /^ADM\d+$/
            }).sort({
                adminId: -1
            });

        })
        .then(function (lastAdmin) {

            let nextNumber = 1;

            if (lastAdmin && lastAdmin.adminId) {

                const lastNumber = parseInt(
                    lastAdmin.adminId.replace("ADM", ""),
                    10
                );

                nextNumber = lastNumber + 1;

            }


            const adminId =
                "ADM" + String(nextNumber).padStart(3, "0");


            return bcrypt.hash(password, 10)
                .then(function (hashedPassword) {

                    const newAdmin = new Admin({

                        id: Number(id),

                        adminId: adminId,

                        name: name,

                        email: email.toLowerCase(),

                        phone: phone,

                        department: department,

                        designation: designation,

                        password: hashedPassword,

                        role: role || "admin",

                        status: status || "Active"

                    });


                    return newAdmin.save();

                });

        })
        .then(function (savedAdmin) {

            res.status(201).json(savedAdmin);

        })
        .catch(function (error) {

            console.log("Error creating admin:", error);

            res.status(500).json({
                message: "Failed to create admin",
                error: error
            });

        });

});


// ================= PUT ADMIN =================
router.put("/:id", function (req, res) {

    const {
        name,
        email,
        phone,
        password,
        department,
        designation,
        role,
        status
    } = req.body;


    Admin.findOne({
        id: Number(req.params.id)
    })
        .then(function (admin) {

            if (!admin) {

                return res.status(404).json({
                    message: "Admin not found"
                });

            }


            admin.name = name;
            admin.email = email
                ? email.toLowerCase()
                : admin.email;

            admin.phone = phone;
            admin.department = department;
            admin.designation = designation;
            admin.role = role;
            admin.status = status;


            if (password) {

                return bcrypt.hash(password, 10)
                    .then(function (hashedPassword) {

                        admin.password = hashedPassword;

                        return admin.save();

                    });

            }


            return admin.save();

        })
        .then(function (updatedAdmin) {

            if (!updatedAdmin) {
                return;
            }

            res.json(updatedAdmin);

        })
        .catch(function (error) {

            console.log("Error updating admin:", error);

            res.status(500).json({
                message: "Failed to update admin",
                error: error
            });

        });

});

// ================= GET ADMIN SETTINGS =================
router.get("/:id/settings", function (req, res) {

    Admin.findOne({
        id: Number(req.params.id)
    })
        .then(function (admin) {

            if (!admin) {

                return res.status(404).json({
                    message: "Admin not found"
                });

            }

            res.json(admin.settings);

        })
        .catch(function (error) {

            console.log("Error fetching admin settings:", error);

            res.status(500).json({
                message: "Failed to fetch admin settings",
                error: error
            });

        });

});


// ================= UPDATE ADMIN SETTINGS =================
router.put("/:id/settings", function (req, res) {

    const {
        general,
        notifications,
        display,
        security
    } = req.body;


    Admin.findOne({
        id: Number(req.params.id)
    })
        .then(function (admin) {

            if (!admin) {

                return res.status(404).json({
                    message: "Admin not found"
                });

            }


            if (general) {

                admin.settings.general.company =
                    general.company;

                admin.settings.general.companyEmail =
                    general.companyEmail;

                admin.settings.general.companyno =
                    general.companyno;

                admin.settings.general.companyAddress =
                    general.companyAddress;

            }


            if (notifications) {

                admin.settings.notifications.emailNotification =
                    notifications.emailNotification;

                admin.settings.notifications.complaintNotification =
                    notifications.complaintNotification;

                admin.settings.notifications.repairNotification =
                    notifications.repairNotification;

                admin.settings.notifications.assetNotification =
                    notifications.assetNotification;

                admin.settings.notifications.lowStockAlert =
                    notifications.lowStockAlert;

            }


            if (display) {

                admin.settings.display.theme =
                    display.theme;

                admin.settings.display.items =
                    display.items;

                admin.settings.display.dateFormat =
                    display.dateFormat;

            }


            if (security) {

                admin.settings.security.twofactor =
                    security.twofactor;

                admin.settings.security.logout =
                    security.logout;

            }


            return admin.save();

        })
        .then(function (updatedAdmin) {

            if (!updatedAdmin) {
                return;
            }

            res.json({
                message: "Admin settings updated successfully",
                settings: updatedAdmin.settings
            });

        })
        .catch(function (error) {

            console.log("Error updating admin settings:", error);

            res.status(500).json({
                message: "Failed to update admin settings",
                error: error
            });

        });

});



// ================= DELETE ADMIN =================
router.delete("/:id", function (req, res) {

    Admin.findOneAndDelete({
        id: Number(req.params.id)
    })
        .then(function (deletedAdmin) {

            if (!deletedAdmin) {

                return res.status(404).json({
                    message: "Admin not found"
                });

            }

            res.json({
                message: "Admin deleted successfully",
                admin: deletedAdmin
            });

        })
        .catch(function (error) {

            console.log("Error deleting admin:", error);

            res.status(500).json({
                message: "Failed to delete admin",
                error: error
            });

        });

});


// ================= ADMIN LOGIN =================
router.post("/login", function (req, res) {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required"
        });

    }


    Admin.findOne({
        email: email.toLowerCase()
    })
        .then(function (admin) {

            if (!admin) {

                return res.status(401).json({
                    message: "Invalid email or password"
                });

            }


            if (admin.status !== "Active") {

                return res.status(403).json({
                    message: "Admin account is not active"
                });

            }


            return bcrypt.compare(password, admin.password)
                .then(function (isPasswordCorrect) {

                    if (!isPasswordCorrect) {

                        return res.status(401).json({
                            message: "Invalid email or password"
                        });

                    }


                    const token = jwt.sign(

                        {
                            id: admin.id,
                            adminId: admin.adminId,
                            role: admin.role
                        },

                        process.env.JWT_SECRET,

                        {
                            expiresIn: "1d"
                        }

                    );


                    res.json({

                        message: "Login successful",

                        token: token,

                        admin: {

                            id: admin.id,

                            adminId: admin.adminId,

                            name: admin.name,

                            email: admin.email,

                            phone: admin.phone,

                            role: admin.role,

                            status: admin.status

                        }

                    });

                });

        })
        .catch(function (error) {

            console.log("Admin login error:", error);

            res.status(500).json({

                message: "Login failed",

                error: error

            });

        });

});


module.exports = router;