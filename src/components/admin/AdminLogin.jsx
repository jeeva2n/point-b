import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, ENDPOINTS, apiCall } from "../../config/api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("admin"); // "admin" or "customer"
  
  // Admin credentials
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Customer login state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // "email" or "otp"

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Check if customer is already logged in
  useEffect(() => {
    if (loginType === "customer") {
      const token = localStorage.getItem("token");
      if (token) navigate("/account");
    }
  }, [loginType, navigate]);

  const checkServerStatus = async () => {
    setServerStatus("checking");
    try {
      const result = await apiCall(ENDPOINTS.HEALTH, { method: "GET" });
      setServerStatus(result.success ? "connected" : "error");
    } catch (error) {
      setServerStatus("error");
    }
  };

  // Reset form when switching login type
  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setMessage("");
    setCredentials({ username: "", password: "" });
    setEmail("");
    setOtp("");
    setStep("email");
  };

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await apiCall(ENDPOINTS.ADMIN_LOGIN, {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (result.success && result.data?.success) {
        localStorage.setItem("admin_token", result.data.token);
        localStorage.setItem("admin_data", JSON.stringify(result.data.admin));

        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        setMessage(`❌ ${result.data?.message || "Login failed"}`);
      }
    } catch (err) {
      setMessage(`❌ Cannot connect to backend`);
    } finally {
      setLoading(false);
    }
  };

  // Customer - Send OTP Handler
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setMessage("❌ Email is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          cartId: localStorage.getItem("cartId"),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStep("otp");
        setMessage("✅ OTP sent to your email");
      } else {
        setMessage(`❌ ${data.message || "Failed to send OTP"}`);
      }
    } catch {
      setMessage("❌ Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Customer - Verify OTP Handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("❌ OTP is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          cartId: localStorage.getItem("cartId"),
          quoteId: localStorage.getItem("quoteId"),
        }),
      });

      const data = await response.json();
      console.log("Verify OTP response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/account");
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || "Invalid OTP"}`);
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setMessage("❌ Verification error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Server Status Indicator */}
      <div className={`server-status ${serverStatus}`}>
        {serverStatus === "checking" && "🔄 Checking server..."}
        {serverStatus === "connected" && "🟢 Server Connected"}
        {serverStatus === "error" && "🔴 Server Offline"}
      </div>

      <div className="login-main-container">
        {/* Left Section - NDT Information */}
        <div className="ndt-info-section">
          <div className="ndt-brand">
            <h1 className="ndt-title">DAKS NDT</h1>
            <h2 className="ndt-subtitle">Non-Destructive Testing Management System</h2>
          </div>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-content">
                <h3>Equipment Calibration</h3>
                <p>Track and manage calibration schedules</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-content">
                <h3>Inspection Reports</h3>
                <p>Generate detailed NDT reports</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-content">
                <h3>Secure Access</h3>
                <p>Risk-based authentication system</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-check">✓</div>
              <div className="feature-content">
                <h3>Precision Standards</h3>
                <p>Certified flawed specimens & validation blocks</p>
              </div>
            </div>
          </div>

          {/* Industries Section */}
          <div className="industries-section">
            <h4>Industries We Serve</h4>
            <div className="industries-tags">
              <span className="industry-tag">Oil & Gas</span>
              <span className="industry-tag">Aerospace</span>
              <span className="industry-tag">Power Plants</span>
              <span className="industry-tag">Manufacturing</span>
              <span className="industry-tag">Infrastructure</span>
            </div>
          </div>

          {/* Environment indicator - only in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="env-indicator">
              <strong>Dev Mode</strong><br />
              API: {API_URL}
            </div>
          )}
        </div>

        {/* Right Section - Login Form */}
        <div className="login-form-section">
          <div className="login-card">
            {/* Login Type Toggle */}
            <div className="login-type-toggle">
              <button 
                className={`toggle-btn ${loginType === 'customer' ? 'active' : ''}`}
                onClick={() => handleLoginTypeChange('customer')}
              >
                <span className="toggle-icon">👤</span>
                Customer
              </button>
              <button 
                className={`toggle-btn ${loginType === 'admin' ? 'active' : ''}`}
                onClick={() => handleLoginTypeChange('admin')}
              >
                <span className="toggle-icon">🔐</span>
                Admin
              </button>
            </div>

            <div className="login-header-section">
              <h2 className="admin-login-title">
                {loginType === 'admin' ? 'Administration Login' : 'Customer Login'}
              </h2>
              <p className="login-subtitle">
                {loginType === 'admin' 
                  ? 'Enter your credentials to access the control panel'
                  : step === 'email' 
                    ? "We'll send a verification code to your email"
                    : `Enter the code sent to ${email}`
                }
              </p>
            </div>

            {message && (
              <div className={`login-message ${message.includes("✅") ? "success" : "error"}`}>
                <div className="message-icon">
                  {message.includes("✅") ? "✓" : "✕"}
                </div>
                <span>{message.replace(/^[✅❌]\s*/, '')}</span>
              </div>
            )}

            {/* Admin Login Form */}
            {loginType === 'admin' && (
              <form className="login-form" onSubmit={handleAdminLogin}>
                <div className="form-field">
                  <label className="field-label">Username</label>
                  <div className="input-container">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      className="form-input with-icon"
                      value={credentials.username}
                      onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Password</label>
                  <div className="input-container">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input with-icon"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`signin-button ${loading ? 'loading' : ''}`}
                  disabled={loading || serverStatus === 'error'}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Customer Login Form - Email Step */}
            {loginType === 'customer' && step === 'email' && (
              <form className="login-form" onSubmit={handleSendOtp}>
                <div className="form-field">
                  <label className="field-label">Email Address</label>
                  <div className="input-container">
                    <span className="input-icon">✉️</span>
                    <input
                      type="email"
                      className="form-input with-icon"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`signin-button ${loading ? 'loading' : ''}`}
                  disabled={loading || serverStatus === 'error'}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="otp-info">
                  <div className="otp-info-icon">🔐</div>
                  <p>We'll send a 6-digit verification code to your email for secure login.</p>
                </div>
              </form>
            )}

            {/* Customer Login Form - OTP Step */}
            {loginType === 'customer' && step === 'otp' && (
              <form className="login-form" onSubmit={handleVerifyOtp}>
                <div className="form-field">
                  <label className="field-label">Verification Code</label>
                  <div className="input-container">
                    <span className="input-icon">🔢</span>
                    <input
                      type="text"
                      className="form-input with-icon otp-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="field-hint">Enter the code sent to {email}</p>
                </div>

                <button
                  type="submit"
                  className={`signin-button ${loading ? 'loading' : ''}`}
                  disabled={loading || serverStatus === 'error'}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="otp-actions">
                  <button
                    type="button"
                    className="back-link"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                      setMessage('');
                    }}
                  >
                    ← Change Email
                  </button>
                  <button
                    type="button"
                    className="resend-link"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* Security Note */}
            <div className="security-note">
              <span className="security-icon">🛡️</span>
              <span>Your connection is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;