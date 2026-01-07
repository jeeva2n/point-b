import React from 'react';
import './css/OurTeam.css';

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

  return (
    <div className="team-page">
      {/* Page Container */}
      <div className="team-page-container">
        
        {/* HERO HEADER */}
        <header className="team-header">
          <div className="team-header-overlay">
            <h1 className="team-header-title">Our Team</h1>
            <div className="team-header-divider"></div>
            <p className="team-header-tagline">
              Experts Driving Innovation in Non-Destructive Testing
            </p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="team-content-section">
          <div className="team-content-inner">
            
            {/* INTRO SECTION */}
            <div className="team-intro">
              <h2 className="team-section-title">Meet Our Experts</h2>
              <h3 className="team-section-subtitle">Dedicated Professionals Advancing NDT Technology</h3>
              <p className="team-section-text">
                Our team comprises industry veterans, certified inspectors, and innovative researchers 
                who bring decades of combined experience in Non-Destructive Testing. Each member 
                contributes unique expertise to deliver cutting-edge solutions and exceptional service.
              </p>
            </div>

            {/* TEAM STATS */}
            <div className="team-stats">
              <div className="stat-card">
                <div className="stat-number">{teamMembers.length}+</div>
                <div className="stat-label">Team Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">150+</div>
                <div className="stat-label">Years Combined Experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">9</div>
                <div className="stat-label">Departments</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">Level III</div>
                <div className="stat-label">Certified Inspectors</div>
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
                      alt={member.name}
                      className="member-image"
                      loading="lazy"
                    />
                    <div className="department-badge">{member.department}</div>
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">{member.name}</h4>
                    <p className="member-position">{member.position}</p>
                    <div className="member-experience">
                      <span className="exp-icon">⏳</span>
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
            <button className="modal-close" onClick={closeMemberModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-image-section">
                <img 
                  src={selectedMember.image} 
                  alt={selectedMember.name}
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
                    {selectedMember.name} has contributed significantly to the field of Non-Destructive Testing, 
                    with expertise spanning multiple methodologies and industry applications. Their work 
                    focuses on advancing testing accuracy and developing innovative inspection solutions.
                  </p>
                </div>
                
                <div className="modal-expertise">
                  <h4>Areas of Expertise</h4>
                  <div className="expertise-tags">
                    <span className="expertise-tag">Ultrasonic Testing</span>
                    <span className="expertise-tag">Digital Radiography</span>
                    <span className="expertise-tag">Quality Standards</span>
                    <span className="expertise-tag">Project Management</span>
                  </div>
                </div>
                
                <div className="modal-contact">
                  <h4>Connect</h4>
                  <div className="social-links">
                    <a href={selectedMember.social.linkedin} className="social-link linkedin">
                      LinkedIn
                    </a>
                    <a href={selectedMember.social.twitter} className="social-link twitter">
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
  );
};

export default OurTeam;