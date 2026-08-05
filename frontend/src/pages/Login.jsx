import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  // FiMail,
  // FiLock,
  FiKey,
  FiEye,
  FiEyeOff,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import "./Login.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const { login, requestLoginOtp, loginWithOtp } = useAuth();

  const [mode, setMode] = useState("password");
  const [otpStep, setOtpStep] = useState("request");

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const message = await requestLoginOtp(email);
      setInfo(message);
      setOtpStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await loginWithOtp(email, otp);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setOtpStep("request");
    setError("");
    setInfo("");
  };

  return (
    <div className="auth-page">

      <div className="login-container">

        {/* LEFT PANEL */}

        <div className="login-left">

          <div className="brand-logo">
            <FiBriefcase />
          </div>

          <h1>Job Portal</h1>

          <h2>Find Your Dream Career</h2>

          <p>
            Discover thousands of verified jobs from top companies.
            Build your career with confidence and connect with the
            best employers.
          </p>

          <div className="feature-list">

            <div className="feature-card">
              💼 1000+ Jobs
            </div>

            <div className="feature-card">
              🚀 Fast Hiring
            </div>

            <div className="feature-card">
              ⭐ Trusted Companies
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="auth-form">

          <h2>Welcome Back 👋</h2>

          <p className="subtitle">
            Login to continue your journey.
          </p>

          {location.state?.justRegistered && (
            <p className="success">
              Account created successfully.
            </p>
          )}

          {location.state?.justReset && (
            <p className="success">
              Password reset successfully.
            </p>
          )}

          {error && <p className="error">{error}</p>}

          {mode === "otp" && info && (
            <p className="success">{info}</p>
          )}

          {/* Tabs */}

          <div className="auth-tabs">

            <button
              type="button"
              className={mode === "password" ? "auth-tab active" : "auth-tab"}
              onClick={() => switchMode("password")}
            >
              Password Login
            </button>

            <button
              type="button"
              className={mode === "otp" ? "auth-tab active" : "auth-tab"}
              onClick={() => switchMode("otp")}
            >
              OTP Login
            </button>

          </div>

          {/* PASSWORD LOGIN */}

          {mode === "password" && (

            <form onSubmit={handlePasswordLogin}>

              <div className="input-group">

                {/* <FiMail className="input-icon" /> */}

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

              <div className="input-group">
{/*  */}
                {/* <FiLock className="input-icon" /> */}

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>

              </div>

              <div className="forgot-link">
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Logging In..." : "Log In"}

                {!submitting && <FiArrowRight />}
              </button>

            </form>

          )}

          {/* REQUEST OTP */}

          {mode === "otp" && otpStep === "request" && (

            <form onSubmit={handleRequestOtp}>

              <div className="input-group">

                {/* <FiMail className="input-icon" /> */}

                <input
                className="input-email"
                  type="email"
                  placeholder="     Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

              <button
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Login Code"}

                {!submitting && <FiArrowRight />}
              </button>

            </form>

          )}

          {/* VERIFY OTP */}

          {mode === "otp" && otpStep === "verify" && (

            <form onSubmit={handleVerifyOtp}>

              <div className="input-group">

                <FiKey className="input-icon" />

                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6 Digit OTP"
                  maxLength={6}
                  inputMode="numeric"
                  required
                />

              </div>

              <button
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? "Verifying..." : "Verify & Login"}

                {!submitting && <FiArrowRight />}
              </button>

              <button
                type="button"
                className="resend-btn"
                onClick={() => setOtpStep("request")}
              >
                Didn't receive the code? Resend
              </button>

            </form>

          )}

          <div className="bottom-text">

            Don't have an account?

            <Link to="/register">
              Sign Up
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}