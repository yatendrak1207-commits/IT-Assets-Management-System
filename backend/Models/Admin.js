
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    id: Number,

    adminId: {
        type: String,
        unique: true
    },

    name: String,

    email: {
        type: String,
        unique: true
    },

    phone: String,

    department: String,

    designation: String,

    password: String,

    role: {
        type: String,
        default: "admin"
    },

    status: {
        type: String,
        default: "Active"
    },

    // ================= ADMIN SETTINGS =================
    settings: {
        general: {
            company: {
                type: String,
                default: "IT Assets World"
            },
            companyEmail: {
                type: String,
                default: "info@itassetsworld.com"
            },
            companyno: {
                type: String,
                default: "+91 9310483219"
            },
            companyAddress: {
                type: String,
                default: "A-19, Ground Floor, FIEE Complex, Suite No-1041, Okhla Industrial Area Phase-2, New Delhi – 110020"
            }
        },

        notifications: {
            emailNotification: {
                type: Boolean,
                default: false
            },
            complaintNotification: {
                type: Boolean,
                default: false
            },
            repairNotification: {
                type: Boolean,
                default: false
            },
            assetNotification: {
                type: Boolean,
                default: false
            },
            lowStockAlert: {
                type: Boolean,
                default: false
            }
        },

        display: {
            theme: {
                type: String,
                default: "day"
            },
            items: {
                type: String,
                default: "one"
            },
            dateFormat: {
                type: String,
                default: "days"
            }
        },

        security: {
            twofactor: {
                type: Boolean,
                default: false
            },
            logout: {
                type: String,
                default: "Never"
            }
        }
    }
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

