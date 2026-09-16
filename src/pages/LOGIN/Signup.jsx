import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash, FaRedo } from "react-icons/fa";
import "./Signup.css";

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
  const [adminKey, setAdminKey] = useState("");

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";

  function generateCaptcha() {
    let newCaptcha = "";

    for (let i = 0; i < 5; i++) {
      newCaptcha += characters[Math.floor(Math.random() * characters.length)];
    }

    setCaptcha(newCaptcha);
    setCaptchaInput("");
  }

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

      // Background
      ctx.fillStyle = "#f4f7f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Random background dots
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

      // Random lines
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();

        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);

        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);

        ctx.strokeStyle = "rgba(30, 70, 70, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // CAPTCHA characters
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

      // Extra distortion line
      ctx.beginPath();
      ctx.moveTo(10, 70);
      ctx.bezierCurveTo(80, 20, 180, 100, 290, 30);

      ctx.strokeStyle = "rgba(13, 148, 136, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [captcha, step],
  );

  function startSignup(type) {
    setAccountType(type);
    setStep(1);
  }

  function handleNext() {
    if (step === 1) {
      if (!email.trim()) {
        alert("Please enter email");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        alert("Please enter a valid email address");
        return;
      }

      if (!password) {
        alert("Please enter password");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      if (!name.trim()) {
        alert("Please enter your name");
        return;
      }

      if (!department.trim()) {
        alert("Please enter department");
        return;
      }

      if (!phone.trim()) {
        alert("Please enter phone number");
        return;
      }

      generateCaptcha();
      setStep(3);
    }
  }

  function handleBack() {
    if (step === 1) {
      setStep(0);
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
      return;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!captchaInput.trim()) {
      alert("Please enter CAPTCHA");
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captcha.toUpperCase()) {
      alert("Invalid CAPTCHA");

      generateCaptcha();

      return;
    }

    try {
      setLoading(true);

      const registerUrl =
        accountType === "admin"
          ? "http://localhost:5000/api/admins/register"
          : "http://localhost:5000/api/employees/register";

      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          accountType === "admin"
            ? {
                name: name.trim(),
                email: email.trim(),
                password: password,
                department: department.trim(),
                phone: phone.trim(),
                adminKey: adminKey.trim(),
              }
            : {
                email: email.trim(),
                password: password,
                employeeName: name.trim(),
                department: department.trim(),
                phone: phone.trim(),
              },
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      alert("Account created successfully");

      navigate("/login");
    } catch (error) {
      console.log("Signup error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-box">
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

        {/* STEP 0 */}

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

        {/* STEP 1 */}

        {step === 1 && (
          <div className="signup-step">
            <div className="step-number">Step 1 of 3</div>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={function (e) {
                  setEmail(e.target.value);
                }}
                placeholder="Enter email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={function (e) {
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter password"
                />

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
            <button
              type="button"
              className="signup-step-back"
              onClick={handleBack}
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              className="signup-next-btn"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <div className="signup-step">
            <div className="step-number">Step 2 of 3</div>

            <div className="input-group">
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={function (e) {
                  setName(e.target.value);
                }}
                placeholder="Enter your name"
              />
            </div>

            <div className="input-group">
              <label>Department</label>

              <input
                type="text"
                value={department}
                onChange={function (e) {
                  setDepartment(e.target.value);
                }}
                placeholder="Enter department"
              />
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                type="tel"
                value={phone}
                onChange={function (e) {
                  setPhone(e.target.value);
                }}
                placeholder="Enter phone number"
              />
            </div>
            <button
              type="button"
              className="signup-step-back"
              onClick={handleBack}
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              className="signup-next-btn"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <form className="signup-step" onSubmit={handleSubmit}>
            <div className="step-number">Step 3 of 3</div>

            <div className="captcha-area">
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
              {accountType === "admin" && (
                <div className="input-group">
                  <label>Admin Key</label>

                  <input
                    type="password"
                    value={adminKey}
                    onChange={function (e) {
                      setAdminKey(e.target.value);
                    }}
                    placeholder="Enter admin key"
                  />
                </div>
              )}
              <label>Enter CAPTCHA</label>

              <input
                type="text"
                value={captchaInput}
                onChange={function (e) {
                  setCaptchaInput(e.target.value);
                }}
                placeholder="Enter characters"
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              className="signup-step-back"
              onClick={handleBack}
            >
              <FaArrowLeft /> Back
            </button>
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
