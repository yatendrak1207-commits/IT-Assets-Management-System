const express = require("express");
const router = express.Router();
const Employee = require("../Models/Employee");

//GET
router.get("/", function (req, res) {

  Employee.find()
    .then(function (employee) {
      res.json(employee);
    })
    .catch(function (error) {
      res.status(500).json({
        message: "Failed to fetch employee",
        error: error
      });
    });

});
// POST - Create new asset
router.post("/",async function (req, res) {

  const {
    id,
    employeeId,
    employeeName,
    department,
    phone,
    email
  } = req.body;

  // Required fields check
  if (
    id === undefined ||
    employeeId === undefined ||
    !employeeName ||
    !department ||
    !phone ||
    !email
  ) {
    return res.status(400).json({
      message: "All employee fields are required"
    });
  }
  // Email validation
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
if (!emailPattern.test(email)) {
  return res.status(400).json({
    message: "Invalid email format"
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

 const newEmployee = new Employee({
  id,
  employeeId,
  employeeName,
  department,
  phone,
  email
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
        // Phone validation
      const phonePattern = /^[0-9]{10}$/;

      if (!phonePattern.test(req.body.phone)) {
        return res.status(400).json({
          message: "Phone number must be exactly 10 digits"
        });
      }
    employee.phone = req.body.phone;
      }

      if (req.body.email !== undefined) {
         // Email validation
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailPattern.test(req.body.email)) {
          return res.status(400).json({
            message: "Invalid email format"
          });
        }
    employee.email = req.body.email;
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
    .then(function (deletedEmployee) {
      res.json({
        message: "Employee deleted successfully",
        
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