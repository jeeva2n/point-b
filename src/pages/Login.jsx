import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './../config/api';
import './css/Login.css';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const loginSeoData = {
    title: "Login | DAKS Tools – Access Your NDT Equipment Account",
    description: "Login to your DAKS Tools account to track NDT equipment orders, request quotes for calibration blocks and flawed specimens, and manage your profile. Secure OTP-based authentication.",
    keywords: "DAKS Tools login, NDT equipment account login, customer portal NDT India, calibration blocks order tracking, NDT quote request login",
    canonicalUrl: "https://dakstools.com/login",
    ogImage: "https://dakstools.com/images/login-daks-tools.jpg"
  };

  const loginSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "DAKS Tools Customer Login",
        "description": loginSeoData.description,
        "url": loginSeoData.canonicalUrl,
        "publisher": {
          "@type": "Organization",
          "name": "DAKS Tools",
          "url": "https://dakstools.com"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://dakstools.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Login",
            "item": "https://dakstools.com/login"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I login to my DAKS Tools account?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Login to your DAKS Tools account using your email address. We'll send a secure 6-digit OTP code to your email for passwordless authentication. No password to remember – just enter the code to access your orders, quotes, and profile."
            }
          },
          {
            "@type": "Question",
            "name": "What can I access after logging into DAKS Tools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "After logging in, you can track your NDT equipment orders, view and manage quote requests for calibration blocks and flawed specimens, update your profile information, and access your complete order history."
            }
          },
          {
            "@type": "Question",
            "name": "Is the DAKS Tools login secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, DAKS Tools uses secure OTP (One-Time Password) authentication sent to your registered email. No passwords are stored, providing enhanced security for your NDT equipment orders and account information."
            }
          }
        ]
      }
    ]
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/account');
  }, [navigate]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cartId: localStorage.getItem('cartId'),
        }),
      });

      const data = await response.json();
      if (data.success) setStep('otp');
      else setError(data.message || 'Failed to send OTP');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          cartId: localStorage.getItem('cartId'),
          quoteId: localStorage.getItem('quoteId'),
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
    } catch {
      setError('Verification error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==========================================
          SEO - REACT HELMET COMPONENT
      ========================================== */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{loginSeoData.title}</title>
        <meta name="description" content={loginSeoData.description} />
        <meta name="keywords" content={loginSeoData.keywords} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={loginSeoData.canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={loginSeoData.canonicalUrl} />
        <meta property="og:title" content="Login – DAKS Tools Customer Portal" />
        <meta property="og:description" content={loginSeoData.description} />
        <meta property="og:image" content={loginSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools Customer Login" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Login – DAKS Tools" />
        <meta name="twitter:description" content={loginSeoData.description} />
        <meta name="twitter:image" content={loginSeoData.ogImage} />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(loginSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="login-page">
        {/* SAME WIDTH AS HEADER */}
        <div className="layout-width">

          {/* LOGIN CARD */}
          <div className="login-card">
            <div className="login-header">
              <h2>{step === 'email' ? 'Login to DAKS Tools' : 'Enter OTP'}</h2>
              <p>
                {step === 'email'
                  ? "We'll send a secure code to your email"
                  : `Code sent to ${email}`}
              </p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span aria-hidden="true">⚠️</span> {error}
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="login-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  aria-label="Email address"
                  aria-required="true"
                  autoComplete="email"
                />
                <button type="submit" disabled={loading} aria-label={loading ? 'Sending OTP' : 'Continue to login'}>
                  {loading ? 'Sending...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="login-form">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="6-digit code"
                  required
                  aria-label="OTP code"
                  aria-required="true"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
                <button type="submit" disabled={loading} aria-label={loading ? 'Verifying OTP' : 'Login'}>
                  {loading ? 'Verifying...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="back-link"
                  aria-label="Change email address"
                >
                  ← Change Email
                </button>
              </form>
            )}
          </div>

          {/* NDT CONTENT */}
          <section className="ndt-info" aria-labelledby="ndt-info-heading">
            <h3 id="ndt-info-heading">Non-Destructive Testing (NDT) Solutions</h3>
            <p>
              DAKS Tools provides precision NDT calibration blocks and inspection solutions 
              that ensure the integrity, safety, and reliability of critical components 
              without causing damage, enabling early defect detection and compliance with 
              ISO 17025 and ASME global standards.
            </p>

            <div className="ndt-grid">
              <div>
                <h4>Industries We Serve</h4>
                <ul>
                  <li>Oil & Gas</li>
                  <li>Aerospace</li>
                  <li>Power Plants</li>
                  <li>Manufacturing</li>
                  <li>Infrastructure</li>
                </ul>
              </div>

              <div>
                <h4>Why NDT Matters</h4>
                <ul>
                  <li>Detects internal & surface defects</li>
                  <li>Improves operational safety</li>
                  <li>Extends asset life</li>
                  <li>Meets international standards</li>
                </ul>
              </div>

              <div>
                <h4>DAKS Tools Commitment</h4>
                <ul>
                  <li>Precision reference standards</li>
                  <li>Certified flawed specimens</li>
                  <li>UT/PAUT/TOFD validation blocks</li>
                  <li>Trusted by NDT professionals</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Login;