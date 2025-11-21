import React, { useState } from 'react';
import './css/ReachOut.css';

function ReachOut() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 2000);
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: '💬' },
    { value: 'technical', label: 'Technical Support', icon: '🔧' },
    { value: 'sales', label: 'Sales Inquiry', icon: '💰' },
    { value: 'service', label: 'Service & Maintenance', icon: '🛠️' },
    { value: 'partnership', label: 'Partnership', icon: '🤝' },
    { value: 'career', label: 'Career Opportunities', icon: '👨‍💼' }
  ];

  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone Support',
      details: '+91-20-6678-9000',
      description: 'Mon-Fri, 9:00 AM - 6:00 PM IST',
      action: 'Call Now'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: 'info@dakstools.com',
      description: 'We respond within 24 hours',
      action: 'Send Email'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: 'DAKS Tools Industrial Estate',
      description: 'Pune - 411045, Maharashtra, India',
      action: 'Get Directions'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available Online',
      description: 'Instant support during business hours',
      action: 'Start Chat'
    }
  ];

  const regionalOffices = [
    {
      city: 'Chennai',
      address: 'Kundrathur, Chennai, Tamil Nadu, India',
      phone: '+91-44-2678-3456',
      email: 'chennai@dakstools.com'
    }
  ];

  return (
    <div className="reach-out-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="reach-out-header">
          <div className="header-overlay">
            <div className="company-logo">DAKS TOOLS</div>
            <div className="header-subtitle">PRECISION TOOLS MANUFACTURING</div>
            <h1 className="header-title">Reach Out To Us</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
              Let's Discuss Your Precision Tool Requirements - We're Here to Help
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="reach-out-content">
          <div className="content-inner">
            {/* Contact Methods Section */}
            <section className="contact-methods-section">
              <div className="section-header">
                <h2>Get In Touch</h2>
                <p>Multiple ways to connect with our team of precision tools experts</p>
              </div>

              <div className="contact-methods-grid">
                {contactMethods.map((method, index) => (
                  <div key={index} className="contact-method-card">
                    <div className="method-icon">{method.icon}</div>
                    <div className="method-content">
                      <h3>{method.title}</h3>
                      <p className="method-details">{method.details}</p>
                      <p className="method-description">{method.description}</p>
                      <button className="method-action-btn">
                        {method.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Form Section */}
            <section className="contact-form-section">
              <div className="form-container">
                <div className="form-header">
                  <h2>Send Us a Message</h2>
                  <p>Fill out the form below and our team will get back to you promptly</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type *</label>
                    <div className="inquiry-type-grid">
                      {inquiryTypes.map((type) => (
                        <label key={type.value} className="inquiry-type-option">
                          <input
                            type="radio"
                            name="inquiryType"
                            value={type.value}
                            checked={formData.inquiryType === type.value}
                            onChange={handleChange}
                            required
                          />
                          <div className="option-content">
                            <span className="option-icon">{type.icon}</span>
                            <span className="option-label">{type.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Please describe your requirements in detail..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">📨</span>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Regional Offices Section */}
            <section className="offices-section">
              <div className="section-header">
                <h2>Our Regional Offices</h2>
                <p>Visit us at any of our locations across India</p>
              </div>

              <div className="offices-grid">
                {regionalOffices.map((office, index) => (
                  <div key={index} className="office-card">
                    <div className="office-header">
                      <h3>{office.city}</h3>
                      <div className="office-icon">🏢</div>
                    </div>
                    <div className="office-details">
                      <div className="office-info">
                        <span className="info-icon">📍</span>
                        <span>{office.address}</span>
                      </div>
                      <div className="office-info">
                        <span className="info-icon">📞</span>
                        <span>{office.phone}</span>
                      </div>
                      <div className="office-info">
                        <span className="info-icon">✉️</span>
                        <span>{office.email}</span>
                      </div>
                    </div>
                    <div className="office-actions">
                      <button className="office-btn primary">Call Office</button>
                      <button className="office-btn secondary">Get Directions</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Support Hours Section */}
            <section className="support-hours-section">
              <div className="support-content">
                <div className="support-info">
                  <h2>Support Hours & Response Times</h2>
                  <div className="hours-grid">
                    <div className="hours-card">
                      <h3>Technical Support</h3>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                      <p>Saturday: 9:00 AM - 2:00 PM IST</p>
                      <p className="response-time">Response Time: Within 4 hours</p>
                    </div>
                    <div className="hours-card">
                      <h3>Sales Inquiries</h3>
                      <p>Monday - Saturday: 8:00 AM - 8:00 PM IST</p>
                      <p>Sunday: 10:00 AM - 4:00 PM IST</p>
                      <p className="response-time">Response Time: Within 2 hours</p>
                    </div>
                    <div className="hours-card">
                      <h3>Emergency Support</h3>
                      <p>24/7 Emergency Hotline Available</p>
                      <p>For critical manufacturing issues</p>
                      <p className="response-time emergency">Response Time: Immediate</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="company-footer">
          <p>&copy; 2024 DAKS TOOLS. All rights reserved. | Precision Tools Manufacturing</p>
        </footer>
      </div>
    </div>
  );
}

export default ReachOut;