import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaInfoCircle, FaUserTie, FaHome } from "react-icons/fa";
import "./Header.css";
import daksLogo from '../assets/primary/daks.png';

import h4 from '../assets/primary/h4.png';
import h3 from '../assets/primary/h3.png';
import h2 from '../assets/primary/h2.png';
import h1 from '../assets/primary/h1.png';

function Header() {
  const [contactOpen, setContactOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);   // 🔥 NEW SIDEBAR STATE
  const navigate = useNavigate();

  const handleHomeClick = () => navigate("/");
  const handleAdminClick = () => navigate("/admin/dashboard");

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src={daksLogo} alt="DAKS NDT Services Logo" className="logo-image" />
          </Link>
        </div>

        {/* 🔥 HAMBURGER FOR MOBILE */}
        <div className="hamburger-menu" onClick={() => setOpenSidebar(true)}>
          ☰
        </div>

        {/* Navigation (Desktop) */}
        <nav className="main-nav">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/flawed-specimens">Flawed Specimens</Link></li>
            <li><Link to="/CalibrationBlocks">Calibration Blocks</Link></li>
            <li><Link to="/product-catalogue">Product Catalogue</Link></li>
            <li><Link to="/company">Company</Link></li>
            <li><Link to="/career">Career</Link></li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <div className="home-button" onClick={handleHomeClick}>
            <FaHome />
          </div>

          <div className="contact-button" onClick={handleAdminClick} title="Admin Login">
            <FaUserTie />
          </div>

          {/* Envelope Hover Panel */}
          <div
            className="contact-button contact-dropdown-trigger"
            onMouseEnter={() => setContactOpen(true)}
            onMouseLeave={() => setContactOpen(false)}
          >
            <FaInfoCircle />
            <span className="dropdown-arrow">▼</span>

            {contactOpen && (
              <div className="contact-panel-dropdown">

                <div className="contact-company-info">
                  <h3 className="company-title">DAKS NDT Services</h3>
                  <p className="company-subtitle">
                    Advanced Non-Destructive Testing Solutions • Inspection • Safety • Reliability
                  </p>
                  <p className="contact-label">Address</p>
                  <p>
                    Babu Garden, No.163,<br />
                    Narasimman Street, 2nd St,<br />
                    Sikkarayapuram, Tamil Nadu 600128<br />
                    India
                  </p>

                  <p className="contact-label">Phone</p>
                  <p>087784 23621</p>

                  <p className="contact-label">Email</p>
                  <p>jeevaoff22@gmail.com</p>

                  <p className="contact-label">Hours</p>
                  <p>Open 24 Hours</p>

                  <br />
                  <h3 className="company-title">NDT Services Offered</h3>
                  <ul className="ndt-services-list">
                    <li>Ultrasonic Testing (UT)</li>
                    <li>Radiographic Testing (RT)</li>
                    <li>Magnetic Particle Testing (MT)</li>
                    <li>Dye Penetrant Testing (PT)</li>
                    <li>Visual Inspection (VT)</li>
                    <li>Eddy Current Testing (ECT)</li>
                  </ul>
                </div>

                <div className="contact-get-in-touch">
                  <h3>Get in Touch With Us</h3>

                  <div className="contact-panel-item">
                    <img src={h1} alt="NDT Support" className="contact-item-image" />
                    <div>
                      <h4>NDT Inspection Support</h4>
                      <p>Fast and reliable service with expert technicians.</p>
                    </div>
                  </div>

                  <div className="contact-panel-item">
                    <img src={h2} alt="Service Areas" className="contact-item-image" />
                    <div>
                      <h4>Service Areas</h4>
                      <p>We provide on-site NDT services across India.</p>
                    </div>
                  </div>

                  <div className="contact-panel-item">
                    <img src={h3} alt="Career" className="contact-item-image" />
                    <div>
                      <h4>Careers</h4>
                      <p>Join our professional NDT team.</p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 MOBILE SIDEBAR NAVIGATION */}
      <div className={`mobile-sidebar ${openSidebar ? "active" : ""}`}>
        <a onClick={() => setOpenSidebar(false)} href="/home">Home</a>
        <a onClick={() => setOpenSidebar(false)} href="/flawed-specimens">Flawed Specimens</a>
        <a onClick={() => setOpenSidebar(false)} href="/CalibrationBlocks">Calibration Blocks</a>
        <a onClick={() => setOpenSidebar(false)} href="/product-catalogue">Product Catalogue</a>
        <a onClick={() => setOpenSidebar(false)} href="/company">Company</a>
        <a onClick={() => setOpenSidebar(false)} href="/career">Career</a>
      </div>

      {/* 🔥 OVERLAY */}
      <div
        className={`sidebar-overlay ${openSidebar ? "active" : ""}`}
        onClick={() => setOpenSidebar(false)}
      />
    </header>
  );
}

export default Header;
