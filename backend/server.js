const express = require("express");

const app = express();

const PORT = 5000;

// JSON data read karne ke liye
app.use(express.json());

// Test route
app.get("/", function (req, res) {
  res.send("IT Assets Management Backend is running!");
});

// Server start
app.listen(PORT, function () {
  console.log(`Server running on http://localhost:${PORT}`);
});