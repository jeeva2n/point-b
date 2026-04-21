import React, { useState, useEffect } from 'react';
import './css/NewsPage.css';
import { Helmet } from 'react-helmet-async';

const NewsPage = () => {
  const [news, setNews] = useState([
{
    id: 1,
    title: "Revolutionary Phased Array Ultrasonic Technology Unveiled",
    category: "Technology",
    date: "Dec 15, 2024",
    author: "Dr. Sarah Chen",
    excerpt: "Next-generation PAUT system delivers unprecedented resolution in flaw detection and sizing accuracy.",
    content: "Our R&D team has developed a breakthrough phased array ultrasonic technology that achieves 0.1mm resolution in flaw characterization. The system incorporates advanced Full Matrix Capture (FMC) and Total Focusing Method (TFM) algorithms, enabling inspectors to visualize defects with surgical precision in aerospace composites and critical weld inspections.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=450&fit=crop",
    tags: ["Phased Array", "Ultrasonic", "Innovation", "NDT 4.0"]
  },
  {
    id: 2,
    title: "Strategic Expansion: Asia-Pacific NDT Hub Opens in Singapore",
    category: "Business",
    date: "Nov 28, 2024",
    author: "Michael Rodriguez",
    excerpt: "New regional headquarters strengthens support for oil & gas, marine, and aerospace sectors across Southeast Asia.",
    content: "To better serve our growing client base in the Asia-Pacific region, we've inaugurated a new 15,000 sq ft facility in Singapore. The hub features a fully equipped calibration laboratory, training center, and technical support team dedicated to serving the region's offshore, marine, and aerospace industries with localized ASME and ISO reference standards.",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=450&fit=crop",
    tags: ["Expansion", "Asia-Pacific", "Business", "Global Reach"]
  },
  {
    id: 3,
    title: "ASNT Conference 2024: DAKS Tools Wins Innovation Excellence Award",
    category: "Events",
    date: "Nov 12, 2024",
    author: "David Kim",
    excerpt: "Groundbreaking research in AI-assisted defect recognition earns top industry recognition.",
    content: "At the ASNT Annual Conference 2024, our team presented three pioneering research papers on machine learning applications in ultrasonic data interpretation, advanced digital radiography for additive manufacturing, and sustainable NDT practices. Our presentation on 'Deep Learning for Automated Flaw Classification in Aerospace Components' received the prestigious 'Innovation Excellence' award, recognizing our contribution to advancing NDT technology.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop",
    tags: ["ASNT", "Awards", "Research", "AI in NDT"]
  },
  {
    id: 4,
    title: "Strategic Partnership with Boeing Advances Aerospace NDT Standards",
    category: "Partnerships",
    date: "Oct 30, 2024",
    author: "Lisa Anderson",
    excerpt: "Collaboration to develop next-generation inspection protocols for composite aircraft structures.",
    content: "We've entered a landmark partnership with Boeing Commercial Airplanes to develop advanced NDT reference standards for next-generation composite aircraft structures. The collaboration focuses on creating customized ultrasonic and thermographic inspection procedures for carbon fiber components, enhancing safety and reliability in modern aviation manufacturing.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=450&fit=crop",
    tags: ["Aerospace", "Partnership", "Composite Inspection", "Boeing"]
  },
  {
    id: 5,
    title: "World-Class NDT Training Center: ASNT Level III Certification Now Available",
    category: "Education",
    date: "Oct 18, 2024",
    author: "Priya Sharma",
    excerpt: "State-of-the-art facility offers hands-on training with live flaw specimens and real-world scenarios.",
    content: "Our newly inaugurated 12,000 sq ft NDT Training Academy features dedicated labs for ultrasonic, radiographic, eddy current, and penetrant testing. The facility houses over 500 engineered flaw specimens, enabling technicians to experience real-world inspection challenges. ASNT-certified Level III instructors lead comprehensive programs in accordance with SNT-TC-1A and CP-189 requirements, preparing the next generation of NDT professionals.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    tags: ["Training", "ASNT Level III", "Certification", "Education"]
  },
  {
    id: 6,
    title: "Green NDT Initiative: Eco-Friendly Testing Solutions Launch",
    category: "Sustainability",
    date: "Sep 25, 2024",
    author: "James Wilson",
    excerpt: "Biodegradable penetrants and recyclable reference materials mark commitment to environmental stewardship.",
    content: "In alignment with global sustainability goals, we've launched our 'Green NDT' initiative featuring bio-based penetrant materials with 98% biodegradability, energy-efficient ultrasonic pulsers reducing power consumption by 35%, and a comprehensive recycling program for used calibration blocks. These innovations maintain rigorous testing standards while significantly reducing environmental footprint across NDT operations.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=450&fit=crop",
    tags: ["Sustainability", "Green Technology", "Eco-Friendly", "Innovation"]
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

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const newsSeoData = {
    title: "NDT Industry News & Updates | DAKS Tools – Chennai NDT Equipment Manufacturer",
    description: "Latest NDT industry news, technology innovations, and company updates from DAKS Tools. ASNT award-winning research, Boeing partnerships, and ASNT Level III training programs in Chennai, India.",
    keywords: "NDT news India, ultrasonic testing updates, NDT industry news Chennai, ASNT conference updates, NDT technology innovations, DAKS Tools news, Boeing NDT partnership, ASNT Level III training Chennai, green NDT initiatives, phased array technology news",
    canonicalUrl: "https://dakstools.com/news",
    ogImage: "https://dakstools.com/images/news-daks-tools.jpg"
  };

  const newsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "name": "DAKS Tools News",
        "url": "https://dakstools.com/news",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dakstools.com/daks.png",
          "width": "161",
          "height": "70"
        },
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
            "name": "News & Updates",
            "item": "https://dakstools.com/news"
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Latest NDT Industry News",
        "description": "Recent news articles about NDT technology, partnerships, and innovations from DAKS Tools Chennai.",
        "numberOfItems": news.length,
        "itemListElement": news.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "NewsArticle",
            "headline": item.title,
            "datePublished": item.date,
            "author": {
              "@type": "Person",
              "name": item.author
            },
            "description": item.excerpt,
            "articleBody": item.content,
            "image": item.image,
            "keywords": item.tags.join(", "),
            "url": `https://dakstools.com/news/${item.id}`
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What NDT industry news does DAKS Tools publish?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools publishes news on NDT technology innovations, industry partnerships (including Boeing), ASNT conference updates, training programs, sustainability initiatives, and company expansion covering ultrasonic testing, phased array, and advanced NDT methodologies."
            }
          },
          {
            "@type": "Question",
            "name": "Does DAKS Tools offer NDT training programs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, DAKS Tools operates a 12,000 sq ft NDT Training Academy in Chennai offering ASNT Level III certification programs in ultrasonic, radiographic, eddy current, and penetrant testing, with 500+ engineered flaw specimens for hands-on training."
            }
          },
          {
            "@type": "Question",
            "name": "What awards has DAKS Tools received?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools received the prestigious 'Innovation Excellence' award at ASNT Conference 2024 for groundbreaking research in AI-assisted defect recognition and deep learning for automated flaw classification in aerospace components."
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
        <title>{newsSeoData.title}</title>
        <meta name="description" content={newsSeoData.description} />
        <meta name="keywords" content={newsSeoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={newsSeoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={newsSeoData.canonicalUrl} />
        <meta property="og:title" content="DAKS Tools News – NDT Industry Updates & Innovations" />
        <meta property="og:description" content={newsSeoData.description} />
        <meta property="og:image" content={newsSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools News - NDT Industry Updates from Chennai" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:publisher" content="https://www.facebook.com/dakstools" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="DAKS Tools News – NDT Industry Updates" />
        <meta name="twitter:description" content={newsSeoData.description} />
        <meta name="twitter:image" content={newsSeoData.ogImage} />
        <meta name="twitter:image:alt" content="DAKS Tools NDT News and Updates" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(newsSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="news-page">
        {/* Page Container */}
        <div className="news-page-container">
          
          {/* HERO HEADER */}
          <header className="news-header">
            <div className="news-header-overlay">
              <h1 className="news-header-title">NDT Industry News & Updates</h1>
              <div className="news-header-divider"></div>
              <p className="news-header-tagline">
                Stay Updated with DAKS Tools' Latest Innovations and NDT Industry Insights
              </p>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="news-content-section">
            <div className="news-content-inner">
              
              {/* INTRO SECTION */}
              <div className="news-intro">
                <h2 className="news-section-title">Latest NDT News</h2>
                <h3 className="news-section-subtitle">Industry Updates, Technology Advances, and Company Announcements</h3>
                <p className="news-section-text">
                  Discover the latest developments in Non-Destructive Testing technology from DAKS Tools Chennai, 
                  including ASNT award-winning research, strategic partnerships with Boeing, training initiatives, 
                  and sustainable NDT solutions serving aerospace, oil & gas, and manufacturing sectors across India.
                </p>
              </div>

              {/* SEARCH AND FILTER BAR */}
              <div className="news-controls">
                <div className="search-container">
                  <div className="search-icon">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Search">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search NDT news articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Search news articles"
                  />
                  {searchTerm && (
                    <button className="clear-search" onClick={() => setSearchTerm('')} aria-label="Clear search">
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
                        aria-label={`Filter by ${category.name} category`}
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
                          alt={`${item.title} - DAKS Tools NDT News`}
                          className="news-image"
                          loading="lazy"
                        />
                        <div className="news-category-badge">{item.category}</div>
                        <div className="news-date-overlay">{item.date}</div>
                      </div>
                      
                      <div className="news-content">
                        <div className="news-meta">
                          <span className="news-author">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Author">
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
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Read more">
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
                    <p>Try adjusting your search or filter criteria for NDT news.</p>
                  </div>
                )}
              </div>

              {/* NEWSLETTER SIGNUP */}
              <div className="newsletter-section">
                <div className="newsletter-content">
                  <h3>Stay Updated with NDT Industry News</h3>
                  <p>Subscribe to DAKS Tools newsletter for the latest NDT insights, technology updates, and company announcements from Chennai.</p>
                  <form className="newsletter-form">
                    <input 
                      type="email" 
                      placeholder="Enter your email address"
                      className="newsletter-input"
                      aria-label="Email for newsletter"
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
              <button className="modal-close" onClick={closeNewsModal} aria-label="Close article">×</button>
              
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
                    <div className="author-role">Senior NDT Specialist at DAKS Tools</div>
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
                      <li>Latest advancements in NDT technology from DAKS Tools Chennai</li>
                      <li>Industry collaboration and strategic partnerships</li>
                      <li>ASNT-certified educational and training initiatives</li>
                      <li>Sustainable and eco-friendly testing methodologies</li>
                    </ul>
                    
                    <h3>Industry Impact</h3>
                    <p>
                      This development represents a significant step forward in Non-Destructive Testing 
                      methodologies, offering improved accuracy, efficiency, and reliability for 
                      critical infrastructure inspections across aerospace, oil & gas, and manufacturing industries in India and global markets.
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
                    <h4>Share This NDT News Article</h4>
                    <div className="share-buttons">
                      <button className="share-btn linkedin" aria-label="Share on LinkedIn">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </button>
                      <button className="share-btn twitter" aria-label="Share on Twitter">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </button>
                      <button className="share-btn email" aria-label="Share via Email">
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
    </>
  );
};

export default NewsPage;