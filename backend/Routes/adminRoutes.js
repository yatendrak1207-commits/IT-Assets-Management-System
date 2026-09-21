const express = require("express");
const router = express.Router();
const Admin = require("../Models/Admin");
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
            "admin-" +
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

const {
    authMiddleware,
    requireRole
} = require("../middleware/authMiddleware");


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
                    message: "Email is incorrect"
                });

            }


            if (admin.status !== "Active") {

                return res.status(403).json({
                    message: "Admin account is not active"
                });

            }


            if (admin.lockUntil && admin.lockUntil > Date.now()) {

                const minutesLeft = Math.ceil(
                    (admin.lockUntil - Date.now()) / 60000
                );

                return res.status(403).json({
                    message:
                        "Account locked due to too many failed attempts. Try after "
                        + minutesLeft + " min"
                });

            }


            return bcrypt.compare(password, admin.password)
                .then(function (isPasswordCorrect) {

                    if (!isPasswordCorrect) {

                        admin.failedLoginAttempts =
                            (admin.failedLoginAttempts || 0) + 1;

                        if (admin.failedLoginAttempts >= 5) {

                            admin.lockUntil =
                                Date.now() + 15 * 60 * 1000;

                            admin.failedLoginAttempts = 0;

                            return admin.save().then(function () {

                                return res.status(403).json({
                                    message:
                                        "Too many failed attempts. Account locked for 15 minutes"
                                });

                            });

                        }

                        return admin.save().then(function () {

                            return res.status(401).json({
                                message: "Password is incorrect"
                            });

                        });

                    }


                    admin.failedLoginAttempts = 0;
                    admin.lockUntil = null;

                    return admin.save().then(function () {

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

                                status: admin.status,

                                profilePhoto: admin.profilePhoto || ""

                            }

                        });

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
// ================= ADMIN SIGNUP =================

router.post("/register", function (req, res) {

    const {
        name,
        email,
        phone,
        department,
        designation,
        password,
        adminKey
    } = req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !department ||
        !password ||
        !adminKey
    ) {
        return res.status(400).json({
            message: "All required fields are required"
        });
    }

    if (adminKey !== process.env.ADMIN_SIGNUP_KEY) {
        return res.status(403).json({
            message: "Invalid Admin Secret Key"
        });
    }

    Admin.findOne({
        email: email.toLowerCase()
    })
        .then(function (existingAdmin) {

            if (existingAdmin) {
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

                        id: Date.now(),

                        adminId: adminId,

                        name: name.trim(),

                        email: email.toLowerCase(),

                        phone: phone.trim(),

                        department: department.trim(),

                        designation: designation || "",

                        password: hashedPassword,

                        role: "admin",

                        status: "Active"

                    });

                    return newAdmin.save();

                });

        })
        .then(function (savedAdmin) {

            res.status(201).json({

                message: "Admin account created successfully",

                admin: {
                    id: savedAdmin.id,
                    adminId: savedAdmin.adminId,
                    name: savedAdmin.name,
                    email: savedAdmin.email,
                    phone: savedAdmin.phone,
                    department: savedAdmin.department,
                    designation: savedAdmin.designation,
                    role: savedAdmin.role,
                    status: savedAdmin.status
                }

            });

        })
        .catch(function (error) {

            console.log("Admin signup error:", error);

            res.status(500).json({
                message: "Admin signup failed",
                error: error
            });

        });

});
// =================================================
// ALL ROUTES BELOW THIS LINE ARE PROTECTED
// ONLY ADMIN CAN ACCESS
// =================================================

router.use(
    authMiddleware,
    requireRole("admin")
);


// ================= GET ALL ADMINS =================

router.get("/", 
     authMiddleware,
    requireRole("admin"),
    function (req, res) {
    Admin.find()
        .select("-password")
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
        .select("-password")
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

router.post("/", 
     authMiddleware,
    requireRole("user"),
    function (req, res) {

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

            res.status(201).json({

                id: savedAdmin.id,

                adminId: savedAdmin.adminId,

                name: savedAdmin.name,

                email: savedAdmin.email,

                phone: savedAdmin.phone,

                department: savedAdmin.department,

                designation: savedAdmin.designation,

                role: savedAdmin.role,

                status: savedAdmin.status

            });

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

router.put("/:id",
    authMiddleware,
    requireRole("admin"),
    function (req, res) {

    const {
        name,
        email,
        phone,
        password,
        department,
        designation,
        role,
        status,
        profilePhoto
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

            admin.profilePhoto=profilePhoto;


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


            res.json({

                id: updatedAdmin.id,

                adminId: updatedAdmin.adminId,

                name: updatedAdmin.name,

                email: updatedAdmin.email,

                phone: updatedAdmin.phone,

                department: updatedAdmin.department,

                designation: updatedAdmin.designation,

                role: updatedAdmin.role,

                status: updatedAdmin.status,

                profilePhoto: updatedAdmin.profilePhoto || ""

            });

        })
        .catch(function (error) {

            console.log("Error updating admin:", error);

            res.status(500).json({

                message: "Failed to update admin",

                error: error

            });

        });

});

// ================= UPLOAD ADMIN PROFILE PHOTO =================

router.post(
    "/:id/profile-photo",
    authMiddleware,
    requireRole("admin"),
    profileUpload.single("profilePhoto"),
    async function (req, res) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {

                return res.status(400).json({
                    message: "Invalid admin ID"
                });

            }

            if (!req.file) {

                return res.status(400).json({
                    message: "Please select an image"
                });

            }

            const admin = await Admin.findOne({
                id: id
            });

            if (!admin) {

                return res.status(404).json({
                    message: "Admin not found"
                });

            }

            // Delete old photo if it exists

            if (admin.profilePhoto) {

                const oldPhotoPath =
                    path.join(
                        __dirname,
                        "..",
                        admin.profilePhoto
                    );

                if (fs.existsSync(oldPhotoPath)) {

                    fs.unlinkSync(oldPhotoPath);

                }

            }

            const photoPath =
                "/uploads/profile/" +
                req.file.filename;

            admin.profilePhoto = photoPath;

            await admin.save();

            res.json({

                message:
                    "Profile photo uploaded successfully",

                profilePhoto:
                    photoPath

            });

        } catch (error) {

            console.log(
                "Admin profile photo upload error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to upload profile photo",

                error:
                    error.message

            });

        }

    }
);

// ================= REMOVE ADMIN PROFILE PHOTO =================

router.delete(
    "/:id/profile-photo",
    authMiddleware,
    requireRole("admin"),
    async function (req, res) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid admin ID"
                });
            }

            const admin = await Admin.findOne({
                id: id
            });

            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found"
                });
            }

            // Delete photo file from uploads folder
            if (admin.profilePhoto) {

                const photoPath = path.join(
                    __dirname,
                    "..",
                    admin.profilePhoto
                );

                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            }

            // Remove photo path from database
            admin.profilePhoto = "";

            await admin.save();

            res.json({
                message: "Profile photo removed successfully",
                profilePhoto: ""
            });

        } catch (error) {

            console.log(
                "Admin profile photo remove error:",
                error
            );

            res.status(500).json({
                message: "Failed to remove profile photo",
                error: error.message
            });
        }
    }
);
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

                message:
                    "Admin settings updated successfully",

                settings:
                    updatedAdmin.settings

            });

        })
        .catch(function (error) {

            console.log(
                "Error updating admin settings:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to update admin settings",

                error: error

            });

        });

});


// ================= DELETE ADMIN =================

router.delete("/:id",
     authMiddleware,
    requireRole("admin"),
    function (req, res) {

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

                message: "Admin deleted successfully"

            });

        })
        .catch(function (error) {

            console.log(
                "Error deleting admin:",
                error
            );

            res.status(500).json({

                message: "Failed to delete admin",

                error: error

            });

        });

});
// ================= CHANGE PASSWORD (verifies current password) =================

router.put("/:id/change-password", function (req, res) {

    const {
        currentPassword,
        newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {

        return res.status(400).json({
            message: "Current password and new password are required"
        });

    }

    Admin.findOne({
        id: Number(req.params.id)
    })
        .then(function (admin) {

            if (!admin) {

                return res.status(404).json({
                    message: "Admin not found"
                });

            }

            return bcrypt.compare(currentPassword, admin.password)
                .then(function (isMatch) {

                    if (!isMatch) {

                        return res.status(401).json({
                            message: "Current password is incorrect"
                        });

                    }

                    return bcrypt.hash(newPassword, 10)
                        .then(function (hashedPassword) {

                            admin.password = hashedPassword;

                            return admin.save();

                        })
                        .then(function () {

                            res.json({
                                message: "Password changed successfully"
                            });

                        });

                });

        })
        .catch(function (error) {

            console.log("Change password error:", error);

            res.status(500).json({
                message: "Failed to change password",
                error: error
            });

        });

});



module.exports = router;