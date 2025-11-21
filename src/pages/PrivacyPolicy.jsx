import React from 'react';
import './css/Legal.css';

function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="page-container">
        {/* Header Section - Matching Career Page */}
        <header className="legal-header">
          <div className="header-overlay">
            <div className="company-logo">DAKS TOOLS</div>
            <div className="header-subtitle">PRECISION TOOLS MANUFACTURING</div>
            <h1 className="header-title">Privacy Policy</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
              Protecting Your Privacy with Precision and Care
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="legal-content">
          <div className="content-inner">
            {/* Last Updated */}
            <div className="last-updated">Last Updated: December 1, 2024</div>

            {/* Introduction Section */}
            <section className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                DAKS TOOLS ("we", "us", or "our") is committed to protecting your privacy and ensuring 
                the security of your personal information. As India's leading precision tools manufacturer, 
                we understand the importance of trust and transparency in all our business relationships.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website, use our services, or interact with us as a customer, supplier, 
                or business partner in the precision tools industry.
              </p>
            </section>

            {/* Information Collection Section */}
            <section className="legal-section">
              <h2>2. Information We Collect</h2>
              <p>We collect several types of information from and about users of our services:</p>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">👤</div>
                  <div className="info-content">
                    <h3>Personal Identification</h3>
                    <p>Name, email address, phone number, company details, job title</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">🏢</div>
                  <div className="info-content">
                    <h3>Business Information</h3>
                    <p>Company size, industry, purchasing requirements, technical specifications</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">💻</div>
                  <div className="info-content">
                    <h3>Technical Data</h3>
                    <p>IP address, browser type, device information, browsing patterns</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <div className="info-content">
                    <h3>Communication Data</h3>
                    <p>Your communications with our sales and technical support teams</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Usage Section */}
            <section className="legal-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect for various business purposes:</p>
              <ul>
                <li>To provide and maintain our precision tools and services</li>
                <li>To process your orders and manage your account</li>
                <li>To provide technical support and customer service</li>
                <li>To send you technical specifications, product updates, and industry insights</li>
                <li>To improve our products, services, and manufacturing processes</li>
                <li>To comply with legal obligations and industry standards</li>
                <li>To protect our rights, property, and safety, and that of our customers</li>
              </ul>
            </section>

            {/* Data Security Section */}
            <section className="legal-section">
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures designed 
                to protect your personal information against accidental or unlawful destruction, 
                loss, alteration, unauthorized disclosure, or access.
              </p>
              <div className="security-features">
                <div className="security-item">
                  <span className="security-icon">🔒</span>
                  <span>Encryption of sensitive data</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">🛡️</span>
                  <span>Regular security assessments</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">👨‍💼</span>
                  <span>Access controls and authentication</span>
                </div>
                <div className="security-item">
                  <span className="security-icon">📚</span>
                  <span>Employee training on data protection</span>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="legal-section contact-section">
              <h2>5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>DAKS TOOLS</strong>
                </div>
                <div className="contact-item">
                  <strong>Email:</strong> privacy@dakstools.com
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong> +91-20-6678-9000
                </div>
                <div className="contact-item">
                  <strong>Address:</strong> DAKS Tools Industrial Estate, Pune - 411045, Maharashtra, India
                </div>
                <div className="contact-item">
                  <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer - Matching Career Page */}
        <footer className="company-footer">
          <p>&copy; 2024 DAKS TOOLS. All rights reserved. | Precision Tools Manufacturing</p>
        </footer>
      </div>
    </div>
  );
}

export default PrivacyPolicy;