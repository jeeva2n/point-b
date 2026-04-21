import React from 'react';
import './css/CorporateValues.css';
import { Helmet } from 'react-helmet-async';

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

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const valuesSeoData = {
    title: "Corporate Values | Integrity, Quality & Innovation – DAKS Tools Chennai",
    description: "Discover DAKS Tools' core values: Integrity, Excellence, Innovation, Safety, and Client Partnership. ISO 17025 certified NDT manufacturer in Chennai with 98% certified professionals.",
    keywords: "DAKS Tools corporate values, NDT company ethics Chennai, integrity in NDT testing, quality excellence NDT India, innovation in ultrasonic testing, safety first NDT Chennai, client partnership NDT, corporate culture DAKS Tools",
    canonicalUrl: "https://dakstools.com/cvalues",
    ogImage: "https://dakstools.com/images/corporate-values-daks-tools.jpg"
  };

  const valuesSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "name": "DAKS Tools Corporate Values & Ethics",
        "description": valuesSeoData.description,
        "url": valuesSeoData.canonicalUrl,
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
            "name": "Company",
            "item": "https://dakstools.com/company"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Corporate Values",
            "item": "https://dakstools.com/cvalues"
          }
        ]
      },
      {
        "@type": "Organization",
        "name": "DAKS Tools",
        "url": "https://dakstools.com",
        "description": "Leading NDT equipment manufacturer in Chennai with strong corporate values of integrity, quality excellence, innovation, and safety.",
        "knowsAbout": [
          "Corporate Ethics",
          "Quality Management",
          "NDT Innovation",
          "Safety Standards",
          "Client Partnership"
        ],
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "ISO 17025 Certification"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "ASME Section V Compliance"
          }
        ],
        "employee": {
          "@type": "Person",
          "description": "98% certified NDT professionals"
        }
      },
      {
        "@type": "ItemList",
        "name": "DAKS Tools Core Corporate Values",
        "description": "Eight fundamental values guiding DAKS Tools' operations and client relationships.",
        "numberOfItems": values.length,
        "itemListElement": values.map((value, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Thing",
            "name": value.title,
            "description": value.description
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are DAKS Tools' core corporate values?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools operates on eight core values: Integrity & Ethics, Excellence in Quality, Innovation & Technology, Safety First, Client Partnership, Teamwork & Collaboration, Sustainability, and Professional Growth. These principles guide every aspect of our NDT manufacturing and service delivery in Chennai."
            }
          },
          {
            "@type": "Question",
            "name": "How does DAKS Tools ensure quality excellence?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools ensures quality excellence through ISO 17025 certified processes, precision-driven testing methodologies, continuous quality improvement programs, and zero tolerance for compromise on international standards including ASME and ASTM."
            }
          },
          {
            "@type": "Question",
            "name": "What is DAKS Tools' approach to innovation in NDT?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools pioneers NDT innovation through dedicated R&D investments, adoption of AI and machine learning in testing, digital transformation of inspection processes, and strategic collaborations with leading research institutions. We hold 15+ patents in NDT technology."
            }
          },
          {
            "@type": "Question",
            "name": "How does DAKS Tools prioritize safety?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Safety is a non-negotiable value at DAKS Tools. We implement comprehensive safety protocols, regular safety audits, environmental protection initiatives, and proactive risk assessment for all our people, clients, and community stakeholders."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* ==========================================
          SEO - REACT HELMET COMPONENT
      ========================================== */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{valuesSeoData.title}</title>
        <meta name="description" content={valuesSeoData.description} />
        <meta name="keywords" content={valuesSeoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={valuesSeoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={valuesSeoData.canonicalUrl} />
        <meta property="og:title" content="DAKS Tools Corporate Values – Integrity, Quality & Innovation" />
        <meta property="og:description" content={valuesSeoData.description} />
        <meta property="og:image" content={valuesSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools Corporate Values - 8 Core Principles" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="DAKS Tools Corporate Values – Excellence in NDT" />
        <meta name="twitter:description" content={valuesSeoData.description} />
        <meta name="twitter:image" content={valuesSeoData.ogImage} />
        <meta name="twitter:image:alt" content="DAKS Tools Corporate Values and Ethics" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(valuesSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="values-page">
        {/* Page Container */}
        <div className="values-page-container">
          
          {/* HERO HEADER */}
          <header className="values-header">
            <div className="values-header-overlay">
              <h1 className="values-header-title">Corporate Values & Ethics</h1>
              <div className="values-header-divider"></div>
              <p className="values-header-tagline">
                Eight Guiding Principles That Define Our Excellence in NDT
              </p>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="values-content-section">
            <div className="values-content-inner">
              
              {/* INTRO SECTION */}
              <div className="values-intro">
                <h2 className="values-section-title">Our Core Principles</h2>
                <h3 className="values-section-subtitle">The Foundation of Our Success in NDT Manufacturing</h3>
                <p className="values-section-text">
                  At DAKS Tools, our corporate values are more than just words – they are the fundamental 
                  principles that guide every decision, action, and client interaction within our 
                  Chennai-based NDT manufacturing organization. These values shape our culture, drive our performance, and 
                  define our commitment to excellence in Non-Destructive Testing across India and global markets.
                </p>
              </div>

              {/* PILLARS OF EXCELLENCE */}
              <div className="pillars-section">
                <h3 className="pillars-title">Our Pillars of Excellence</h3>
                <p className="pillars-subtitle">The cornerstones that support our commitment to quality and integrity in NDT</p>
                
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
                        <span className="value-icon" style={{ color: value.color }} aria-label={value.title}>
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
                  <h3>Values in Action Across Global NDT Projects</h3>
                  <div className="action-divider"></div>
                  <p>
                    Our values come to life through daily operations at our Chennai facility, client interactions worldwide, 
                    and community engagements across India. Each of our 200+ team members embodies these principles, 
                    ensuring consistent delivery of exceptional NDT calibration blocks, flawed specimens, and inspection solutions.
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
                  <div className="conduct-icon" aria-label="Code of Conduct">📜</div>
                  <div className="conduct-content">
                    <h3>Code of Conduct & Ethics Policy</h3>
                    <p>
                      All DAKS Tools employees, business partners, and representatives are expected to adhere to 
                      our comprehensive Code of Conduct, which operationalizes our corporate values in 
                      day-to-day NDT manufacturing, client relationships, and global business activities.
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
                        Compliance with ISO & ASME Regulations
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
                <h3>Leadership Commitment to Corporate Values</h3>
                <div className="leadership-grid">
                  <div className="leadership-item">
                    <div className="leadership-icon" aria-label="Management">👨‍💼</div>
                    <h4>Management Accountability</h4>
                    <p>Our leadership team at DAKS Tools is fully accountable for upholding and promoting our corporate values across all NDT operations.</p>
                  </div>
                  <div className="leadership-item">
                    <div className="leadership-icon" aria-label="Training">📚</div>
                    <h4>Value-Based Training</h4>
                    <p>Regular ethics and values training programs ensure all team members understand and embody our principles in daily work.</p>
                  </div>
                  <div className="leadership-item">
                    <div className="leadership-icon" aria-label="Recognition">🏆</div>
                    <h4>Recognition Programs</h4>
                    <p>We recognize and reward employees who exemplify our corporate values in exceptional ways through quarterly awards.</p>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CorporateValues;