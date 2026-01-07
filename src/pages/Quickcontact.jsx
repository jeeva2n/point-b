import React, { useState } from 'react';
import './css/Quickcontact.css';

const Quickcontact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message should be at least 10 characters';
    }
    
    if (formData.phone && !/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      // Create FormData object
      const formPayload = new FormData();
      
      // Add form data
      formPayload.append("access_key", "73a5d128-f5b6-4b66-80c6-bdac56b080c8");
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone || '');
      formPayload.append("company", formData.company || '');
      formPayload.append("subject", formData.subject || 'General Inquiry');
      formPayload.append("message", formData.message);
      
      // Add website information
      formPayload.append("from_name", "DAKS NDT Website");
      formPayload.append("website", "www.dakstools.com");
      
      // Send to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formPayload
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you for contacting us. We will get back to you soon!');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      
      // Auto-hide messages after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Us",
      details: ["info@alphasonix.com", "sales@dakstools.com"],
      action: "mailto:info@alphasonix.com"
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Call Us",
      details: ["+91-8778423621"],
      action: "tel:+918778423621"
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Visit Us",
      details: [
        "No.10/98, Narasimman Street",
        "Babu Garden Phase II Sikarayapuram",
        "Chennai – 600069, Tamil Nadu, India"
      ],
      action: "https://maps.google.com/?q=ALPHA+SONIX+NDT+SOLUTIONS+PVT+LTD"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ];

  return (
    <div className="contact-page">
      {/* Page Container */}
      <div className="contact-page-container">
        
        {/* HERO HEADER */}
        <header className="contact-header">
          <div className="contact-header-overlay">
            <h1 className="contact-header-title">Contact Us</h1>
            <div className="contact-header-divider"></div>
            <p className="contact-header-tagline">
              Get in Touch with Our NDT Experts
            </p>
          </div>
        </header>

        {/* GOOGLE MAPS SECTION - ADDED HERE */}
        <div className="google-maps-section">
          <div className="maps-container">
            <h3 className="maps-title">Find Us</h3>
            <p className="maps-subtitle">Visit our location in Chennai, India</p>
            <div className="maps-wrapper">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4823.833447596548!2d80.10263317588753!3d13.009384814047092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52614b63771a23%3A0xac38a71e657c8397!2sALPHA%20SONIX%20NDT%20SOLUTIONS%20PVT%20LTD!5e1!3m2!1sen!2sin!4v1767794223107!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Alpha Sonix NDT Solutions Location"
                className="google-maps-iframe"
              ></iframe>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="contact-content-section">
          <div className="contact-content-inner">
            
            {/* INTRO SECTION */}
            <div className="contact-intro">
              <h2 className="contact-section-title">Let's Connect</h2>
              <h3 className="contact-section-subtitle">We're Here to Help with Your NDT Needs</h3>
              <p className="contact-section-text">
                Have questions about our Non-Destructive Testing solutions? Need technical support 
                or want to discuss a project? Reach out to our team of experts. We're ready to 
                assist you with innovative NDT technology and professional services.
              </p>
            </div>

            {/* CONTACT GRID */}
            <div className="contact-grid">
              
              {/* CONTACT INFORMATION COLUMN */}
              <div className="contact-info-column">
                <div className="contact-info-card">
                  <h3 className="contact-info-title">Contact Information</h3>
                  <p className="contact-info-subtitle">
                    Reach out through any of these channels
                  </p>
                  
                  <div className="contact-methods">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="contact-method">
                        <div className="contact-icon">
                          {info.icon}
                        </div>
                        <div className="contact-details">
                          <h4>{info.title}</h4>
                          <div className="contact-links">
                            {info.details.map((detail, idx) => (
                              <div key={idx} className="contact-link-item">
                                {detail}
                              </div>
                            ))}
                          </div>
                          <a 
                            href={info.action} 
                            className="contact-action-link"
                            target={info.action.startsWith('http') ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                          >
                            {info.title.includes('Email') ? 'Send Email' : 
                             info.title.includes('Call') ? 'Call Now' : 
                             'Get Directions'}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* OFFICE HOURS */}
                  <div className="office-hours">
                    <h4>Office Hours</h4>
                    <div className="hours-list">
                      {officeHours.map((item, index) => (
                        <div key={index} className="hours-item">
                          <span className="hours-day">{item.day}</span>
                          <span className="hours-time">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SOCIAL MEDIA */}
                  <div className="social-media-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                      <a href="#" className="social-link linkedin">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                      <a href="#" className="social-link twitter">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTACT FORM COLUMN */}
              <div className="contact-form-column">
                <div className="contact-form-card">
                  <h3 className="form-title">Send Us a Message</h3>
                  <p className="form-subtitle">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <div className="success-message">
                      <div className="success-icon">✓</div>
                      <div className="success-text">
                        <h4>Message Sent Successfully!</h4>
                        <p>{submitMessage}</p>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="error-message">
                      <div className="error-icon">!</div>
                      <div className="error-text">
                        <h4>Submission Failed</h4>
                        <p>{submitMessage}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">
                          Full Name *
                          {formErrors.name && (
                            <span className="error-message">{formErrors.name}</span>
                          )}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={formErrors.name ? 'error' : ''}
                          placeholder="John Smith"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">
                          Email Address *
                          {formErrors.email && (
                            <span className="error-message">{formErrors.email}</span>
                          )}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={formErrors.email ? 'error' : ''}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={formErrors.phone ? 'error' : ''}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Product Information">Product Information</option>
                        <option value="Project Quote">Project Quote</option>
                        <option value="Training">Training</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">
                        Message *
                        {formErrors.message && (
                          <span className="error-message">{formErrors.message}</span>
                        )}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={formErrors.message ? 'error' : ''}
                        placeholder="Tell us about your NDT requirements..."
                        rows="6"
                      />
                      <div className="char-count">
                        {formData.message.length}/500 characters
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                    
                    <p className="form-note">
                      By submitting this form, you agree to our privacy policy and consent to being contacted.
                    </p>
                  </form>
                </div>
              </div>

            </div>

            {/* FAQ SECTION */}
            <div className="faq-section">
              <h2 className="faq-title">Frequently Asked Questions</h2>
              <div className="faq-grid">
                <div className="faq-item">
                  <h4>What types of NDT services do you offer?</h4>
                  <p>We provide comprehensive NDT services including ultrasonic testing, radiographic testing, magnetic particle testing, dye penetrant testing, and advanced digital solutions.</p>
                </div>
                <div className="faq-item">
                  <h4>How quickly can you respond to urgent requests?</h4>
                  <p>For emergency inspections, we can typically deploy a team within 24-48 hours. Response time depends on location and project complexity.</p>
                </div>
                <div className="faq-item">
                  <h4>Do you provide on-site training?</h4>
                  <p>Yes, we offer customized on-site training programs for NDT technicians, inspectors, and quality personnel at your facility.</p>
                </div>
                <div className="faq-item">
                  <h4>What industries do you serve?</h4>
                  <p>We serve oil & gas, aerospace, manufacturing, power generation, construction, and marine industries globally.</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Quickcontact;