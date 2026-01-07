import React, { useState } from 'react';
import './css/CSRActivity.css';

const CSRActivity = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const csrActivities = [
    {
      id: 1,
      title: "NDT Training for Underprivileged Youth",
      category: "education",
      date: "Dec 2024",
      location: "Chennai, India",
      description: "Providing free NDT certification training to underprivileged youth to create employment opportunities in the technical field.",
      impact: [
        "50+ youth trained and certified",
        "80% placement success rate",
        "Partnership with 5 local technical institutes"
      ],
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 50,
        duration: "6 months",
        investment: "$50,000"
      },
      featured: true
    },
    {
      id: 2,
      title: "Environmental Protection Initiative",
      category: "environment",
      date: "Nov 2024",
      location: "Coastal Regions, Global",
      description: "Cleaning industrial waste from coastal areas and implementing sustainable waste management practices.",
      impact: [
        "10+ tons of waste collected",
        "5 coastal communities benefited",
        "Recycling program established"
      ],
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 5000,
        duration: "Ongoing",
        investment: "$30,000"
      },
      featured: true
    },
    {
      id: 3,
      title: "Disaster Relief Equipment Support",
      category: "community",
      date: "Oct 2024",
      location: "Earthquake Affected Areas",
      description: "Providing advanced NDT equipment and technical expertise for structural safety assessment in disaster zones.",
      impact: [
        "100+ buildings assessed",
        "Emergency response teams trained",
        "Safety protocols established"
      ],
      image: "https://images.unsplash.com/photo-1540397106260-e24a50708908?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 10000,
        duration: "2 months",
        investment: "$75,000"
      },
      featured: false
    },
    {
      id: 4,
      title: "Digital Education for Remote Areas",
      category: "education",
      date: "Sep 2024",
      location: "Rural Africa",
      description: "Establishing digital learning centers with NDT curriculum for remote communities.",
      impact: [
        "3 learning centers established",
        "200+ students enrolled",
        "Solar-powered computer labs"
      ],
      image: "https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 200,
        duration: "12 months",
        investment: "$40,000"
      },
      featured: false
    },
    {
      id: 5,
      title: "Sustainable Manufacturing Workshop",
      category: "environment",
      date: "Aug 2024",
      location: "Southeast Asia",
      description: "Training local manufacturers on eco-friendly industrial practices and sustainable NDT methods.",
      impact: [
        "25 factories trained",
        "30% reduction in waste reported",
        "Sustainable practices adopted"
      ],
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 150,
        duration: "3 months",
        investment: "$35,000"
      },
      featured: false
    },
    {
      id: 6,
      title: "Healthcare Infrastructure Support",
      category: "community",
      date: "Jul 2024",
      location: "Developing Countries",
      description: "Providing NDT services for healthcare infrastructure safety assessment and maintenance.",
      impact: [
        "15 hospitals assessed",
        "Safety upgrades implemented",
        "Maintenance training provided"
      ],
      image: "https://images.unsplash.com/photo-1516549655669-df1d1f6c8d7d?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 20000,
        duration: "4 months",
        investment: "$60,000"
      },
      featured: false
    },
    {
      id: 7,
      title: "Women in NDT Program",
      category: "diversity",
      date: "Jun 2024",
      location: "Global",
      description: "Empowering women through specialized NDT training and career development programs.",
      impact: [
        "100+ women trained",
        "40% increase in female technicians",
        "Mentorship program established"
      ],
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 100,
        duration: "Ongoing",
        investment: "$45,000"
      },
      featured: true
    },
    {
      id: 8,
      title: "Veteran Employment Initiative",
      category: "community",
      date: "May 2024",
      location: "North America",
      description: "Creating employment opportunities for military veterans in the NDT industry.",
      impact: [
        "75 veterans employed",
        "Specialized training provided",
        "Support network established"
      ],
      image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=800&h=500&fit=crop",
      stats: {
        beneficiaries: 75,
        duration: "Ongoing",
        investment: "$55,000"
      },
      featured: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Activities', count: csrActivities.length },
    { id: 'education', label: 'Education', count: csrActivities.filter(a => a.category === 'education').length },
    { id: 'environment', label: 'Environment', count: csrActivities.filter(a => a.category === 'environment').length },
    { id: 'community', label: 'Community', count: csrActivities.filter(a => a.category === 'community').length },
    { id: 'diversity', label: 'Diversity', count: csrActivities.filter(a => a.category === 'diversity').length }
  ];

  const stats = [
    { number: "8+", label: "Active Programs", icon: "📊" },
    { number: "25+", label: "Countries Reached", icon: "🌍" },
    { number: "$350K+", label: "Annual Investment", icon: "💰" },
    { number: "50K+", label: "Lives Impacted", icon: "👥" }
  ];

  const filteredActivities = activeCategory === 'all' 
    ? csrActivities 
    : csrActivities.filter(activity => activity.category === activeCategory);

  const featuredActivities = csrActivities.filter(activity => activity.featured);

  return (
    <div className="csr-page">
      {/* Page Container */}
      <div className="csr-page-container">
        
        {/* HERO HEADER */}
        <header className="csr-header">
          <div className="csr-header-overlay">
            <h1 className="csr-header-title">Corporate Social Responsibility</h1>
            <div className="csr-header-divider"></div>
            <p className="csr-header-tagline">
              Building Sustainable Communities Through Responsible Action
            </p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="csr-content-section">
          <div className="csr-content-inner">
            
            {/* INTRO SECTION */}
            <div className="csr-intro">
              <h2 className="csr-section-title">Our CSR Commitment</h2>
              <h3 className="csr-section-subtitle">Making a Positive Impact Beyond Business</h3>
              <p className="csr-section-text">
                At our core, we believe that responsible business practices extend beyond 
                financial success. Our CSR initiatives focus on education, environmental 
                sustainability, community development, and diversity – creating lasting 
                positive change in the communities we serve.
              </p>
            </div>

            {/* CSR STATS */}
            <div className="csr-stats-section">
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED INITIATIVES */}
            <div className="featured-initiatives">
              <h3 className="section-title">
                <span className="title-icon">⭐</span>
                Featured Initiatives
              </h3>
              <div className="featured-grid">
                {featuredActivities.map(activity => (
                  <div key={activity.id} className="featured-card">
                    <div className="featured-image-container">
                      <img 
                        src={activity.image} 
                        alt={activity.title}
                        className="featured-image"
                      />
                      <div className="featured-badge">Featured</div>
                      <div className="category-badge" data-category={activity.category}>
                        {categories.find(c => c.id === activity.category)?.label}
                      </div>
                    </div>
                    <div className="featured-content">
                      <div className="activity-meta">
                        <span className="activity-date">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {activity.date}
                        </span>
                        <span className="activity-location">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.location}
                        </span>
                      </div>
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-description">{activity.description}</p>
                      
                      <div className="impact-list">
                        <h5>Key Impacts:</h5>
                        <ul>
                          {activity.impact.map((item, idx) => (
                            <li key={idx}>
                              <span className="impact-check">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="activity-stats">
                        <div className="stat-item">
                          <div className="stat-value">{activity.stats.beneficiaries.toLocaleString()}+</div>
                          <div className="stat-name">Beneficiaries</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{activity.stats.duration}</div>
                          <div className="stat-name">Duration</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{activity.stats.investment}</div>
                          <div className="stat-name">Investment</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="csr-filter-section">
              <div className="filter-container">
                <h4 className="filter-title">Filter by Category:</h4>
                <div className="filter-buttons">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.label}
                      <span className="category-count">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ALL CSR ACTIVITIES GRID */}
            <div className="csr-activities-grid">
              {filteredActivities.map(activity => (
                <div key={activity.id} className="csr-card">
                  <div className="csr-image-container">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="csr-image"
                    />
                    <div className="csr-category-badge" data-category={activity.category}>
                      {categories.find(c => c.id === activity.category)?.label}
                    </div>
                    {activity.featured && (
                      <div className="csr-featured-badge">Featured</div>
                    )}
                  </div>
                  
                  <div className="csr-content">
                    <div className="csr-meta">
                      <span className="csr-date">{activity.date}</span>
                      <span className="csr-location">{activity.location}</span>
                    </div>
                    
                    <h4 className="csr-title">{activity.title}</h4>
                    <p className="csr-description">{activity.description}</p>
                    
                    <div className="csr-impact-preview">
                      <div className="impact-item">
                        <span className="impact-icon">👥</span>
                        <span className="impact-text">{activity.stats.beneficiaries.toLocaleString()}+ Beneficiaries</span>
                      </div>
                      <div className="impact-item">
                        <span className="impact-icon">⏱️</span>
                        <span className="impact-text">{activity.stats.duration} Program</span>
                      </div>
                    </div>
                    
                    <button className="view-details-btn">
                      View Details
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CSR FRAMEWORK */}
            <div className="csr-framework">
              <h3 className="framework-title">Our CSR Framework</h3>
              <div className="framework-grid">
                <div className="framework-card">
                  <div className="framework-icon">🎯</div>
                  <h4>Strategic Approach</h4>
                  <p>Integrating CSR into core business operations for sustainable impact.</p>
                  <ul>
                    <li>Long-term partnerships</li>
                    <li>Measurable outcomes</li>
                    <li>Regular impact assessment</li>
                  </ul>
                </div>
                <div className="framework-card">
                  <div className="framework-icon">🤝</div>
                  <h4>Stakeholder Engagement</h4>
                  <p>Collaborating with communities, NGOs, and government bodies.</p>
                  <ul>
                    <li>Community consultations</li>
                    <li>Transparent reporting</li>
                    <li>Feedback mechanisms</li>
                  </ul>
                </div>
                <div className="framework-card">
                  <div className="framework-icon">📈</div>
                  <h4>Sustainability Goals</h4>
                  <p>Aligning with UN Sustainable Development Goals (SDGs).</p>
                  <ul>
                    <li>Quality education (SDG 4)</li>
                    <li>Climate action (SDG 13)</li>
                    <li>Reduced inequalities (SDG 10)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PARTNERSHIPS */}
            <div className="partnerships-section">
              <h3 className="partnerships-title">CSR Partnerships</h3>
              <div className="partners-grid">
                <div className="partner-card">
                  <div className="partner-icon">🏛️</div>
                  <h4>Government Bodies</h4>
                  <p>Collaborating with local and national governments for community development.</p>
                </div>
                <div className="partner-card">
                  <div className="partner-icon">🌱</div>
                  <h4>NGOs</h4>
                  <p>Partnering with non-profits for specialized community programs.</p>
                </div>
                <div className="partner-card">
                  <div className="partner-icon">🏫</div>
                  <h4>Educational Institutions</h4>
                  <p>Working with schools and universities for skill development.</p>
                </div>
                <div className="partner-card">
                  <div className="partner-icon">👨‍👩‍👧‍👦</div>
                  <h4>Community Groups</h4>
                  <p>Engaging local communities for grassroots initiatives.</p>
                </div>
              </div>
            </div>

            {/* GET INVOLVED */}
            <div className="get-involved-section">
              <div className="involved-content">
                <h3>Get Involved</h3>
                <p>Join us in making a difference. Explore partnership opportunities or volunteer for our CSR programs.</p>
                <div className="involved-buttons">
                  <button className="partner-btn">
                    Become a Partner
                  </button>
                  <button className="volunteer-btn">
                    Volunteer
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CSRActivity;