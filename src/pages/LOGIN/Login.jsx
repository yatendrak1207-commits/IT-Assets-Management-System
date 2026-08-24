import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complaints } from "../../data/data";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin() {
    //admin
    if (email === "admin@company.com" && password === "admin123") {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          role: "admin",
          email: email,
        }),
      );

      navigate("/");
      return;
    }
    // user
    const user = complaints.find(function (item) {
      return item.email === email && item.password === password;
    });

    if (user) {
      console.log(user);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: 1,
          employeeId: user.employeeId,
          password: user.password,
          assetId: user.assetId,
          assetName: user.assetName,
          category: user.category,
          assigned: user.assigned,
          employeeName: user.employeeName,
          employeeStatus: user.employeeStatus,
          department: user.department,
          email: user.email,
          phone: user.phone,
          complaint: user.complaint,
          complaintDate: user.complaintDate,
          repairDate: user.repairDate,
          status: user.status,
          action: user.action,

          supplierId: user.supplierId,
          supplierName: user.supplierName,
          supplierStatus: user.supplierStatus,
          companyName: user.companyName,
          companyEmail: user.companyEmail,
          companyContactNumber: user.companyContactNumber,
          companyAddress: user.companyAddress,
          assetsSupplied: user.assetsSupplied,

          repairId: user.repairId,
          repairCenter: user.repairCenter,
          repairStatus: user.repairStatus,
          estimatedCost: user.estimatedCost,
          description: user.description,
          role: "user",
        }),
      );

      navigate("/user");
    } else {
      alert("Invalid Email or Password");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>

        <div className="login-field">
          <label>Username</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="login-field">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
