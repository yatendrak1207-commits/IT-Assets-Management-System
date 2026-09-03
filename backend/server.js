const express = require("express");
const mongoose=require("mongoose");
const dns = require("dns");

const assetRoutes = require("./Routes/assetRoutes");
const employeeRoutes = require("./Routes/employeeRoutes");

dns.setServers(["8.8.8.8"]);

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)
  .then(function(){
    console.log("Mongo DB connected succesfully");
  })
  .catch(function(error){
    console.log("MongoDB connection failed:", error);
  });

  

const app = express();

const PORT = 5000;

// JSON data read karne ke liye
app.use(express.json());
app.use("/api/assets", assetRoutes);
app.use("/api/employees", employeeRoutes);


// Test route
app.get("/", function (req, res) {
  res.send("IT Assets Management Backend is running!");
});


// Server start
app.listen(PORT, function () {
  console.log(`Server running on http://localhost:${PORT}`);
});