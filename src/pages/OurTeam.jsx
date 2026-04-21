import React from 'react';
import './css/OurTeam.css';
import { Helmet } from 'react-helmet-async';

const OurTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "CEO & Founder",
      department: "Leadership",
      experience: "20+ years in NDT",
      bio: "Pioneered advanced NDT techniques with expertise in ultrasonic testing and digital radiography.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      id: 2,
      name: "Sarah Chen",
      position: "Chief Technology Officer",
      department: "R&D",
      experience: "15+ years",
      bio: "Leads innovation in phased array ultrasound and AI-based defect recognition systems.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      position: "Operations Director",
      department: "Operations",
      experience: "18+ years",
      bio: "Specializes in large-scale industrial NDT projects across oil & gas and aerospace sectors.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      id: 4,
      name: "Emma Williams",
      position: "Quality Assurance Lead",
      department: "Quality",
      experience: "12+ years",
      bio: "Certified Level III inspector with expertise in ASNT, ISO, and API standards compliance.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      id: 5,
      name: "David Kim",
      position: "Senior NDT Engineer",
      department: "Engineering",
      experience: "14+ years",
      bio: "Expert in magnetic particle and dye penetrant testing for critical infrastructure.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      id: 6,
      name: "Lisa Anderson",
      position: "Client Relations Manager",
      department: "Business Development",
      experience: "10+ years",
      bio: "Builds strategic partnerships with global energy and manufacturing companies.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      id: 7,
      name: "James Wilson",
      position: "R&D Scientist",
      department: "Research",
      experience: "8+ years",
      bio: "Focuses on developing next-generation digital radiography and computed tomography solutions.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      id: 8,
      name: "Priya Sharma",
      position: "Training Coordinator",
      department: "Education",
      experience: "9+ years",
      bio: "Develops NDT certification programs and continuous professional development courses.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    }
  ];

  const departments = [
    { name: "All", count: teamMembers.length },
    { name: "Leadership", count: teamMembers.filter(m => m.department === "Leadership").length },
    { name: "R&D", count: teamMembers.filter(m => m.department === "R&D").length },
    { name: "Engineering", count: teamMembers.filter(m => m.department === "Engineering").length },
    { name: "Quality", count: teamMembers.filter(m => m.department === "Quality").length },
    { name: "Operations", count: teamMembers.filter(m => m.department === "Operations").length },
    { name: "Research", count: teamMembers.filter(m => m.department === "Research").length },
    { name: "Business Development", count: teamMembers.filter(m => m.department === "Business Development").length },
    { name: "Education", count: teamMembers.filter(m => m.department === "Education").length }
  ];

  const [filter, setFilter] = React.useState("All");
  const [selectedMember, setSelectedMember] = React.useState(null);

  const filteredMembers = filter === "All" 
    ? teamMembers 
    : teamMembers.filter(member => member.department === filter);

  const openMemberModal = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeMemberModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
  };

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const teamSeoData = {
    title: "Our Team | NDT Experts & Certified Inspectors – DAKS Tools Chennai",
    description: "Meet the DAKS Tools leadership team: 8+ NDT experts with 150+ years combined experience. ASNT Level III certified inspectors, R&D scientists, and quality assurance specialists in Chennai, India.",
    keywords: "DAKS Tools team, NDT experts Chennai, Level III NDT inspectors India, ultrasonic testing specialists, NDT engineers Tamil Nadu, quality assurance professionals, R&D scientists NDT, certified NDT personnel Chennai",
    canonicalUrl: "https://dakstools.com/company/team",
    ogImage: "https://dakstools.com/images/our-team-daks-tools.jpg"
  };

  const teamSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "name": "DAKS Tools Leadership Team & NDT Experts",
        "description": teamSeoData.description,
        "url": teamSeoData.canonicalUrl,
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
            "name": "Our Team",
            "item": "https://dakstools.com/company/team"
          }
        ]
      },
      {
        "@type": "Organization",
        "name": "DAKS Tools",
        "url": "https://dakstools.com",
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": teamMembers.length,
          "unitText": "Core Team Members"
        },
        "employee": teamMembers.map(member => ({
          "@type": "Person",
          "name": member.name,
          "jobTitle": member.position,
          "worksFor": {
            "@type": "Organization",
            "name": "DAKS Tools"
          },
          "description": member.bio,
          "hasOccupation": {
            "@type": "Occupation",
            "name": member.department,
            "occupationLocation": {
              "@type": "City",
              "name": "Chennai"
            }
          }
        }))
      },
      {
        "@type": "ItemList",
        "name": "DAKS Tools Department Structure",
        "description": "Nine specialized departments driving NDT innovation and quality assurance.",
        "numberOfItems": departments.filter(d => d.name !== "All").length,
        "itemListElement": departments.filter(d => d.name !== "All").map((dept, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Organization",
            "name": `${dept.name} Department`,
            "numberOfEmployees": dept.count
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who leads the DAKS Tools team?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools is led by CEO & Founder Alex Johnson with 20+ years in NDT, supported by CTO Sarah Chen (15+ years in R&D), Operations Director Michael Rodriguez (18+ years), and Quality Assurance Lead Emma Williams (ASNT Level III certified)."
            }
          },
          {
            "@type": "Question",
            "name": "What certifications do DAKS Tools team members hold?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our team includes ASNT Level III certified inspectors, ISO 17025 quality specialists, and professionals certified in ultrasonic testing (UT), magnetic particle testing (MT), dye penetrant testing (PT), radiographic testing (RT), and eddy current testing (ET)."
            }
          },
          {
            "@type": "Question",
            "name": "How many NDT experts work at DAKS Tools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools employs 8+ core NDT experts across 9 departments including Leadership, R&D, Engineering, Quality, Operations, Research, Business Development, and Education, with 150+ years of combined industry experience."
            }
          },
          {
            "@type": "Question",
            "name": "Where is the DAKS Tools team based?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The DAKS Tools team is headquartered in Chennai, Tamil Nadu, India, serving clients across 50+ countries with NDT calibration blocks, flawed specimens, and inspection solutions."
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
        <title>{teamSeoData.title}</title>
        <meta name="description" content={teamSeoData.description} />
        <meta name="keywords" content={teamSeoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={teamSeoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={teamSeoData.canonicalUrl} />
        <meta property="og:title" content="DAKS Tools Leadership Team – NDT Experts & Certified Inspectors" />
        <meta property="og:description" content={teamSeoData.description} />
        <meta property="og:image" content={teamSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools Team - NDT Experts in Chennai" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="DAKS Tools Team – Certified NDT Professionals" />
        <meta name="twitter:description" content={teamSeoData.description} />
        <meta name="twitter:image" content={teamSeoData.ogImage} />
        <meta name="twitter:image:alt" content="DAKS Tools Leadership Team" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(teamSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="team-page">
        {/* Page Container */}
        <div className="team-page-container">
          
          {/* HERO HEADER */}
          <header className="team-header">
            <div className="team-header-overlay">
              <h1 className="team-header-title">Our Leadership Team</h1>
              <div className="team-header-divider"></div>
              <p className="team-header-tagline">
                Certified NDT Experts Driving Innovation in Chennai & Global Markets
              </p>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="team-content-section">
            <div className="team-content-inner">
              
              {/* INTRO SECTION */}
              <div className="team-intro">
                <h2 className="team-section-title">Meet Our NDT Experts</h2>
                <h3 className="team-section-subtitle">Dedicated Professionals Advancing Non-Destructive Testing Technology</h3>
                <p className="team-section-text">
                  At DAKS Tools, our Chennai-based team comprises industry veterans, ASNT Level III certified inspectors, 
                  and innovative researchers who bring 150+ years of combined experience in Non-Destructive Testing. 
                  Each member contributes unique expertise in ultrasonic calibration, flawed specimen manufacturing, 
                  and delivering cutting-edge NDT solutions across India and 50+ countries.
                </p>
              </div>

              {/* TEAM STATS */}
              <div className="team-stats">
                <div className="stat-card">
                  <div className="stat-number">{teamMembers.length}+</div>
                  <div className="stat-label">Core Team Members</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Years Combined Experience</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">9</div>
                  <div className="stat-label">Specialized Departments</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">Level III</div>
                  <div className="stat-label">ASNT Certified Inspectors</div>
                </div>
              </div>

              {/* DEPARTMENT FILTER */}
              <div className="department-filter">
                <div className="filter-container">
                  <span className="filter-label">Filter by Department:</span>
                  <div className="filter-buttons">
                    {departments.map((dept, index) => (
                      <button
                        key={index}
                        className={`filter-btn ${filter === dept.name ? 'active' : ''}`}
                        onClick={() => setFilter(dept.name)}
                        aria-label={`Filter by ${dept.name} department`}
                      >
                        {dept.name} <span className="member-count">({dept.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TEAM GRID */}
              <div className="team-grid">
                {filteredMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="team-card"
                    onClick={() => openMemberModal(member)}
                  >
                    <div className="member-image-container">
                      <img 
                        src={member.image} 
                        alt={`${member.name} - ${member.position} at DAKS Tools NDT Chennai`}
                        className="member-image"
                        loading="lazy"
                      />
                      <div className="department-badge">{member.department}</div>
                    </div>
                    <div className="member-info">
                      <h4 className="member-name">{member.name}</h4>
                      <p className="member-position">{member.position}</p>
                      <div className="member-experience">
                        <span className="exp-icon" aria-label="Experience">⏳</span>
                        <span>{member.experience}</span>
                      </div>
                      <p className="member-bio">{member.bio}</p>
                    </div>
                    <div className="member-overlay">
                      <div className="overlay-content">
                        <span className="view-profile">View Full Profile →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </main>
        </div>

        {/* TEAM MEMBER MODAL */}
        {selectedMember && (
          <div className="team-modal-overlay" onClick={closeMemberModal}>
            <div className="team-modal-container" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeMemberModal} aria-label="Close profile">×</button>
              
              <div className="modal-content">
                <div className="modal-image-section">
                  <img 
                    src={selectedMember.image} 
                    alt={`${selectedMember.name} - ${selectedMember.position} at DAKS Tools`}
                    className="modal-member-image"
                  />
                  <div className="modal-department">{selectedMember.department}</div>
                </div>
                
                <div className="modal-info-section">
                  <div className="modal-header">
                    <h2 className="modal-name">{selectedMember.name}</h2>
                    <p className="modal-position">{selectedMember.position}</p>
                    <div className="modal-experience">
                      <span className="exp-badge">{selectedMember.experience}</span>
                    </div>
                  </div>
                  
                  <div className="modal-bio">
                    <h4>Professional Background</h4>
                    <p>{selectedMember.bio}</p>
                    <p>
                      {selectedMember.name} has contributed significantly to the field of Non-Destructive Testing 
                      at DAKS Tools' Chennai facility, with expertise spanning multiple methodologies including 
                      ultrasonic testing, phased array, and industry applications across oil & gas, aerospace, 
                      and manufacturing sectors. Their work focuses on advancing testing accuracy and developing 
                      innovative calibration solutions.
                    </p>
                  </div>
                  
                  <div className="modal-expertise">
                    <h4>Areas of Expertise</h4>
                    <div className="expertise-tags">
                      <span className="expertise-tag">Ultrasonic Testing (UT)</span>
                      <span className="expertise-tag">Digital Radiography</span>
                      <span className="expertise-tag">ISO 17025 Standards</span>
                      <span className="expertise-tag">ASME Compliance</span>
                      <span className="expertise-tag">Project Management</span>
                      <span className="expertise-tag">Quality Assurance</span>
                    </div>
                  </div>
                  
                  <div className="modal-contact">
                    <h4>Connect with {selectedMember.name}</h4>
                    <div className="social-links">
                      <a href={selectedMember.social.linkedin} className="social-link linkedin" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                      <a href={selectedMember.social.twitter} className="social-link twitter" target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                      <a href={`mailto:${selectedMember.social.email}`} className="social-link email">
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OurTeam;