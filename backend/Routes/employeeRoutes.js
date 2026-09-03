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
router.post("/", function (req, res) {

  const newEmployee = new Employee(req.body);

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

  Employee.findOne({ id: id })
    .then(function (employee) {

      if (!employee) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      if (req.body.name !== undefined) {
    employee.name = req.body.name;
}

if (req.body.department !== undefined) {
    employee.department = req.body.department;
}

if (req.body.phoneno !== undefined) {
    employee.phoneno = req.body.phoneno;
}

if (req.body.email !== undefined) {
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