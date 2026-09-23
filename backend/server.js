const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
const cors = require("cors");
const path = require("path");

const assetRoutes = require("./Routes/assetRoutes");
const repairRoutes = require("./Routes/repairRoutes");
const supplierRoutes = require("./Routes/supplierRoutes");
const complaintRoutes = require("./Routes/complaintRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const employeeRoutes = require("./Routes/employeeRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");

dns.setServers(["8.8.8.8"]);

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(function () {

        console.log("Mongo DB connected succesfully");

    })
    .catch(function (error) {

        console.log("MongoDB connection failed:", error);

    });

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());


// ================= PROFILE IMAGE FOLDER =================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ================= ROUTES =================

app.use("/api/assets", assetRoutes);

app.use("/api/repairs", repairRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/admins", adminRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/notifications", notificationRoutes);


// ================= TEST ROUTE =================

app.get("/", function (req, res) {

    res.send("IT Assets Management Backend is running!");

});


// ================= SERVER START =================

app.listen(PORT, function () {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});