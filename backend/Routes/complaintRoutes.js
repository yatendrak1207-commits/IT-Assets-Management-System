
const express = require("express");
const router = express.Router();

const Complaint = require("../Models/Complain");
const Asset = require("../Models/Asset");
const Employee = require("../Models/Employee");

const {
  authMiddleware,
  requireRole
} = require("../middleware/authMiddleware");


// ================= GET ALL COMPLAINTS - ADMIN =================

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  async function (req, res) {

    try {

      const complaints = await Complaint.find()
        .populate({
          path: "employee",
          select: "-password"
        })
        .populate("asset");

      res.json(complaints);

    } catch (error) {

      res.status(500).json({
        message: "Failed to fetch complaints",
        error: error
      });

    }

  }
);


// ================= GET MY COMPLAINTS - EMPLOYEE =================

router.get(
  "/my",
  authMiddleware,
  requireRole("user"),
  async function (req, res) {

    try {

      const employee = await Employee.findOne({
        id: req.user.id
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      const complaints = await Complaint.find({
        employee: employee._id
      })
        .populate({
          path: "employee",
          select: "-password"
        })
        .populate("asset");

      res.json(complaints);

    } catch (error) {

      res.status(500).json({
        message: "Failed to fetch my complaints",
        error: error
      });

    }

  }
);


// ================= POST - EMPLOYEE / ADMIN =================

router.post(
  "/",
  authMiddleware,
  async function (req, res) {

    try {

      const {
        id,
        employee,
        asset,
        complaint,
        complaintDate
      } = req.body;


      // ================= EMPLOYEE =================

      if (req.user.role === "user") {

        if (
          id === undefined ||
          !asset ||
          !complaint ||
          !complaintDate
        ) {
          return res.status(400).json({
            message: "All complaint fields are required"
          });
        }


        const employeeDoc = await Employee.findOne({
          id: req.user.id
        });

        if (!employeeDoc) {
          return res.status(404).json({
            message: "Employee not found"
          });
        }


        const assetDoc = await Asset.findById(asset);

        if (!assetDoc) {
          return res.status(404).json({
            message: "Asset not found"
          });
        }


        // Employee can complain only about own assigned asset
        if (
          !assetDoc.assignedTo ||
          assetDoc.assignedTo.toString() !== employeeDoc._id.toString()
        ) {
          return res.status(403).json({
            message: "You can only create a complaint for your assigned asset"
          });
        }


        const existing = await Complaint.findOne({
          id: id
        });

        if (existing) {
          return res.status(409).json({
            message: "id already exists"
          });
        }


        const newComplaint = new Complaint({
          id,
          employee: employeeDoc._id,
          asset: assetDoc._id,
          complaint,
          complaintDate,
          status: "Pending"
        });


        const savedComplaint = await newComplaint.save();

        const populated = await savedComplaint.populate([
          {
            path: "employee",
            select: "-password"
          },
          {
            path: "asset"
          }
        ]);

        return res.status(201).json(populated);
      }


      // ================= ADMIN =================

      if (req.user.role === "admin") {

        if (
          id === undefined ||
          !employee ||
          !asset ||
          !complaint ||
          !complaintDate
        ) {
          return res.status(400).json({
            message: "All complaint fields are required"
          });
        }


        const employeeDoc = await Employee.findById(employee);

        if (!employeeDoc) {
          return res.status(404).json({
            message: "Employee not found"
          });
        }


        const assetDoc = await Asset.findById(asset);

        if (!assetDoc) {
          return res.status(404).json({
            message: "Asset not found"
          });
        }


        const existing = await Complaint.findOne({
          id: id
        });

        if (existing) {
          return res.status(409).json({
            message: "id already exists"
          });
        }


        const newComplaint = new Complaint({
          id,
          employee: employeeDoc._id,
          asset: assetDoc._id,
          complaint,
          complaintDate,
          status: "Pending"
        });


        const savedComplaint = await newComplaint.save();

        const populated = await savedComplaint.populate([
          {
            path: "employee",
            select: "-password"
          },
          {
            path: "asset"
          }
        ]);

        return res.status(201).json(populated);
      }


      return res.status(403).json({
        message: "Access denied"
      });

    } catch (error) {

      res.status(500).json({
        message: "Failed to create complaint",
        error: error
      });

    }

  }
);


// ================= PUT - ADMIN =================

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  async function (req, res) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "id must be a number"
      });
    }

    try {

      const complaintDoc = await Complaint.findOne({
        id: id
      });

      if (!complaintDoc) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }


      if (req.body.employee !== undefined) {

        const employeeDoc = await Employee.findById(
          req.body.employee
        );

        if (!employeeDoc) {
          return res.status(404).json({
            message: "Employee not found"
          });
        }

        complaintDoc.employee = employeeDoc._id;
      }


      if (req.body.asset !== undefined) {

        const assetDoc = await Asset.findById(
          req.body.asset
        );

        if (!assetDoc) {
          return res.status(404).json({
            message: "Asset not found"
          });
        }

        complaintDoc.asset = assetDoc._id;
      }


      if (req.body.complaint !== undefined) {
        complaintDoc.complaint = req.body.complaint;
      }


      if (req.body.complaintDate !== undefined) {
        complaintDoc.complaintDate = req.body.complaintDate;
      }


      if (req.body.status !== undefined) {
        complaintDoc.status = req.body.status;
      }


      const updatedComplaint = await complaintDoc.save();

      const populated = await updatedComplaint.populate([
        {
          path: "employee",
          select: "-password"
        },
        {
          path: "asset"
        }
      ]);

      res.json(populated);

    } catch (error) {

      res.status(500).json({
        message: "Failed to update complaint",
        error: error
      });

    }

  }
);


// ================= DELETE - ADMIN =================

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  async function (req, res) {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "id must be a number"
      });
    }

    try {

      const complaint = await Complaint.findOne({
        id: id
      });

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }

      await complaint.deleteOne();

      res.json({
        message: "Complaint deleted successfully"
      });

    } catch (error) {

      res.status(500).json({
        message: "Failed to delete complaint",
        error: error
      });

    }

  }
);


module.exports = router;
