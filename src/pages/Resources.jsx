import React, { useEffect, useRef, useState } from 'react';
import './css/Resources.css';

function Resources() {
  const sectionRefs = useRef([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const resources = [
    {
      id: 1,
      title: 'NDT Calibration Guide 2024',
      category: 'guides',
      type: 'PDF',
      size: '4.2 MB',
      description: 'Comprehensive guide for NDT calibration procedures and best practices.',
      icon: '📄',
      featured: true
    },
    {
      id: 2,
      title: 'Ultrasonic Testing Tutorial',
      category: 'videos',
      type: 'Video',
      duration: '15:30',
      description: 'Step-by-step video tutorial on ultrasonic testing techniques.',
      icon: '🎥',
      featured: true
    },
    {
      id: 3,
      title: 'PAUT Equipment Manual',
      category: 'manuals',
      type: 'PDF',
      size: '8.7 MB',
      description: 'Detailed manual for Phased Array Ultrasonic Testing equipment.',
      icon: '📘'
    },
    {
      id: 4,
      title: 'NDT Safety Procedures',
      category: 'guides',
      type: 'PDF',
      size: '2.1 MB',
      description: 'Essential safety guidelines for NDT operations.',
      icon: '🛡️'
    },
    {
      id: 5,
      title: 'Calibration Block Specifications',
      category: 'datasheets',
      type: 'PDF',
      size: '1.5 MB',
      description: 'Technical specifications for all calibration blocks.',
      icon: '📊'
    },
    {
      id: 6,
      title: 'Magnetic Testing Webinar',
      category: 'videos',
      type: 'Video',
      duration: '45:00',
      description: 'Recorded webinar on advanced magnetic testing methods.',
      icon: '🎬'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="resources-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="resources-header">
          <div className="header-overlay">
            <div className="company-logo">DAKS TOOLS</div>
            <div className="header-subtitle">KNOWLEDGE CENTER</div>
            <h1 className="header-title">Resources & Downloads</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
              Technical Documentation, Guides, and Training Materials
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="resources-content">
          <div className="content-inner">
            {/* Intro Section */}
            <section 
              ref={addToRefs}
              className="intro-section section-reveal"
            >
              <h2>Your Complete NDT Resource Library</h2>
              <p>
                Access our comprehensive collection of technical documentation, training materials, 
                product manuals, and industry guides. Stay updated with the latest NDT technologies 
                and best practices to enhance your testing capabilities.
              </p>
            </section>

            {/* Search and Filter Section */}
            <section 
              ref={addToRefs}
              className="filter-section section-reveal"
            >
              <div className="search-container">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Resources
                </button>
                <button 
                  className={`filter-tab ${activeCategory === 'guides' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('guides')}
                >
                  Guides
                </button>
                <button 
                  className={`filter-tab ${activeCategory === 'videos' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('videos')}
                >
                  Videos
                </button>
                <button 
                  className={`filter-tab ${activeCategory === 'manuals' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('manuals')}
                >
                  Manuals
                </button>
                <button 
                  className={`filter-tab ${activeCategory === 'datasheets' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('datasheets')}
                >
                  Datasheets
                </button>
              </div>
            </section>

            {/* Featured Resources */}
            <section 
              ref={addToRefs}
              className="featured-section section-reveal"
            >
              <h2>Featured Resources</h2>
              <div className="featured-grid">
                {filteredResources.filter(r => r.featured).map(resource => (
                  <div key={resource.id} className="featured-card">
                    <div className="featured-icon">{resource.icon}</div>
                    <div className="featured-content">
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      <div className="resource-meta">
                        <span className="resource-type">{resource.type}</span>
                        <span className="resource-size">
                          {resource.size || resource.duration}
                        </span>
                      </div>
                      <button className="download-btn">
                        Download <span>↓</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Resources Grid */}
            <section 
              ref={addToRefs}
              className="resources-grid-section section-reveal"
            >
              <h2>All Resources</h2>
              <div className="resources-grid">
                {filteredResources.map(resource => (
                  <div key={resource.id} className="resource-card">
                    <div className="resource-header">
                      <span className="resource-icon">{resource.icon}</span>
                      <span className="resource-badge">{resource.category}</span>
                    </div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="resource-footer">
                      <div className="resource-info">
                        <span>{resource.type}</span>
                        <span>•</span>
                        <span>{resource.size || resource.duration}</span>
                      </div>
                      <button className="download-link">
                        Download →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Links Section */}
            <section 
              ref={addToRefs}
              className="quick-links-section section-reveal"
            >
              <h2>Quick Access</h2>
              <div className="quick-links-grid">
                <div className="quick-link-card">
                  <div className="quick-link-icon">📚</div>
                  <h3>Product Catalogs</h3>
                  <p>Browse our complete product range with detailed specifications</p>
                  <a href="#" className="quick-link-btn">View Catalogs →</a>
                </div>
                <div className="quick-link-card">
                  <div className="quick-link-icon">🎓</div>
                  <h3>Training Portal</h3>
                  <p>Access online training courses and certification programs</p>
                  <a href="#" className="quick-link-btn">Start Learning →</a>
                </div>
                <div className="quick-link-card">
                  <div className="quick-link-icon">💬</div>
                  <h3>Technical Support</h3>
                  <p>Get expert assistance for your NDT equipment and procedures</p>
                  <a href="#" className="quick-link-btn">Get Support →</a>
                </div>
                <div className="quick-link-card">
                  <div className="quick-link-icon">📰</div>
                  <h3>Industry News</h3>
                  <p>Stay updated with latest NDT trends and innovations</p>
                  <a href="#" className="quick-link-btn">Read News →</a>
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section 
              ref={addToRefs}
              className="newsletter-section section-reveal"
            >
              <div className="newsletter-content">
                <h2>Stay Updated</h2>
                <p>Subscribe to receive the latest resources, guides, and industry updates</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe →
                  </button>
                </form>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="company-footer">
          <p>&copy; 2024 DAKS TOOLS. All rights reserved. | Precision NDT Solutions</p>
        </footer>
      </div>
    </div>
  );
}

export default Resources;