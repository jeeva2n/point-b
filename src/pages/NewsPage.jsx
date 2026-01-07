import React, { useState, useEffect } from 'react';
import './css/NewsPage.css';

const NewsPage = () => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "New Ultrasonic Testing Technology Launched",
      category: "Technology",
      date: "Dec 15, 2024",
      author: "Sarah Chen",
      excerpt: "We're excited to announce our latest breakthrough in ultrasonic testing technology with enhanced defect detection capabilities.",
      content: "Our R&D team has developed a new ultrasonic testing system that improves defect detection accuracy by 40%. The technology incorporates AI-based signal processing and real-time data analysis, setting new industry standards for quality assurance in critical infrastructure.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=450&fit=crop",
      tags: ["Technology", "Innovation", "NDT"]
    },
    {
      id: 2,
      title: "Global Expansion: New Office in Singapore",
      category: "Business",
      date: "Nov 28, 2024",
      author: "Michael Rodriguez",
      excerpt: "We're expanding our global presence with a new regional headquarters in Singapore.",
      content: "To better serve our clients in the Asia-Pacific region, we've opened a new regional headquarters in Singapore. This strategic location will provide enhanced support for oil & gas, marine, and aerospace industries across Southeast Asia.",
      image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=450&fit=crop",
      tags: ["Expansion", "Business", "Global"]
    },
    {
      id: 3,
      title: "Industry Conference 2024 Highlights",
      category: "Events",
      date: "Nov 12, 2024",
      author: "David Kim",
      excerpt: "Our team showcased innovative NDT solutions at the International Industry Conference 2024.",
      content: "We presented three groundbreaking research papers at the International NDT Conference 2024, focusing on digital radiography advancements, automated inspection systems, and sustainable testing methodologies. Our team received the 'Innovation Excellence' award for their contributions.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop",
      tags: ["Conference", "Awards", "Research"]
    },
    {
      id: 4,
      title: "Partnership with Leading Aerospace Company",
      category: "Partnerships",
      date: "Oct 30, 2024",
      author: "Lisa Anderson",
      excerpt: "We've entered a strategic partnership with a major aerospace manufacturer.",
      content: "This partnership will focus on developing next-generation inspection systems for aircraft components. The collaboration combines our NDT expertise with their aerospace manufacturing knowledge to enhance safety and reliability in aviation.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=450&fit=crop",
      tags: ["Partnership", "Aerospace", "Collaboration"]
    },
    {
      id: 5,
      title: "New Training Facility Opens",
      category: "Education",
      date: "Oct 18, 2024",
      author: "Priya Sharma",
      excerpt: "State-of-the-art training center now operational for NDT certification programs.",
      content: "Our new 10,000 sq ft training facility features advanced simulation labs, digital classrooms, and hands-on testing stations. The center offers ASNT-certified training programs and continuous professional development for NDT technicians.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
      tags: ["Training", "Education", "Certification"]
    },
    {
      id: 6,
      title: "Sustainability Initiatives in NDT",
      category: "Sustainability",
      date: "Sep 25, 2024",
      author: "James Wilson",
      excerpt: "Implementing eco-friendly practices across our testing methodologies.",
      content: "We're committed to reducing environmental impact through sustainable NDT practices. Initiatives include developing biodegradable penetrant materials, energy-efficient testing equipment, and recycling programs for testing consumables.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop",
      tags: ["Sustainability", "Environment", "Innovation"]
    }
  ]);

  const [selectedNews, setSelectedNews] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'All', count: news.length },
    { name: 'Technology', count: news.filter(n => n.category === 'Technology').length },
    { name: 'Business', count: news.filter(n => n.category === 'Business').length },
    { name: 'Events', count: news.filter(n => n.category === 'Events').length },
    { name: 'Partnerships', count: news.filter(n => n.category === 'Partnerships').length },
    { name: 'Education', count: news.filter(n => n.category === 'Education').length },
    { name: 'Sustainability', count: news.filter(n => n.category === 'Sustainability').length }
  ];

  const filteredNews = news.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const openNewsModal = (newsItem) => {
    setSelectedNews(newsItem);
    document.body.style.overflow = 'hidden';
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
    document.body.style.overflow = 'auto';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="news-page">
      {/* Page Container */}
      <div className="news-page-container">
        
        {/* HERO HEADER */}
        <header className="news-header">
          <div className="news-header-overlay">
            <h1 className="news-header-title">News & Updates</h1>
            <div className="news-header-divider"></div>
            <p className="news-header-tagline">
              Stay Updated with Our Latest Innovations and Industry Insights
            </p>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="news-content-section">
          <div className="news-content-inner">
            
            {/* INTRO SECTION */}
            <div className="news-intro">
              <h2 className="news-section-title">Latest News</h2>
              <h3 className="news-section-subtitle">Industry Updates, Technological Advances, and Company News</h3>
              <p className="news-section-text">
                Discover the latest developments in Non-Destructive Testing technology, 
                company announcements, industry partnerships, and educational initiatives. 
                Stay informed about our journey in advancing NDT solutions worldwide.
              </p>
            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="news-controls">
              <div className="search-container">
                <div className="search-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>
                    ×
                  </button>
                )}
              </div>

              <div className="filter-container">
                <span className="filter-label">Filter by Category:</span>
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
                </div>
              </div>
            </div>

            {/* NEWS STATS */}
            <div className="news-stats">
              <div className="stat-item">
                <div className="stat-number">{news.length}</div>
                <div className="stat-label">Total Articles</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{categories.length - 1}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2024</div>
                <div className="stat-label">Latest Updates</div>
              </div>
            </div>

            {/* NEWS GRID */}
            <div className="news-grid">
              {filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <div 
                    key={item.id} 
                    className="news-card"
                    onClick={() => openNewsModal(item)}
                  >
                    <div className="news-image-container">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="news-image"
                        loading="lazy"
                      />
                      <div className="news-category-badge">{item.category}</div>
                      <div className="news-date-overlay">{item.date}</div>
                    </div>
                    
                    <div className="news-content">
                      <div className="news-meta">
                        <span className="news-author">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {item.author}
                        </span>
                        <span className="news-time">3 min read</span>
                      </div>
                      
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-excerpt">{item.excerpt}</p>
                      
                      <div className="news-tags">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="news-tag">{tag}</span>
                        ))}
                      </div>
                      
                      <div className="news-read-more">
                        <span>Read Full Article</span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">📰</div>
                  <h3>No News Articles Found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>

            {/* NEWSLETTER SIGNUP */}
            <div className="newsletter-section">
              <div className="newsletter-content">
                <h3>Stay Updated</h3>
                <p>Subscribe to our newsletter for the latest NDT industry insights and company updates.</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe
                  </button>
                </form>
                <p className="newsletter-note">We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* NEWS DETAIL MODAL */}
      {selectedNews && (
        <div className="news-modal-overlay" onClick={closeNewsModal}>
          <div className="news-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeNewsModal}>×</button>
            
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-category">{selectedNews.category}</div>
                <div className="modal-date">{formatDate(selectedNews.date)}</div>
              </div>
              
              <h2 className="modal-title">{selectedNews.title}</h2>
              
              <div className="modal-author">
                <div className="author-avatar">
                  {selectedNews.author.charAt(0)}
                </div>
                <div className="author-info">
                  <div className="author-name">{selectedNews.author}</div>
                  <div className="author-role">Senior NDT Specialist</div>
                </div>
              </div>
              
              <div className="modal-image-container">
                <img 
                  src={selectedNews.image} 
                  alt={selectedNews.title}
                  className="modal-news-image"
                />
              </div>
              
              <div className="modal-body">
                <div className="article-content">
                  <h3>Article Summary</h3>
                  <p>{selectedNews.content}</p>
                  
                  <h3>Key Highlights</h3>
                  <ul>
                    <li>Latest advancements in NDT technology</li>
                    <li>Industry collaboration and partnerships</li>
                    <li>Educational and training initiatives</li>
                    <li>Sustainable testing methodologies</li>
                  </ul>
                  
                  <h3>Industry Impact</h3>
                  <p>
                    This development represents a significant step forward in Non-Destructive Testing 
                    methodologies, offering improved accuracy, efficiency, and reliability for 
                    critical infrastructure inspections across multiple industries.
                  </p>
                </div>
                
                <div className="article-tags">
                  <h4>Tags</h4>
                  <div className="tags-container">
                    {selectedNews.tags.map((tag, idx) => (
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
                    <button className="share-btn email">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </button>
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

export default NewsPage;