import React, { useState } from "react";
import loginBg from "../../assets/itbga.jpeg";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (!email && !password) {
      alert("Please enter your email and password");

      return;
    }

    if (!email) {
      alert("Please enter your email");
      return;
    }

    if (!password) {
      alert("Please enter your password");
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

            sessionStorage.setItem("token", data.token);

            sessionStorage.setItem(
              "loggedInUser",
              JSON.stringify({
                ...data.employee,
                role: "user",
              }),
            );

            navigate("/user");
          });
      })
      .catch(function (error) {
        console.log("Login error:", error);
        alert("Server se connection nahi ho raha");
      });
  }

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Username :</label>

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
            <label>Password :</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="login-password"
                autoComplete="new-password"
                placeholder="Enter your password"
                value={password}
                onChange={function (e) {
                  setPassword(e.target.value);
                }}
              />

              <button
                type="button"
                className="password-eye"
                onClick={function () {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="login-buttons">
            <button type="submit" className="login-btn">
              Login
            </button>

            <button
              type="button"
              className="signin-btn"
              onClick={function () {
                navigate("/signup");
              }}
            >
              Sign-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
