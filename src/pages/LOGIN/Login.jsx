import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complaints } from "../../data/data";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // admin
    if (email === "admin@company.com" && password === "admin123") {
      sessionStorage.setItem(
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
      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          ...user,
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
