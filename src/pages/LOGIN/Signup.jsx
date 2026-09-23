import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { FaArrowLeft, FaEye, FaEyeSlash, FaRedo } from "react-icons/fa";

import PhoneInputModule from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { isValidPhoneNumber } from "libphonenumber-js";

import "./Signup.css";

import API_URL from "../../config/api";

const PhoneInput = PhoneInputModule.default || PhoneInputModule;

function Signup() {
  const navigate = useNavigate();

  const canvasRef = useRef(null);

  const [accountType, setAccountType] = useState("");

  const [step, setStep] = useState(0);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [name, setName] = useState("");

  const [department, setDepartment] = useState("");

  const [phone, setPhone] = useState("");

  const [captcha, setCaptcha] = useState("");

  const [captchaInput, setCaptchaInput] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorField, setErrorField] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [adminKey, setAdminKey] = useState("");

  const [phoneCountry, setPhoneCountry] = useState({
    countryCode: "in",
    dialCode: "91",
  });

  // ================= CAPTCHA CHARACTERS =================

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";

  // ================= GENERATE CAPTCHA =================

  function generateCaptcha() {
    let newCaptcha = "";

    for (let i = 0; i < 5; i++) {
      newCaptcha += characters[Math.floor(Math.random() * characters.length)];
    }

    setCaptcha(newCaptcha);

    setCaptchaInput("");
  }

  // ================= CAPTCHA CANVAS =================

  useEffect(
    function () {
      if (step !== 3 || !captcha) {
        return;
      }

      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");

      canvas.width = 300;
      canvas.height = 90;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ================= BACKGROUND =================

      ctx.fillStyle = "#f4f7f7";

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ================= RANDOM DOTS =================

      for (let i = 0; i < 35; i++) {
        ctx.beginPath();

        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 2 + 1,
          0,
          Math.PI * 2,
        );

        ctx.fillStyle = "rgba(13, 148, 136, 0.25)";

        ctx.fill();
      }

      // ================= RANDOM LINES =================

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();

        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);

        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);

        ctx.strokeStyle = "rgba(30, 70, 70, 0.35)";

        ctx.lineWidth = 1.5;

        ctx.stroke();
      }

      // ================= CAPTCHA CHARACTERS =================

      for (let i = 0; i < captcha.length; i++) {
        ctx.save();

        const x = 35 + i * 55;

        const y = 60;

        const rotation = (Math.random() * 30 - 15) * (Math.PI / 180);

        ctx.translate(x, y);

        ctx.rotate(rotation);

        ctx.font = "bold " + (42 + Math.floor(Math.random() * 8)) + "px Arial";

        ctx.fillStyle = i % 2 === 0 ? "#063b36" : "#294050";

        ctx.fillText(captcha[i], 0, 0);

        ctx.restore();
      }

      // ================= DISTORTION LINE =================

      ctx.beginPath();

      ctx.moveTo(10, 70);

      ctx.bezierCurveTo(80, 20, 180, 100, 290, 30);

      ctx.strokeStyle = "rgba(13, 148, 136, 0.45)";

      ctx.lineWidth = 2;

      ctx.stroke();
    },
    [captcha, step],
  );

  // ================= START SIGNUP =================

  function startSignup(type) {
    setAccountType(type);

    setStep(1);
  }

  // ================= NEXT =================

  async function handleNext() {
    // ================= STEP 1 =================

    if (step === 1) {
      if (!email.trim()) {
        setErrorField("email");
        setErrorMessage("Please enter your email");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        setErrorField("email");
        setErrorMessage("Please enter a valid email address");

        return;
      }

      if (!password) {
        setErrorField("password");
        setErrorMessage("Please enter your password");

        return;
      }

      if (password.length < 6) {
        setErrorField("password");
        setErrorMessage("Password must be at least 6 characters");

        return;
      }

      setStep(2);

      return;
    }

    // ================= STEP 2 =================

    if (step === 2) {
      if (!name.trim()) {
        setErrorField("name");
        setErrorMessage("Please enter your name");

        return;
      }

      if (!department.trim()) {
        setErrorField("department");
        setErrorMessage("Please select your department");
        return;

        return;
      }

      if (!phone.trim()) {
        setErrorField("phone");
        setErrorMessage("Please enter your phone number");
        return;
      }

      // ================= PHONE VALIDATION =================

      let cleanPhoneNumber = phone.replace(/\s/g, "");

      if (!cleanPhoneNumber.startsWith("+")) {
        cleanPhoneNumber = "+" + phoneCountry.dialCode + cleanPhoneNumber;
      }

      if (!isValidPhoneNumber(cleanPhoneNumber)) {
        setErrorField("phone");
        setErrorMessage("Please enter a valid phone number");

        return;
      }

      // ================= CAPTCHA =================

      generateCaptcha();

      setStep(3);

      return;
    }
    if (step === 3) {
      if (!captchaInput.trim()) {
        setErrorField("captcha");
        setErrorMessage("Please enter the captcha");
        return;
      }

      if (captchaInput.trim().toUpperCase() !== captcha.toUpperCase()) {
        setErrorField("captcha");
        setErrorMessage("Captcha is incorrect");
        return;
      }

      if (accountType === "admin" && !adminKey.trim()) {
        setErrorField("adminKey");
        setErrorMessage("Please enter the admin key");
        return;
      }

      setErrorField("");
      setErrorMessage("");

      setLoading(true);

      try {
        const registerUrl =
          accountType === "admin"
            ? `${API_URL}/api/admins/register`
            : `${API_URL}/api/employees/register`;
        const response = await fetch(registerUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
            department: department,
            phone: phone,
            ...(accountType === "admin"
              ? {
                  name: name.trim(),
                  adminKey: adminKey.trim(),
                }
              : {
                  employeeName: name.trim(),
                }),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorField("submit");
          setErrorMessage(data.message || "Registration failed");
          return;
        }

        alert("Account created successfully!");

        navigate("/login");
      } catch (error) {
        setErrorField("submit");
        setErrorMessage("Server error. Please try again.");
      } finally {
        setLoading(false);
      }

      return;
    }
  }

  // ================= BACK =================

  function handleBack() {
    if (step === 1) {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setStep(0);

      return;
    }

    if (step === 2) {
      setName("");
      setDepartment("");
      setPhone("");
      setStep(1);

      return;
    }

    if (step === 3) {
      setCaptcha("");
      setAdminKey("");
      setStep(2);

      return;
    }
  }

  // ================= SUBMIT =================

  async function handleSubmit(event) {
    event.preventDefault();

    handleNext();
  }

  // ================= JSX =================

  return (
    <div className="signup-page">
      <div className="signup-box">
        {/* ================= HEADER ================= */}

        <div className="signup-header">
          {step > 0 && (
            <button type="button" className="signup-back" onClick={handleBack}>
              <FaArrowLeft />
            </button>
          )}

          <h1>Create Account</h1>

          <p>
            {step === 0 && "Choose your account type"}

            {step === 1 && "Enter your login details"}

            {step === 2 && "Enter your personal details"}

            {step === 3 && "Verify CAPTCHA"}
          </p>
        </div>

        {/* ================= STEP 0 ================= */}

        {step === 0 && (
          <div className="signup-step account-step">
            <div
              className="account-card"
              onClick={function () {
                startSignup("user");
              }}
            >
              <h2>User</h2>

              <p>Create employee account</p>
            </div>

            <div
              className="account-card"
              onClick={function () {
                startSignup("admin");
              }}
            >
              <h2>Admin</h2>

              <p>Create administrator account</p>
            </div>

            <button
              type="button"
              className="back-login-btn"
              onClick={function () {
                navigate("/login");
              }}
            >
              Back to Login
            </button>
          </div>
        )}

        {/* ================= STEP 1 ================= */}

        {step === 1 && (
          <div className="signup-step">
            <div className="step-number">Step 1 of 3</div>

            {/* EMAIL */}

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                className={errorField === "email" ? "input-error" : ""}
                onChange={function (e) {
                  setEmail(e.target.value);
                  setErrorField("");
                  setErrorMessage("");
                }}
                placeholder="Enter email"
              />

              {errorField === "email" && (
                <div className="field-error">⚠ {errorMessage}</div>
              )}
            </div>

            {/* PASSWORD */}

            <div className="input-group">
              <label>Password</label>

              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className={errorField === "password" ? "input-error" : ""}
                  onChange={function (e) {
                    setPassword(e.target.value);
                    setErrorField("");
                    setErrorMessage("");
                  }}
                  placeholder="Enter password"
                />

                {errorField === "password" && (
                  <div className="field-error">⚠ {errorMessage}</div>
                )}

                <button
                  type="button"
                  onClick={function () {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* BACK */}

            <button
              type="button"
              className="signup-step-back"
              onClick={handleBack}
            >
              <FaArrowLeft /> Back
            </button>

            {/* NEXT */}

            <button
              type="button"
              className="signup-next-btn"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}

        {step === 2 && (
          <div className="signup-step">
            <div className="step-number">Step 2 of 3</div>

            {/* NAME */}

            <div className="input-group">
              <label>
                {accountType === "admin" ? "Name" : "Employee Name"}
              </label>

              <input
                type="text"
                value={name}
                className={errorField === "name" ? "input-error" : ""}
                onChange={function (e) {
                  setName(e.target.value);
                  setErrorField("");
                  setErrorMessage("");
                }}
                placeholder={
                  accountType === "admin" ? "Admin name" : " employee name"
                }
              />

              {errorField === "name" && (
                <div className="field-error">⚠ {errorMessage}</div>
              )}
            </div>

            {/* DEPARTMENT */}

            <div className="input-group">
              <label>Department</label>

              <select
                className={
                  errorField === "department"
                    ? "input-error"
                    : department === ""
                      ? "placeholder"
                      : ""
                }
                value={department}
                onChange={function (e) {
                  setDepartment(e.target.value);
                  setErrorField("");
                  setErrorMessage("");
                }}
              >
                <option value="" disabled hidden>
                  Department
                </option>

                <option value="it">IT</option>

                <option value="hr">HR</option>

                <option value="finance">Finance</option>

                <option value="sales">Sales</option>

                <option value="marketing">Marketing</option>

                <option value="operation">Operations</option>

                <option value="administration">Administration</option>

                <option value="customer-support">Customer Support</option>

                <option value="procurement">Procurement</option>

                <option value="management">Management</option>
              </select>
              {errorField === "department" && (
                <div className="field-error">⚠ {errorMessage}</div>
              )}
            </div>

            {/* PHONE */}

            <div className="input-group">
              <label>Phone</label>

              <PhoneInput
                country={"in"}
                value={phone.replace(/\D/g, "")}
                inputClass={errorField === "phone" ? "input-error" : ""}
                onChange={function (phoneNumber, country) {
                  if (!phoneNumber) {
                    setPhone("");
                    return;
                  }

                  setPhoneCountry({
                    countryCode: country.countryCode,
                    dialCode: country.dialCode,
                  });

                  const dialCode = country.dialCode;
                  const localNumber = phoneNumber.substring(dialCode.length);

                  setPhone("+" + dialCode + " " + localNumber);

                  setErrorField("");
                  setErrorMessage("");
                }}
                enableSearch={true}
                countryCodeEditable={false}
              />
              {errorField === "phone" && (
                <div className="field-error">⚠ {errorMessage}</div>
              )}
            </div>

            {/* BACK */}

            <button
              type="button"
              className="signup-step-back"
              onClick={handleBack}
            >
              <FaArrowLeft /> Back
            </button>

            {/* NEXT */}

            <button
              type="button"
              className="signup-next-btn"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {/* ================= STEP 3 ================= */}

        {step === 3 && (
          <form className="signup-step" onSubmit={handleSubmit}>
            <div className="step-number">Step 3 of 3</div>

            <div className="captcha-area">
              {/* CAPTCHA */}

              <div className="captcha-image-box">
                <canvas ref={canvasRef} className="captcha-canvas" />

                <button
                  type="button"
                  className="captcha-refresh"
                  onClick={generateCaptcha}
                  title="Generate new CAPTCHA"
                >
                  <FaRedo />
                </button>
              </div>

              {/* ADMIN KEY */}

              {accountType === "admin" && (
                <div className="input-group">
                  <label>Admin Key</label>

                  <input
                    type="password"
                    value={adminKey}
                    onChange={function (e) {
                      setAdminKey(e.target.value);
                      setErrorField("");
                      setErrorMessage("");
                    }}
                    placeholder="Enter admin key"
                  />
                  {errorField === "adminKey" && (
                    <div className="field-error">⚠ {errorMessage}</div>
                  )}
                </div>
              )}

              {/* CAPTCHA INPUT */}

              <label>Enter CAPTCHA</label>

              <input
                type="text"
                value={captchaInput}
                onChange={function (e) {
                  setCaptchaInput(e.target.value);
                  setErrorField("");
                  setErrorMessage("");
                }}
                placeholder="Enter characters"
                autoComplete="off"
              />
              {errorField === "captcha" && (
                <div className="field-error">⚠ {errorMessage}</div>
              )}
            </div>

            {/* BACK */}

            <button
              type="button"
              className="signup-step-back"
              onClick={handleBack}
            >
              <FaArrowLeft /> Back
            </button>

            {/* SUBMIT */}
            {errorField === "submit" && (
              <div className="field-error submit-error">⚠ {errorMessage}</div>
            )}
            <button
              type="submit"
              className="signup-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
