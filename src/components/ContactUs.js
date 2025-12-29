// components/ContactUs.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ContactUs.css";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-page">
      {/* Hero Banner Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <nav className="breadcrumb">
            <button onClick={() => navigate("/")} className="breadcrumb-link">
              Home
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Contact Us</span>
          </nav>
          
          <h1 className="hero-title">Get in Touch</h1>
          <p className="hero-subtitle">
            Have questions or need assistance? Our team is ready to help you with 
            any inquiries about our NDT products and services.
          </p>
        </div>
        
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,138.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="contact-container">
        <div className="contact-intro">
          <h2>Contact Information</h2>
          <p>Reach out to us through any of the channels below. We typically respond within 24 hours.</p>
        </div>

        <div className="contact-grid">
          
          {/* Address Card */}
          <div className="contact-card address-card">
            <div className="card-header">
              <div className="card-icon-wrapper">
                <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Office Location</h3>
            </div>
            
            <div className="card-content">
              <div className="contact-info-item">
                <div className="info-label">Address</div>
                <div className="info-content">
                  <p>No. 10/98, Narasimman Street,</p>
                  <p>Babu Garden Phase 2, Sikkarayapuram,</p>
                  <p>Chennai – 600069, Tamil Nadu, India</p>
                </div>
              </div>
              
              <div className="contact-action">
                <a 
                  href="https://www.google.com/maps/place/ALPHA+SONIX+NDT+SOLUTIONS+PVT+LTD/@13.0093848,80.1026332,1047m/data=!3m1!1e3!4m16!1m9!3m8!1s0x3a52614b63771a23:0xac38a71e657c8397!2sALPHA+SONIX+NDT+SOLUTIONS+PVT+LTD!8m2!3d13.0093796!4d80.1052081!9m1!1b1!16s%2Fg%2F11pf67zfjj!3m5!1s0x3a52614b63771a23:0xac38a71e657c8397!8m2!3d13.0093796!4d80.1052081!16s%2Fg%2F11pf67zfjj?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-btn map-btn"
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                  </svg>
                  View on Map
                </a>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="contact-card phone-card">
            <div className="card-header">
              <div className="card-icon-wrapper">
                <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Phone Support</h3>
            </div>
            
            <div className="card-content">
              <div className="contact-info-item">
                <div className="info-label">Primary Contact</div>
                <div className="phone-numbers">
                  <a href="tel:+917010774439" className="phone-link primary">
                    +91 70107 74439
                  </a>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="info-label">Support Contact</div>
                <div className="phone-numbers">
                  <a href="tel:+918778423621" className="phone-link">
                    +91 87784 23621
                  </a>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="info-label">Business Hours</div>
                <div className="business-hours">
                  <div className="hours-day">Monday – Saturday</div>
                  <div className="hours-time">9:00 AM – 6:00 PM IST</div>
                  <div className="hours-note">Closed on Sundays & Public Holidays</div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="contact-card email-card">
            <div className="card-header">
              <div className="card-icon-wrapper">
                <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Email Inquiries</h3>
            </div>
            
            <div className="card-content">
              <div className="email-list">
                <div className="email-item">
                  <div className="email-category">Sales & General</div>
                  <a href="mailto:inquiries@alphasonix.com" className="email-link">
                    inquiries@alphasonix.com
                  </a>
                  <div className="email-description">For product inquiries and orders</div>
                </div>
                
                <div className="email-item">
                  <div className="email-category">Technical Support</div>
                  <a href="mailto:support@alphasonix.com" className="email-link">
                    support@alphasonix.com
                  </a>
                  <div className="email-description">For product support and technical questions</div>
                </div>
                
                <div className="email-item">
                  <div className="email-category">Business & Partnerships</div>
                  <a href="mailto:partners@alphasonix.com" className="email-link">
                    partners@alphasonix.com
                  </a>
                  <div className="email-description">For business collaborations and partnerships</div>
                </div>
              </div>
            </div>
          </div>

          {/* Website Card */}
          <div className="contact-card website-card">
            <div className="card-header">
              <div className="card-icon-wrapper">
                <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Online Presence</h3>
            </div>
            
            <div className="card-content">
              <div className="website-info">
                <div className="website-description">
                  Visit our website for comprehensive information about our NDT products, 
                  services, certifications, and latest updates.
                </div>
                
                <div className="website-links">
                  <a 
                    href="https://www.alphasonix.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-btn website-btn"
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill="currentColor"/>
                    </svg>
                    Visit Official Website
                  </a>
                  
                  <a 
                    href="https://www.linkedin.com/company/alphasonix" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-btn linkedin-btn"
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19ZM18.5 18.5V13.2C18.5 11.36 17.04 9.9 15.2 9.9C14.28 9.9 13.26 10.42 12.74 11.22V10.13H10.38V18.5H12.74V13.57C12.74 12.8 13.36 12.17 14.13 12.17C14.91 12.17 15.53 12.8 15.53 13.57V18.5H18.5ZM6.88 8.56C7.67 8.56 8.31 7.92 8.31 7.13C8.31 6.34 7.67 5.69 6.88 5.69C6.08 5.69 5.44 6.34 5.44 7.13C5.44 7.92 6.08 8.56 6.88 8.56ZM8.07 18.5V10.13H5.72V18.5H8.07Z" fill="currentColor"/>
                    </svg>
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Response Section */}
        <div className="response-section">
          <div className="response-card">
            <div className="response-icon">⚡</div>
            <div className="response-content">
              <h3>Quick Response Guarantee</h3>
              <p>We strive to respond to all inquiries within 24 hours during business days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;