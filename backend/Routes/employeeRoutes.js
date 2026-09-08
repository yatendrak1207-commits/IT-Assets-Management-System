
const express = require("express");

const router = express.Router();

const Employee = require("../Models/Employee");

// GET
router.get("/", async function (req, res) {

  try {

    const employees = await Employee.find();

    res.json(employees);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch employee",
      error: error
    });

  }

});


// POST
router.post("/", async function (req, res) {

  const {
    id,
    employeeId,
    employeeName,
    department,
    phone,
    email,
    assignedAsset,
    employeestatus
  } = req.body;


  // Required fields check
  if (
    id === undefined ||
    employeeId === undefined ||
    !employeeName ||
    !department ||
    !phone ||
    !email ||
    !assignedAsset ||
    !employeestatus
  ) {

    return res.status(400).json({
      message: "All employee fields are required"
    });

  }


  // Phone validation
  const phonePattern = /^[0-9]{10}$/;

  if (!phonePattern.test(phone)) {

    return res.status(400).json({
      message: "Phone number must be exactly 10 digits"
    });

  }


  // Number validation
  if (typeof id !== "number" || typeof employeeId !== "number") {

    return res.status(400).json({
      message: "id and employeeId must be numbers"
    });

  }


  // Duplicate validation
  const existingemployee = await Employee.findOne({
    $or: [
      { id: id },
      { employeeId: employeeId }
    ]
  });


  if (existingemployee) {

    return res.status(409).json({
      message: "id or employeeId already exists"
    });

  }


  // Create employee
  const newEmployee = new Employee({

    id,
    employeeId,
    employeeName,
    department,
    phone,
    email,
    assignedAsset,
    employeestatus

  });


  newEmployee.save()

    .then(function (employee) {

      res.status(201).json(employee);

    })

    .catch(function (error) {

      res.status(500).json({
        message: "Failed to create employee",
        error: error
      });

    });

});


// UPDATE
router.put("/:id", function (req, res) {

  const id = Number(req.params.id);


  // ID validation
  if (isNaN(id)) {

    return res.status(400).json({
      message: "id must be a number"
    });

  }


  Employee.findOne({ id: id })

    .then(function (employee) {

      if (!employee) {

        return res.status(404).json({
          message: "Employee not found"
        });

      }


      if (req.body.employeeName !== undefined) {

        employee.employeeName = req.body.employeeName;

      }


      if (req.body.department !== undefined) {

        employee.department = req.body.department;

      }


      if (req.body.phone !== undefined) {

        const phonePattern = /^[0-9]{10}$/;

        if (!phonePattern.test(req.body.phone)) {

          return res.status(400).json({
            message: "Phone number must be exactly 10 digits"
          });

        }

        employee.phone = req.body.phone;

      }


      if (req.body.email !== undefined) {

        employee.email = req.body.email;

      }


      // Assigned Asset is just a normal field
      if (req.body.assignedAsset !== undefined) {

        employee.assignedAsset = req.body.assignedAsset;

      }


      // Employee Status is just a normal field
      if (req.body.employeestatus !== undefined) {

        employee.employeestatus = req.body.employeestatus;

      }


      employee.save()

        .then(function (updatedEmployee) {

          res.json(updatedEmployee);

        })

        .catch(function (error) {

          res.status(500).json({
            message: "Failed to update employee",
            error: error
          });

        });

    })

    .catch(function (error) {

      res.status(500).json({
        message: "Failed to find employee",
        error: error
      });

    });

});


// DELETE
router.delete("/:id", function (req, res) {

  const id = Number(req.params.id);


  Employee.findOne({ id: id })

    .then(function (employee) {

      if (!employee) {

        return res.status(404).json({
          message: "Employee not found"
        });

      }

      return employee.deleteOne();

    })

    .then(function () {

      res.json({
        message: "Employee deleted successfully"
      });

    })

    .catch(function (error) {

      res.status(500).json({
        message: "Failed to delete employee",
        error: error
      });

    });

});


module.exports = router;
