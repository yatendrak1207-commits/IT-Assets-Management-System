import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    // ================= ADMIN LOGIN =================

    fetch("http://localhost:5000/api/admins/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return {
            ok: response.ok,
            data: data,
          };
        });
      })
      .then(function (adminResult) {
        // Admin login successful
        if (adminResult.ok) {
          const data = adminResult.data;

          sessionStorage.setItem("token", data.token);

          sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify({
              ...data.admin,
              role: "admin",
            }),
          );

          navigate("/");

          return;
        }

        // ================= EMPLOYEE LOGIN =================

        return fetch("http://localhost:5000/api/employees/login", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then(function (response) {
            return response.json().then(function (data) {
              return {
                ok: response.ok,
                data: data,
              };
            });
          })
          .then(function (employeeResult) {
            if (!employeeResult.ok) {
              alert(employeeResult.data.message || "Invalid Email or Password");

              return;
            }

            const data = employeeResult.data;

            // JWT token save
            sessionStorage.setItem("token", data.token);

            // Employee data save
            sessionStorage.setItem(
              "loggedInUser",
              JSON.stringify({
                ...data.employee,
                role: "user",
              }),
            );

            // User dashboard
            navigate("/user");
          });
      })
      .catch(function (error) {
        console.log("Login error:", error);

        alert("Server se connection nahi ho raha");
      });
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Username</label>

            <input
              type="email"
              name="login-email"
              autoComplete="off"
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
              name="login-password"
              autoComplete="new-password"
              placeholder="Enter your password"
              value={password}
              onChange={function (e) {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
