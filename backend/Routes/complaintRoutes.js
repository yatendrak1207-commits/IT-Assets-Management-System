const express = require("express");
const router = express.Router();
const Complaint = require("../Models/Complain");

router.get("/", function (req, res) {

  Complaint.find()
    .then(function (complaints) {
      res.json(complaints);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to fetch complaints",
        error: error
      });
    });

});

module.exports = router;