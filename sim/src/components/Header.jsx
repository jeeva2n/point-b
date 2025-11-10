import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaEnvelope, FaPhone } from "react-icons/fa";
import "./Header.css";

function Header() {
  const [contactOpen, setContactOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);
  const toggleLanguageMenu = () => setLanguageMenuOpen(!languageMenuOpen);

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <div className="logo-box">Z</div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="main-nav">
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/broom-brush">Broom & Brush</Link></li>
              <li><Link to="/healthcare">HealthCare</Link></li>
              <li><Link to="/product-catalogue">Product Catalogue</Link></li>
              <li><Link to="/company">Company</Link></li>
              <li><Link to="/career">Career</Link></li>
            </ul>
          </nav>

          {/* Actions (icons) */}
          <div className="header-actions">
            <div className="language-selector" onClick={toggleLanguageMenu}>
              <FaGlobe />
              <span className="dropdown-arrow">▼</span>

              {languageMenuOpen && (
                <div className="language-dropdown">
                  <div className="language-option">English</div>
                  <div className="language-option">Deutsch</div>
                  <div className="language-option">Español</div>
                  <div className="language-option">Français</div>
                  <div className="language-option">中文</div>
                </div>
              )}
            </div>

            <div className="contact-button">
              <FaPhone />
            </div>

            <div className="contact-button" onClick={openContact}>
              <FaEnvelope />
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Popup Modal */}
      {contactOpen && (
        <div className="contact-overlay">
          <div className="contact-modal">
            <button className="close-btn" onClick={closeContact}>
              ×
            </button>
            <h2>Contact Us</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
