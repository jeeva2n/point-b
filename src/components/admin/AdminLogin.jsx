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
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    setServerStatus("checking");
    try {
      const result = await apiCall(ENDPOINTS.HEALTH, { method: "GET" });
      setServerStatus(result.success ? "connected" : "error");
    } catch (error) {
      setServerStatus("error");
    }
  };

  const handleLogin = async (e) => {
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
          </div>

          {/* Environment indicator - only in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="env-indicator" style={{ 
              marginTop: '20px', 
              padding: '10px', 
              background: '#f0f0f0', 
              borderRadius: '5px',
              fontSize: '12px' 
            }}>
              <strong>Dev Mode</strong><br />
              API: {API_URL}
            </div>
          )}
        </div>

        {/* Right Section - Login Form */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header-section">
              <h2 className="admin-login-title">Administration Login</h2>
              <p className="login-subtitle">Enter your credentials to access the control panel</p>
            </div>

            {message && (
              <div className={`login-message ${message.includes("✅") ? "success" : "error"}`}>
                <div className="message-icon">
                  {message.includes("✅") ? "✓" : "✕"}
                </div>
                <span>{message}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-field">
                <label className="field-label">Username</label>
                <div className="input-container">
                  <input
                    type="text"
                    className="form-input"
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
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;