import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
// In AdminLogin.js, change this line:
const [backendUrl, setBackendUrl] = useState("http://192.168.1.9:5001");
  const [serverStatus, setServerStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "admin",
    password: "admin123",
  });

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, [backendUrl]);

  const checkServerStatus = async () => {
    setServerStatus("checking");
    try {
      const response = await fetch(`${backendUrl}/api/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        setServerStatus("connected");
      } else {
        setServerStatus("error");
      }
    } catch (error) {
      setServerStatus("error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_data", JSON.stringify(data.admin));

        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      setMessage(`❌ Cannot connect to backend at ${backendUrl}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Main Content */}
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
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header-section">
              <h2 className="admin-login-title">Administration Login</h2>
              <p className="login-subtitle">Enter your credentials to access the control panel</p>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div className={`login-message ${message.includes("✅") ? "success" : "error"}`}>
                <div className="message-icon">
                  {message.includes("✅") ? "✓" : "✕"}
                </div>
                <span>{message}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="login-form" onSubmit={handleLogin}>
              {/* Username Field */}
              <div className="form-field">
                <label className="field-label">Username</label>
                <div className="input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    placeholder="Enter username"
                  />
                </div>
                <div className="demo-username">Admin</div>
              </div>

              {/* Password Field */}
              <div className="form-field">
                <label className="field-label">Password</label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <div className="demo-password">**********</div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className={`signin-button ${loading ? 'loading' : ''}`}
                disabled={loading}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;