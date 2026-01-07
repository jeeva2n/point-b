import React from 'react';
import './css/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* 1. Page Container (Side Borders Effect) */}
      <div className="about-page-container">
        
        {/* 2. HERO HEADER */}
        <header className="about-header">
          <div className="about-header-overlay">
            <h1 className="about-header-title">About Us</h1>
            <div className="about-header-divider"></div>
            <p className="about-header-tagline">
              Discover the Future of Non-Destructive Testing with Us
            </p>
          </div>
        </header>

        {/* 3. MAIN CONTENT */}
        <main className="about-content-section">
          <div className="about-content-inner">
            
            {/* INTRO SECTION */}
            <div className="intro-section">
              <h2 className="section-title">Welcome to Our Company</h2>
              <h3 className="section-subtitle">Leading Technologists in NDT and Manufacturer of Innovative Solutions</h3>
              <p className="section-text">
                At Our Company, we pride ourselves on being the premier technologist in the field of 
                Non-Destructive Testing (NDT). With a strong commitment to excellence and a passion 
                for innovation, we provide cutting-edge solutions that empower industries to ensure 
                the highest quality and safety standards.
              </p>
            </div>

            {/* MISSION & VISION GRID */}
            <div className="mv-grid">
              
              {/* Mission Card */}
              <div className="mv-card">
                <div className="mv-icon-wrapper">
                  {/* Target/Mission SVG Icon */}
                  <svg width="40" height="40" fill="none" stroke="#0066ff" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z" /> 
                   
                  </svg>
                </div>
                <h3>Our Mission</h3>
                <p>
                  To be a leading NDT technologist and provider of innovative solutions. 
                  We are driven by our passion for excellence and our commitment to delivering 
                  cutting-edge technology that revolutionizes the field of Non-Destructive Testing (NDT). 
                  Our goal is to empower industries with advanced solutions that ensure the highest 
                  quality standards, promote safety, and drive operational efficiency.
                </p>
              </div>

              {/* Vision Card */}
              <div className="mv-card">
                <div className="mv-icon-wrapper">
                  {/* Globe/Vision SVG Icon */}
                  <svg width="40" height="40" fill="none" stroke="#0066ff" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <h3>Our Vision</h3>
                <p>
                  To be a global leader in the field of Non-Destructive Testing (NDT) business. 
                  We aspire to shape the future of NDT by introducing groundbreaking technologies, 
                  driving innovation, and setting new industry standards. Our vision is centered 
                  around four key pillars that guide our path towards excellence and success.
                </p>
              </div>

            </div>

            {/* WHY CHOOSE US SECTION */}
            <div className="why-choose-section">
              <h2 className="why-choose-title">Why Choose Us</h2>
              
              <div className="why-choose-grid">
                <div className="why-card">
                  <div className="why-card-number">01</div>
                  <h4>Industry Expertise</h4>
                  <p>
                    With decades of experience in NDT technology, our team possesses deep 
                    industry knowledge and technical proficiency to deliver superior solutions 
                    tailored to your specific needs.
                  </p>
                </div>
                
                <div className="why-card">
                  <div className="why-card-number">02</div>
                  <h4>Cutting-Edge Innovation</h4>
                  <p>
                    We invest heavily in R&D to develop next-generation NDT solutions that 
                    push the boundaries of what's possible in quality assurance and 
                    structural integrity testing.
                  </p>
                </div>
                
                <div className="why-card">
                  <div className="why-card-number">03</div>
                  <h4>Global Standards Compliance</h4>
                  <p>
                    All our products and services meet international quality standards 
                    including ISO, ASME, and ASTM, ensuring reliable performance across 
                    global markets.
                  </p>
                </div>
                
                <div className="why-card">
                  <div className="why-card-number">04</div>
                  <h4>Customized Solutions</h4>
                  <p>
                    We understand that every project is unique. Our team works closely with 
                    clients to develop customized NDT solutions that address specific 
                    challenges and requirements.
                  </p>
                </div>
              </div>

              {/* STATISTICS */}
              <div className="stats-section">
                <h3 className="stats-title">Our Impact in Numbers</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">15+</div>
                    <div className="stat-label">Years of Excellence</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Projects Completed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">30+</div>
                    <div className="stat-label">Countries Served</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* COMMITMENT SECTION */}
            <div className="commitment-section">
              <div className="commitment-content">
                <h2>Our Commitment to Quality and Innovation</h2>
                <div className="commitment-divider"></div>
                <p>
                  Quality and innovation are the cornerstones of Our Company. We adhere to stringent 
                  manufacturing processes, robust quality control measures, and continuous research 
                  and development. 
                </p>
                <p>
                  By embracing the latest advancements in NDT technology, we create products that not 
                  only meet but exceed industry standards. Our team of dedicated technologists and 
                  engineers relentlessly work towards delivering innovative solutions that drive 
                  exceptional performance and reliability.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutUs;