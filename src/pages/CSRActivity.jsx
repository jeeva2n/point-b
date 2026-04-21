import React, { useState } from 'react';
import './css/CSRActivity.css';
import { Helmet } from 'react-helmet-async';

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

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const csrSeoData = {
    title: "CSR Activities | Corporate Social Responsibility – DAKS Tools Chennai",
    description: "DAKS Tools CSR initiatives: NDT training for underprivileged youth, environmental protection, disaster relief, women in NDT programs. 50K+ lives impacted across 25+ countries from our Chennai headquarters.",
    keywords: "CSR activities NDT company, DAKS Tools corporate social responsibility Chennai, NDT training underprivileged youth India, environmental sustainability NDT, women in NDT program, disaster relief NDT equipment, community development Chennai",
    canonicalUrl: "https://dakstools.com/csra",
    ogImage: "https://dakstools.com/images/csr-daks-tools.jpg"
  };

  const csrSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "name": "DAKS Tools Corporate Social Responsibility",
        "description": csrSeoData.description,
        "url": csrSeoData.canonicalUrl,
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
            "name": "CSR Activities",
            "item": "https://dakstools.com/csra"
          }
        ]
      },
      {
        "@type": "Organization",
        "name": "DAKS Tools",
        "url": "https://dakstools.com",
        "knowsAbout": [
          "Corporate Social Responsibility",
          "NDT Education",
          "Environmental Sustainability",
          "Community Development",
          "Diversity in NDT"
        ],
        "actionableFeedbackPolicy": {
          "@type": "CreativeWork",
          "name": "CSR Framework",
          "description": "Integrating CSR into core business operations for sustainable impact through education, environment, community, and diversity initiatives."
        }
      },
      {
        "@type": "ItemList",
        "name": "DAKS Tools CSR Programs",
        "description": "8+ active CSR programs focused on education, environment, community development, and diversity across 25+ countries.",
        "numberOfItems": csrActivities.length,
        "itemListElement": csrActivities.map((activity, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "SocialActivismProgram",
            "name": activity.title,
            "description": activity.description,
            "location": activity.location,
            "startDate": activity.date
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What CSR initiatives does DAKS Tools undertake?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools runs CSR programs in education (free NDT training for underprivileged youth), environmental protection (coastal cleanup, sustainable manufacturing), community development (disaster relief, healthcare infrastructure), and diversity (Women in NDT, veteran employment programs)."
            }
          },
          {
            "@type": "Question",
            "name": "How many people has DAKS Tools impacted through CSR?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools has impacted over 50,000 lives through 8+ active CSR programs across 25+ countries, with an annual investment of $350,000+ in education, environment, community, and diversity initiatives from our Chennai headquarters."
            }
          },
          {
            "@type": "Question",
            "name": "Does DAKS Tools provide free NDT training?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, DAKS Tools provides free NDT certification training for underprivileged youth in Chennai, India. Our program has trained 50+ youth with an 80% placement success rate, creating sustainable employment opportunities in the NDT industry."
            }
          },
          {
            "@type": "Question",
            "name": "How can I get involved with DAKS Tools CSR programs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can partner with DAKS Tools for CSR initiatives or volunteer for our community programs. Contact us through our website to explore partnership opportunities for NDT education, environmental sustainability, and community development projects."
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
        <title>{csrSeoData.title}</title>
        <meta name="description" content={csrSeoData.description} />
        <meta name="keywords" content={csrSeoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={csrSeoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={csrSeoData.canonicalUrl} />
        <meta property="og:title" content="DAKS Tools CSR – Corporate Social Responsibility Initiatives" />
        <meta property="og:description" content={csrSeoData.description} />
        <meta property="og:image" content={csrSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools CSR Activities - Community Impact Programs" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="DAKS Tools CSR – Making a Difference" />
        <meta name="twitter:description" content={csrSeoData.description} />
        <meta name="twitter:image" content={csrSeoData.ogImage} />
        <meta name="twitter:image:alt" content="DAKS Tools Corporate Social Responsibility" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(csrSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="csr-page">
        {/* Page Container */}
        <div className="csr-page-container">
          
          {/* HERO HEADER */}
          <header className="csr-header">
            <div className="csr-header-overlay">
              <h1 className="csr-header-title">Corporate Social Responsibility</h1>
              <div className="csr-header-divider"></div>
              <p className="csr-header-tagline">
                Building Sustainable Communities Through Responsible Action – DAKS Tools Chennai
              </p>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="csr-content-section">
            <div className="csr-content-inner">
              
              {/* INTRO SECTION */}
              <div className="csr-intro">
                <h2 className="csr-section-title">Our CSR Commitment</h2>
                <h3 className="csr-section-subtitle">Making a Positive Impact Beyond NDT Business</h3>
                <p className="csr-section-text">
                  At DAKS Tools, we believe that responsible business practices extend beyond 
                  financial success. Our CSR initiatives from our Chennai headquarters focus on education, environmental 
                  sustainability, community development, and diversity – creating lasting 
                  positive change in the communities we serve across India and globally.
                </p>
              </div>

              {/* CSR STATS */}
              <div className="csr-stats-section">
                <div className="stats-grid">
                  {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-icon" aria-hidden="true">{stat.icon}</div>
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FEATURED INITIATIVES */}
              <div className="featured-initiatives">
                <h3 className="section-title">
                  <span className="title-icon" aria-hidden="true">⭐</span>
                  Featured CSR Initiatives
                </h3>
                <div className="featured-grid">
                  {featuredActivities.map(activity => (
                    <div key={activity.id} className="featured-card">
                      <div className="featured-image-container">
                        <img 
                          src={activity.image} 
                          alt={`${activity.title} - DAKS Tools CSR Initiative`}
                          className="featured-image"
                          loading="lazy"
                        />
                        <div className="featured-badge">Featured</div>
                        <div className="category-badge" data-category={activity.category}>
                          {categories.find(c => c.id === activity.category)?.label}
                        </div>
                      </div>
                      <div className="featured-content">
                        <div className="activity-meta">
                          <span className="activity-date">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {activity.date}
                          </span>
                          <span className="activity-location">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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
                        aria-label={`Filter by ${category.label}`}
                        aria-pressed={activeCategory === category.id}
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
                        alt={`${activity.title} - DAKS Tools CSR Program`}
                        className="csr-image"
                        loading="lazy"
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
                          <span className="impact-icon" aria-hidden="true">👥</span>
                          <span className="impact-text">{activity.stats.beneficiaries.toLocaleString()}+ Beneficiaries</span>
                        </div>
                        <div className="impact-item">
                          <span className="impact-icon" aria-hidden="true">⏱️</span>
                          <span className="impact-text">{activity.stats.duration} Program</span>
                        </div>
                      </div>
                      
                      <button className="view-details-btn" aria-label={`View details for ${activity.title}`}>
                        View Details
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CSR FRAMEWORK */}
              <div className="csr-framework">
                <h3 className="framework-title">Our CSR Framework at DAKS Tools</h3>
                <div className="framework-grid">
                  <div className="framework-card">
                    <div className="framework-icon" aria-hidden="true">🎯</div>
                    <h4>Strategic Approach</h4>
                    <p>Integrating CSR into core NDT business operations for sustainable impact.</p>
                    <ul>
                      <li>Long-term partnerships</li>
                      <li>Measurable outcomes</li>
                      <li>Regular impact assessment</li>
                    </ul>
                  </div>
                  <div className="framework-card">
                    <div className="framework-icon" aria-hidden="true">🤝</div>
                    <h4>Stakeholder Engagement</h4>
                    <p>Collaborating with communities, NGOs, and government bodies across India.</p>
                    <ul>
                      <li>Community consultations</li>
                      <li>Transparent reporting</li>
                      <li>Feedback mechanisms</li>
                    </ul>
                  </div>
                  <div className="framework-card">
                    <div className="framework-icon" aria-hidden="true">📈</div>
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
                    <div className="partner-icon" aria-hidden="true">🏛️</div>
                    <h4>Government Bodies</h4>
                    <p>Collaborating with local and national governments for community development in India.</p>
                  </div>
                  <div className="partner-card">
                    <div className="partner-icon" aria-hidden="true">🌱</div>
                    <h4>NGOs</h4>
                    <p>Partnering with non-profits for specialized community and education programs.</p>
                  </div>
                  <div className="partner-card">
                    <div className="partner-icon" aria-hidden="true">🏫</div>
                    <h4>Educational Institutions</h4>
                    <p>Working with schools and universities for NDT skill development.</p>
                  </div>
                  <div className="partner-card">
                    <div className="partner-icon" aria-hidden="true">👨‍👩‍👧‍👦</div>
                    <h4>Community Groups</h4>
                    <p>Engaging local communities in Chennai and across India for grassroots initiatives.</p>
                  </div>
                </div>
              </div>

              {/* GET INVOLVED */}
              <div className="get-involved-section">
                <div className="involved-content">
                  <h3>Get Involved with DAKS Tools CSR</h3>
                  <p>Join us in making a difference through NDT education and community development. Explore partnership opportunities or volunteer for our CSR programs in Chennai and beyond.</p>
                  <div className="involved-buttons">
                    <button className="partner-btn" aria-label="Become a CSR partner">
                      Become a Partner
                    </button>
                    <button className="volunteer-btn" aria-label="Volunteer for CSR programs">
                      Volunteer
                    </button>
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

export default CSRActivity;