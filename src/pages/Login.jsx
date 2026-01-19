import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './../config/api';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/account');
  }, [navigate]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cartId: localStorage.getItem('cartId') }),
      });
      const data = await response.json();
      if (data.success) setStep('otp');
      else setError(data.message || 'Failed to send OTP');
    } catch (err) {
      setError('Connection error. Please check your internet connection.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) { setError('OTP is required'); return; }
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp,
          cartId: localStorage.getItem('cartId'),
          quoteId: localStorage.getItem('quoteId')
        }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/account');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Verification error. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>{step === 'email' ? 'Login' : 'Enter OTP'}</h2>
            <p>{step === 'email' ? "We'll send a code to your email" : `Code sent to ${email}`}</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="login-form">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
              <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Continue'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))} placeholder="6-digit code" required />
              <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Login'}</button>
              <button type="button" onClick={() => setStep('email')} className="back-link">Change Email</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;