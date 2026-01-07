import React, { useState } from 'react';
import './css/Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "The Future of Ultrasonic Testing: AI and Machine Learning Integration",
      category: "Technology",
      date: "Jan 15, 2024",
      author: "Dr. Sarah Chen",
      authorRole: "CTO & Lead Researcher",
      readTime: "8 min read",
      excerpt: "Exploring how artificial intelligence is revolutionizing ultrasonic testing accuracy and efficiency.",
      content: `Artificial Intelligence and Machine Learning are transforming Non-Destructive Testing (NDT) methodologies, particularly in ultrasonic testing. These technologies enable real-time defect classification, automated signal analysis, and predictive maintenance capabilities that were previously impossible.

Key advancements include:
• Neural networks that can identify defect patterns with 99.7% accuracy
• Machine learning algorithms that reduce false positives by 40%
• Automated reporting systems that save technicians 15+ hours weekly

The integration of AI in ultrasonic testing not only improves accuracy but also enhances safety by reducing human exposure to hazardous environments. As these technologies mature, we're seeing a shift from reactive to predictive maintenance strategies across industries.`,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=450&fit=crop",
      tags: ["AI", "Ultrasonic Testing", "Machine Learning", "Innovation"],
      featured: true
    },
    {
      id: 2,
      title: "Digital Radiography vs Traditional Film: Cost-Benefit Analysis",
      category: "Industry Analysis",
      date: "Jan 8, 2024",
      author: "Michael Rodriguez",
      authorRole: "Operations Director",
      readTime: "6 min read",
      excerpt: "A comprehensive comparison of digital radiography systems versus traditional film methods.",
      content: `The transition from traditional film radiography to digital systems represents a significant investment, but the long-term benefits often outweigh the initial costs. 

Cost Analysis:
Initial Setup: Digital systems require higher upfront investment ($50,000-$150,000) compared to film ($10,000-$30,000)
Operational Costs: Digital eliminates film, chemicals, and darkroom expenses, saving $15,000-$25,000 annually
Time Efficiency: Digital provides instant results vs 30-60 minutes for film processing
Environmental Impact: Digital reduces chemical waste by 95%

For most industrial applications, digital radiography pays for itself within 2-3 years while providing superior image quality, better storage capabilities, and enhanced safety features.`,
      image: "https://images.unsplash.com/photo-1581094794644-1b9dae7c17df?w=800&h=450&fit=crop",
      tags: ["Digital Radiography", "Cost Analysis", "Technology", "Industry"],
      featured: false
    },
    {
      id: 3,
      title: "Best Practices for Magnetic Particle Inspection in Extreme Environments",
      category: "Best Practices",
      date: "Dec 22, 2023",
      author: "David Kim",
      authorRole: "Senior NDT Engineer",
      readTime: "7 min read",
      excerpt: "Essential guidelines for conducting reliable magnetic particle testing in challenging conditions.",
      content: `Magnetic Particle Inspection (MPI) remains one of the most reliable surface inspection methods, but extreme environments present unique challenges. 

Challenges and Solutions:

High Temperature Environments (>50°C):
• Use heat-resistant magnetic particles
• Implement cooling systems for equipment
• Conduct inspections during cooler periods

Sub-zero Conditions (<0°C):
• Pre-warm components when possible
• Use low-temperature fluorescent particles
• Ensure proper lighting for visibility

Wet/Humid Conditions:
• Implement moisture barriers
• Use water-resistant equipment coatings
• Regular calibration checks

Offshore/Remote Locations:
• Portable MPI kits with extended battery life
• Satellite communication for expert support
• Redundant systems for critical inspections

Proper planning, equipment selection, and technician training are crucial for maintaining MPI reliability in extreme conditions.`,
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=450&fit=crop",
      tags: ["MPI", "Best Practices", "Field Work", "Safety"],
      featured: false
    },
    {
      id: 4,
      title: "The Role of NDT in Renewable Energy Infrastructure",
      category: "Sustainability",
      date: "Dec 15, 2023",
      author: "Lisa Anderson",
      authorRole: "Sustainability Director",
      readTime: "9 min read",
      excerpt: "How non-destructive testing ensures reliability in wind, solar, and hydroelectric systems.",
      content: `Renewable energy infrastructure presents unique NDT challenges and opportunities. Each technology requires specialized inspection approaches.

Wind Turbines:
• Ultrasonic testing for blade composite materials
• Phased array for tower weld inspections
• Drone-mounted systems for inaccessible areas

Solar Farms:
• Infrared thermography for panel efficiency
• Electromagnetic testing for structural integrity
• Robotic crawlers for large-scale inspections

Hydroelectric Systems:
• Underwater ultrasonic testing
• Remote visual inspection (RVI) of turbines
• Corrosion monitoring in submerged components

The growth of renewable energy is driving NDT innovation, particularly in robotics, remote monitoring, and data analytics. These advancements improve safety, reduce downtime, and extend infrastructure lifespan.`,
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop",
      tags: ["Renewable Energy", "Sustainability", "Innovation", "Infrastructure"],
      featured: true
    },
    {
      id: 5,
      title: "Advancements in Automated NDT Systems for Manufacturing",
      category: "Automation",
      date: "Dec 8, 2023",
      author: "James Wilson",
      authorRole: "R&D Scientist",
      readTime: "5 min read",
      excerpt: "How robotics and automation are transforming quality control in manufacturing.",
      content: `Automated NDT systems are revolutionizing manufacturing quality control through increased speed, consistency, and data integration.

Key Innovations:

1. Robotic Inspection Cells
• 6-axis robotic arms with multiple NDT sensors
• Automated calibration and validation
• Integration with production lines

2. Machine Vision Systems
• High-resolution cameras for surface inspection
• AI-powered defect recognition
• Real-time quality scoring

3. Data Integration Platforms
• Centralized data collection from multiple sources
• Predictive analytics for process optimization
• Automated reporting and certification

4. Collaborative Robots (Cobots)
• Safe human-robot collaboration
• Flexible deployment across different products
• Reduced setup time between inspections

These systems can increase inspection throughput by 300-500% while improving defect detection rates and reducing human error.`,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop",
      tags: ["Automation", "Robotics", "Manufacturing", "Quality Control"],
      featured: false
    },
    {
      id: 6,
      title: "Training the Next Generation of NDT Professionals",
      category: "Education",
      date: "Nov 30, 2023",
      author: "Priya Sharma",
      authorRole: "Training Coordinator",
      readTime: "10 min read",
      excerpt: "Modern approaches to NDT education and certification in the digital age.",
      content: `The NDT industry faces a critical skills gap, with 40% of technicians expected to retire in the next decade. Modern training approaches are essential for developing the next generation.

Modern Training Approaches:

1. Virtual Reality (VR) Simulations
• Safe practice of hazardous procedures
• Repeatable training scenarios
• Performance analytics

2. Augmented Reality (AR) Guidance
• Real-time procedure assistance
• Equipment operation tutorials
• Remote expert support

3. Digital Certification Systems
• Blockchain-verified credentials
• Continuous competency assessment
• Mobile-accessible certification

4. Hybrid Learning Models
• Online theory courses
• Hands-on practical sessions
• Mentorship programs

Case Study: Our VR training program reduced training time by 60% while increasing retention rates by 45%. Students reported higher confidence levels and better preparation for real-world scenarios.

The future of NDT education lies in technology-enhanced learning, continuous assessment, and global certification standards.`,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
      tags: ["Education", "Training", "VR", "Certification"],
      featured: false
    }
  ]);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    { name: 'All', count: blogs.length },
    { name: 'Technology', count: blogs.filter(b => b.category === 'Technology').length },
    { name: 'Industry Analysis', count: blogs.filter(b => b.category === 'Industry Analysis').length },
    { name: 'Best Practices', count: blogs.filter(b => b.category === 'Best Practices').length },
    { name: 'Sustainability', count: blogs.filter(b => b.category === 'Sustainability').length },
    { name: 'Automation', count: blogs.filter(b => b.category === 'Automation').length },
    { name: 'Education', count: blogs.filter(b => b.category === 'Education').length }
  ];

  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'All') return true;
    if (filter === 'Featured') return blog.featured;
    return blog.category === filter;
  });

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (sortBy === 'latest') return dateB - dateA;
    if (sortBy === 'oldest') return dateA - dateB;
    if (sortBy === 'readTime') {
      const timeA = parseInt(a.readTime);
      const timeB = parseInt(b.readTime);
      return timeB - timeA;
    }
    return 0;
  });

  const featuredBlogs = blogs.filter(blog => blog.featured);
  const recentBlogs = blogs.slice(0, 3);

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    document.body.style.overflow = 'hidden';
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="blogs-page">
      {/* Page Container */}
      <div className="blogs-page-container">
        
        {/* HERO HEADER */}
        <header className="blogs-header">
          <div className="blogs-header-overlay">
            <h1 className="blogs-header-title">NDT Insights Blog</h1>
            <div className="blogs-header-divider"></div>
            <p className="blogs-header-tagline">
              Expert Analysis, Industry Trends, and Technical Knowledge
            </p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="blogs-content-section">
          <div className="blogs-content-inner">
            
            {/* INTRO SECTION */}
            <div className="blogs-intro">
              <h2 className="blogs-section-title">Technical Insights</h2>
              <h3 className="blogs-section-subtitle">Deep Dive into NDT Technology, Applications, and Innovations</h3>
              <p className="blogs-section-text">
                Our blog features in-depth technical articles, case studies, and expert perspectives 
                on Non-Destructive Testing. From cutting-edge research to practical field applications, 
                explore comprehensive insights that advance NDT knowledge and practice.
              </p>
            </div>

            {/* FEATURED BLOGS */}
            {featuredBlogs.length > 0 && (
              <div className="featured-blogs-section">
                <h3 className="section-heading">
                  <span className="heading-icon">⭐</span>
                  Featured Articles
                </h3>
                <div className="featured-blogs-grid">
                  {featuredBlogs.map(blog => (
                    <div 
                      key={blog.id} 
                      className="featured-blog-card"
                      onClick={() => openBlogModal(blog)}
                    >
                      <div className="featured-image-container">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="featured-blog-image"
                        />
                        <div className="featured-badge">Featured</div>
                      </div>
                      <div className="featured-content">
                        <div className="featured-meta">
                          <span className="featured-category">{blog.category}</span>
                          <span className="featured-date">{blog.date}</span>
                        </div>
                        <h4 className="featured-title">{blog.title}</h4>
                        <p className="featured-excerpt">{blog.excerpt}</p>
                        <div className="featured-author">
                          <div className="author-avatar">
                            {blog.author.charAt(0)}
                          </div>
                          <div className="author-details">
                            <div className="author-name">{blog.author}</div>
                            <div className="author-role">{blog.authorRole}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BLOG CONTROLS */}
            <div className="blog-controls">
              <div className="controls-left">
                <div className="filter-container">
                  <span className="filter-label">Category:</span>
                  <div className="filter-buttons">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        className={`filter-btn ${filter === category.name ? 'active' : ''}`}
                        onClick={() => setFilter(category.name)}
                      >
                        {category.name}
                        <span className="category-count">({category.count})</span>
                      </button>
                    ))}
                    <button
                      className={`filter-btn ${filter === 'Featured' ? 'active' : ''}`}
                      onClick={() => setFilter('Featured')}
                    >
                      Featured
                      <span className="category-count">({featuredBlogs.length})</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="controls-right">
                <div className="sort-container">
                  <span className="sort-label">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="readTime">Read Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BLOG STATS */}
            <div className="blog-stats">
              <div className="stat-card">
                <div className="stat-number">{blogs.length}</div>
                <div className="stat-label">Total Articles</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{categories.length - 1}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {blogs.reduce((acc, blog) => acc + parseInt(blog.readTime), 0)}+
                </div>
                <div className="stat-label">Minutes of Content</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{featuredBlogs.length}</div>
                <div className="stat-label">Featured Articles</div>
              </div>
            </div>

            {/* MAIN BLOG GRID */}
            <div className="blogs-grid">
              {sortedBlogs.map(blog => (
                <div 
                  key={blog.id} 
                  className="blog-card"
                  onClick={() => openBlogModal(blog)}
                >
                  <div className="blog-image-container">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="blog-image"
                      loading="lazy"
                    />
                    {blog.featured && (
                      <div className="blog-featured-badge">Featured</div>
                    )}
                    <div className="blog-category-badge">{blog.category}</div>
                  </div>
                  
                  <div className="blog-content">
                    <div className="blog-meta">
                      <div className="blog-date">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {blog.date}
                      </div>
                      <div className="blog-read-time">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {blog.readTime}
                      </div>
                    </div>
                    
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    
                    <div className="blog-author">
                      <div className="author-mini-avatar">
                        {blog.author.charAt(0)}
                      </div>
                      <div className="author-mini-details">
                        <div className="author-mini-name">{blog.author}</div>
                        <div className="author-mini-role">{blog.authorRole}</div>
                      </div>
                    </div>
                    
                    <div className="blog-tags">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="blog-read-more">
                      <span>Read Full Article</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SIDEBAR SECTION */}
            <div className="blog-sidebar">
              {/* RECENT ARTICLES */}
              <div className="sidebar-section recent-articles">
                <h4 className="sidebar-title">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Articles
                </h4>
                <div className="recent-list">
                  {recentBlogs.map(blog => (
                    <div 
                      key={blog.id} 
                      className="recent-item"
                      onClick={() => openBlogModal(blog)}
                    >
                      <div className="recent-thumbnail">
                        <img src={blog.image} alt={blog.title} />
                      </div>
                      <div className="recent-info">
                        <h5>{blog.title.substring(0, 50)}...</h5>
                        <div className="recent-meta">
                          <span>{blog.date}</span>
                          <span>•</span>
                          <span>{blog.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CATEGORIES */}
              <div className="sidebar-section categories">
                <h4 className="sidebar-title">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Categories
                </h4>
                <div className="categories-list">
                  {categories.slice(1).map((category, idx) => (
                    <div 
                      key={idx} 
                      className="category-item"
                      onClick={() => setFilter(category.name)}
                    >
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEWSLETTER */}
              <div className="sidebar-section newsletter">
                <h4 className="sidebar-title">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Subscribe
                </h4>
                <p className="newsletter-text">
                  Get the latest NDT insights delivered to your inbox
                </p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Your email address"
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe
                  </button>
                </form>
                <p className="newsletter-note">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* BLOG DETAIL MODAL */}
      {selectedBlog && (
        <div className="blog-modal-overlay" onClick={closeBlogModal}>
          <div className="blog-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeBlogModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-category">{selectedBlog.category}</div>
                <div className="modal-meta">
                  <span className="modal-date">{selectedBlog.date}</span>
                  <span className="modal-read-time">{selectedBlog.readTime}</span>
                </div>
              </div>
              
              <h1 className="modal-title">{selectedBlog.title}</h1>
              
              <div className="modal-author">
                <div className="author-avatar-large">
                  {selectedBlog.author.charAt(0)}
                </div>
                <div className="author-info-large">
                  <div className="author-name-large">{selectedBlog.author}</div>
                  <div className="author-role-large">{selectedBlog.authorRole}</div>
                </div>
              </div>
              
              <div className="modal-image-container">
                <img 
                  src={selectedBlog.image} 
                  alt={selectedBlog.title}
                  className="modal-blog-image"
                />
              </div>
              
              <div className="modal-body">
                <div className="article-content">
                  <h2>Article Summary</h2>
                  <p className="lead-paragraph">{selectedBlog.excerpt}</p>
                  
                  <div className="content-body">
                    {selectedBlog.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="key-takeaways">
                    <h3>Key Takeaways</h3>
                    <ul>
                      <li>Industry-leading insights from experienced professionals</li>
                      <li>Practical applications of advanced NDT technologies</li>
                      <li>Future trends and emerging methodologies</li>
                      <li>Best practices for implementation and quality assurance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="article-tags">
                  <h4>Tags</h4>
                  <div className="tags-container">
                    {selectedBlog.tags.map((tag, idx) => (
                      <span key={idx} className="article-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="article-share">
                  <h4>Share This Article</h4>
                  <div className="share-buttons">
                    <button className="share-btn linkedin">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    <button className="share-btn twitter">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </button>
                    <button className="share-btn copy">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>
                  </div>
                </div>
                
                <div className="article-navigation">
                  <button className="nav-btn prev">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Article
                  </button>
                  <button className="nav-btn next">
                    Next Article
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;