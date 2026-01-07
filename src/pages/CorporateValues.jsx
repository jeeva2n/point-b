import React from 'react';
import './css/CorporateValues.css';

const CorporateValues = () => {
  const values = [
    {
      id: 1,
      title: "Integrity & Ethics",
      icon: "🔒",
      description: "Uncompromising honesty and ethical conduct in all our operations.",
      details: [
        "Transparent business practices and communication",
        "Strict adherence to industry regulations and standards",
        "Ethical decision-making at all organizational levels",
        "Accountability for our actions and commitments"
      ],
      color: "#0066ff"
    },
    {
      id: 2,
      title: "Excellence in Quality",
      icon: "⭐",
      description: "Commitment to delivering superior quality in every aspect of our work.",
      details: [
        "Precision-driven testing methodologies",
        "Continuous quality improvement processes",
        "Certified quality management systems",
        "Zero tolerance for compromise on standards"
      ],
      color: "#00aaff"
    },
    {
      id: 3,
      title: "Innovation & Technology",
      icon: "💡",
      description: "Pioneering advanced NDT solutions through continuous innovation.",
      details: [
        "Investment in R&D for cutting-edge technologies",
        "Adoption of AI and machine learning in testing",
        "Digital transformation of inspection processes",
        "Collaboration with research institutions"
      ],
      color: "#ff6b35"
    },
    {
      id: 4,
      title: "Safety First",
      icon: "🛡️",
      description: "Unwavering commitment to safety for our people, clients, and environment.",
      details: [
        "Comprehensive safety protocols and training",
        "Environmental protection initiatives",
        "Regular safety audits and compliance checks",
        "Proactive risk assessment and management"
      ],
      color: "#28a745"
    },
    {
      id: 5,
      title: "Client Partnership",
      icon: "🤝",
      description: "Building long-term relationships based on trust and mutual success.",
      details: [
        "Customized solutions for unique client needs",
        "Responsive and reliable service delivery",
        "Continuous client feedback and improvement",
        "Collaborative approach to problem-solving"
      ],
      color: "#6f42c1"
    },
    {
      id: 6,
      title: "Teamwork & Collaboration",
      icon: "👥",
      description: "Fostering a culture of collaboration and shared success.",
      details: [
        "Cross-functional team integration",
        "Knowledge sharing and continuous learning",
        "Inclusive and diverse workplace culture",
        "Recognition of collective achievements"
      ],
      color: "#17a2b8"
    },
    {
      id: 7,
      title: "Sustainability",
      icon: "🌱",
      description: "Responsible growth and environmental stewardship.",
      details: [
        "Eco-friendly testing methodologies",
        "Sustainable resource management",
        "Carbon footprint reduction initiatives",
        "Community development programs"
      ],
      color: "#20c997"
    },
    {
      id: 8,
      title: "Professional Growth",
      icon: "📈",
      description: "Investing in our people's development and career advancement.",
      details: [
        "Continuous training and certification programs",
        "Leadership development initiatives",
        "Career progression pathways",
        "Technical skills enhancement"
      ],
      color: "#fd7e14"
    }
  ];

  const pillars = [
    {
      title: "Technical Expertise",
      description: "Deep industry knowledge and certified professionals",
      stats: "98% Certified"
    },
    {
      title: "Reliability",
      description: "Consistent, dependable service delivery",
      stats: "99.7% On-Time"
    },
    {
      title: "Innovation",
      description: "Continuous improvement and technology adoption",
      stats: "15+ Patents"
    },
    {
      title: "Integrity",
      description: "Ethical business practices and transparency",
      stats: "0 Major Non-Compliance"
    }
  ];

  return (
    <div className="values-page">
      {/* Page Container */}
      <div className="values-page-container">
        
        {/* HERO HEADER */}
        <header className="values-header">
          <div className="values-header-overlay">
            <h1 className="values-header-title">Corporate Values</h1>
            <div className="values-header-divider"></div>
            <p className="values-header-tagline">
              Guiding Principles That Define Our Excellence
            </p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="values-content-section">
          <div className="values-content-inner">
            
            {/* INTRO SECTION */}
            <div className="values-intro">
              <h2 className="values-section-title">Our Core Principles</h2>
              <h3 className="values-section-subtitle">The Foundation of Our Success</h3>
              <p className="values-section-text">
                Our corporate values are more than just words – they are the fundamental 
                principles that guide every decision, action, and interaction within our 
                organization. These values shape our culture, drive our performance, and 
                define our commitment to excellence in Non-Destructive Testing.
              </p>
            </div>

            {/* PILLARS OF EXCELLENCE */}
            <div className="pillars-section">
              <h3 className="pillars-title">Our Pillars of Excellence</h3>
              <p className="pillars-subtitle">The cornerstones that support our commitment to quality and integrity</p>
              
              <div className="pillars-grid">
                {pillars.map((pillar, index) => (
                  <div key={index} className="pillar-card">
                    <div className="pillar-icon">
                      {index + 1}
                    </div>
                    <h4 className="pillar-title">{pillar.title}</h4>
                    <p className="pillar-description">{pillar.description}</p>
                    <div className="pillar-stats">{pillar.stats}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VALUES GRID */}
            <div className="values-grid">
              {values.map((value) => (
                <div 
                  key={value.id} 
                  className="value-card"
                  style={{ '--value-color': value.color }}
                >
                  <div className="value-header">
                    <div 
                      className="value-icon-container"
                      style={{ backgroundColor: `${value.color}20` }}
                    >
                      <span className="value-icon" style={{ color: value.color }}>
                        {value.icon}
                      </span>
                    </div>
                    <h3 className="value-title">{value.title}</h3>
                  </div>
                  
                  <p className="value-description">{value.description}</p>
                  
                  <div className="value-details">
                    <h4>Key Aspects:</h4>
                    <ul className="details-list">
                      {value.details.map((detail, idx) => (
                        <li key={idx} className="detail-item">
                          <span className="detail-check">✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="value-footer">
                    <div 
                      className="value-line"
                      style={{ backgroundColor: value.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* VALUE IN ACTION */}
            <div className="value-action-section">
              <div className="value-action-content">
                <h3>Values in Action</h3>
                <div className="action-divider"></div>
                <p>
                  Our values come to life through our daily operations, client interactions, 
                  and community engagements. Each team member embodies these principles, 
                  ensuring consistent delivery of exceptional NDT services worldwide.
                </p>
                
                <div className="action-stats">
                  <div className="action-stat">
                    <div className="stat-number">1000+</div>
                    <div className="stat-label">Projects Guided by Values</div>
                  </div>
                  <div className="action-stat">
                    <div className="stat-number">200+</div>
                    <div className="stat-label">Team Members Trained Annually</div>
                  </div>
                  <div className="action-stat">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Countries Served with Integrity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CODE OF CONDUCT */}
            <div className="conduct-section">
              <div className="conduct-card">
                <div className="conduct-icon">📜</div>
                <div className="conduct-content">
                  <h3>Code of Conduct</h3>
                  <p>
                    All employees, partners, and representatives are expected to adhere to 
                    our comprehensive Code of Conduct, which operationalizes our values in 
                    day-to-day business activities and client relationships.
                  </p>
                  <div className="conduct-principles">
                    <div className="principle">
                      <span className="principle-check">✓</span>
                      Ethical Decision Making
                    </div>
                    <div className="principle">
                      <span className="principle-check">✓</span>
                      Respect for All Stakeholders
                    </div>
                    <div className="principle">
                      <span className="principle-check">✓</span>
                      Compliance with Regulations
                    </div>
                    <div className="principle">
                      <span className="principle-check">✓</span>
                      Protection of Client Confidentiality
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LEADERSHIP COMMITMENT */}
            <div className="leadership-section">
              <h3>Leadership Commitment</h3>
              <div className="leadership-grid">
                <div className="leadership-item">
                  <div className="leadership-icon">👨‍💼</div>
                  <h4>Management Accountability</h4>
                  <p>Our leadership team is fully accountable for upholding and promoting our corporate values.</p>
                </div>
                <div className="leadership-item">
                  <div className="leadership-icon">📚</div>
                  <h4>Value-Based Training</h4>
                  <p>Regular training programs ensure all team members understand and embody our values.</p>
                </div>
                <div className="leadership-item">
                  <div className="leadership-icon">🏆</div>
                  <h4>Recognition Programs</h4>
                  <p>We recognize and reward employees who exemplify our values in exceptional ways.</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CorporateValues;