import React, { useEffect, useRef } from 'react';
import './css/Career.css';

function Career() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="career-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="career-header">
          <div className="header-overlay">
            <div className="company-logo">DAKS TOOLS</div>
            <div className="header-subtitle">BUILD YOUR CAREER WITH</div>
            <h1 className="header-title">DAKS TOOLS</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
              Join India's Leading Precision Tools Manufacturer
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="career-content">
          <div className="content-inner">
            {/* Intro Section */}
            <section 
              ref={addToRefs}
              className="intro-section section-reveal"
            >
              <h2>Shape the Future of Manufacturing</h2>
              <p>
                At DAKS TOOLS, we're revolutionizing the precision tools industry with 
                cutting-edge technology and innovative solutions. Join our team of passionate 
                professionals and contribute to manufacturing excellence that powers industries 
                worldwide. We offer dynamic career opportunities in engineering, manufacturing, 
                R&D, and business operations.
              </p>
            </section>

            {/* Why Join Section */}
            <section 
              ref={addToRefs}
              className="why-join-section section-reveal"
            >
              <h2>Why Join DAKS TOOLS?</h2>
              <div className="why-join-grid">
                <div className="why-join-card">
                  <div className="why-join-icon">🏭</div>
                  <div className="why-join-content">
                    <h3>Industry Leadership</h3>
                    <p>Work with India's premier precision tools manufacturer with 40+ years of excellence</p>
                  </div>
                </div>
                
                <div className="why-join-card">
                  <div className="why-join-icon">📈</div>
                  <div className="why-join-content">
                    <h3>Growth Opportunities</h3>
                    <p>Clear career progression paths and skill development programs</p>
                  </div>
                </div>
                
                <div className="why-join-card">
                  <div className="why-join-icon">🔧</div>
                  <div className="why-join-content">
                    <h3>Technical Innovation</h3>
                    <p>Access to state-of-the-art manufacturing facilities and advanced technology</p>
                  </div>
                </div>
                
                <div className="why-join-card">
                  <div className="why-join-icon">🌍</div>
                  <div className="why-join-content">
                    <h3>Global Impact</h3>
                    <p>Our tools serve clients across 30+ countries worldwide</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section 
              ref={addToRefs}
              className="benefits-section section-reveal"
            >
              <h2>Employee Benefits</h2>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <h3>Competitive Salary</h3>
                  <p>Industry-standard compensation with performance bonuses</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🏥</div>
                  <h3>Health Insurance</h3>
                  <p>Comprehensive medical coverage for you and your family</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🎓</div>
                  <h3>Training & Development</h3>
                  <p>Regular skill enhancement programs and certifications</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⚖️</div>
                  <h3>Work-Life Balance</h3>
                  <p>Flexible timing and generous leave policies</p>
                </div>
              </div>
            </section>

            {/* Job Openings Section */}
            <section 
              ref={addToRefs}
              className="openings-section section-reveal"
            >
              <h2>Current Job Openings</h2>
              <div className="job-list">
                <div className="job-card">
                  <h3>CNC Programmer</h3>
                  <div className="job-details">
                    <span>📍 Pune, Maharashtra</span>
                    <span>🏢 Manufacturing Department</span>
                    <span>⏳ 3-5 years experience</span>
                  </div>
                  <p>
                    Develop and optimize CNC programs for precision tool manufacturing. 
                    Expertise in CAD/CAM software and G-code programming required.
                  </p>
                  <button className="apply-btn">
                    Apply Now →
                  </button>
                </div>

                <div className="job-card">
                  <h3>Quality Control Engineer</h3>
                  <div className="job-details">
                    <span>📍 Pune, Maharashtra</span>
                    <span>🏢 Quality Assurance</span>
                    <span>⏳ 2-4 years experience</span>
                  </div>
                  <p>
                    Implement quality control processes and ensure all tools meet international 
                    standards. Knowledge of ISO 9001 and metrology instruments.
                  </p>
                  <button className="apply-btn">
                    Apply Now →
                  </button>
                </div>

                <div className="job-card">
                  <h3>Sales Engineer</h3>
                  <div className="job-details">
                    <span>📍 Multiple Locations</span>
                    <span>🏢 Sales & Marketing</span>
                    <span>⏳ 1-3 years experience</span>
                  </div>
                  <p>
                    Promote DAKS TOOLS products to industrial clients. Technical background 
                    in engineering with excellent communication skills.
                  </p>
                  <button className="apply-btn">
                    Apply Now →
                  </button>
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

export default Career;