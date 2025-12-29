import React, { useState } from 'react';
import './css/Blog.css';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Articles', icon: '📚' },
    { id: 'technology', name: 'Technology', icon: '🔬' },
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
    { id: 'innovation', name: 'Innovation', icon: '💡' },
    { id: 'industry', name: 'Industry News', icon: '📰' },
    { id: 'tutorials', name: 'Tutorials', icon: '🎓' },
    { id: 'case-studies', name: 'Case Studies', icon: '📊' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Precision Manufacturing: AI and Machine Learning Integration',
      excerpt: 'Explore how artificial intelligence is revolutionizing precision tool manufacturing and what it means for the industry.',
      category: 'technology',
      author: 'Dr. Rajesh Kumar',
      date: '2024-12-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1581094794329-c6e8b63a66e9?auto=format&fit=crop&w=600&q=80',
      tags: ['AI', 'Manufacturing', 'Innovation'],
      featured: true
    },
    {
      id: 2,
      title: '5 Ways CNC Technology is Transforming Indian Manufacturing',
      excerpt: 'Discover how CNC machining is driving efficiency and precision in Indian manufacturing sectors.',
      category: 'manufacturing',
      author: 'Priya Sharma',
      date: '2024-12-12',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1581093450332-821811d2c5f2?auto=format&fit=crop&w=600&q=80',
      tags: ['CNC', 'Manufacturing', 'India'],
      featured: true
    },
    {
      id: 3,
      title: 'Sustainable Manufacturing: Eco-Friendly Practices in Tool Production',
      excerpt: 'Learn about DAKS TOOLS commitment to sustainable manufacturing and our eco-friendly initiatives.',
      category: 'innovation',
      author: 'Arun Mehta',
      date: '2024-12-08',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1572981779307-38f8b0456222?auto=format&fit=crop&w=600&q=80',
      tags: ['Sustainability', 'Eco-Friendly', 'Green'],
      featured: false
    },
    {
      id: 4,
      title: 'Case Study: How DAKS Tools Helped Automotive Giant Reduce Production Time by 40%',
      excerpt: 'Real-world case study showcasing how our precision tools transformed automotive manufacturing processes.',
      category: 'case-studies',
      author: 'Sanjay Patel',
      date: '2024-12-05',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1581094794329-c6e8b63a66e9?auto=format&fit=crop&w=600&q=80',
      tags: ['Case Study', 'Automotive', 'Efficiency'],
      featured: false
    },
    {
      id: 5,
      title: 'The Art of Tool Maintenance: Best Practices for Longevity',
      excerpt: 'Essential maintenance tips to extend the life of your precision tools and ensure optimal performance.',
      category: 'tutorials',
      author: 'Meera Desai',
      date: '2024-12-01',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1581093450332-821811d2c5f2?auto=format&fit=crop&w=600&q=80',
      tags: ['Maintenance', 'Best Practices', 'Tools'],
      featured: false
    },
    {
      id: 6,
      title: 'Industry 4.0: How Smart Factories are Changing Manufacturing',
      excerpt: 'Understanding the impact of Industry 4.0 and smart factory technologies on modern manufacturing.',
      category: 'industry',
      author: 'Vikram Singh',
      date: '2024-11-28',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1572981779307-38f8b0456222?auto=format&fit=crop&w=600&q=80',
      tags: ['Industry 4.0', 'Smart Factory', 'Technology'],
      featured: false
    },
    {
      id: 7,
      title: 'Precision Engineering: The Science Behind Our Cutting Tools',
      excerpt: 'Deep dive into the materials science and engineering that makes DAKS cutting tools exceptional.',
      category: 'technology',
      author: 'Dr. Anjali Verma',
      date: '2024-11-25',
      readTime: '11 min read',
      image: 'https://images.unsplash.com/photo-1581094794329-c6e8b63a66e9?auto=format&fit=crop&w=600&q=80',
      tags: ['Engineering', 'Materials', 'Science'],
      featured: false
    },
    {
      id: 8,
      title: 'Quality Control in Precision Tool Manufacturing: Our Rigorous Process',
      excerpt: 'Behind the scenes look at our comprehensive quality control procedures that ensure every tool meets standards.',
      category: 'manufacturing',
      author: 'Rahul Joshi',
      date: '2024-11-20',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1581093450332-821811d2c5f2?auto=format&fit=crop&w=600&q=80',
      tags: ['Quality Control', 'Standards', 'Manufacturing'],
      featured: false
    }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="blog-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="blog-header">
          <div className="header-overlay">
            <div className="company-logo">DAKS TOOLS</div>
            <div className="header-subtitle">PRECISION TOOLS MANUFACTURING</div>
            <h1 className="header-title">DAKS Blog</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
              Insights, Innovations, and Industry Expertise from Precision Tools Leaders
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="blog-content">
          <div className="content-inner">
            {/* Search and Filter Section */}
            <section className="filter-section">
              <div className="search-container">
                <div className="search-box">
                  <div className="search-icon">🔍</div>
                  <input
                    type="text"
                    placeholder="Search articles, topics, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Posts Section */}
            {activeCategory === 'all' && searchTerm === '' && (
              <section className="featured-section">
                <div className="section-header">
                  <h2>Featured Articles</h2>
                  <p>In-depth insights and cutting-edge developments in precision manufacturing</p>
                </div>

                <div className="featured-grid">
                  {featuredPosts.map(post => (
                    <article key={post.id} className="featured-post-card">
                      <div className="post-image">
                        <img src={post.image} alt={post.title} />
                        <div className="post-category">{post.category}</div>
                        <div className="featured-badge">Featured</div>
                      </div>
                      
                      <div className="post-content">
                        <div className="post-meta">
                          <span className="author">By {post.author}</span>
                          <span className="date">{formatDate(post.date)}</span>
                          <span className="read-time">{post.readTime}</span>
                        </div>
                        
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-excerpt">{post.excerpt}</p>
                        
                        <div className="post-tags">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                        
                        <button className="read-more-btn">
                          Read Full Article
                          <span className="btn-arrow">→</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* All Posts Section */}
            <section className="posts-section">
              <div className="section-header">
                <h2>
                  {activeCategory === 'all' && searchTerm === '' ? 'Latest Articles' : 
                   searchTerm ? `Search Results for "${searchTerm}"` : 
                   categories.find(cat => cat.id === activeCategory)?.name}
                </h2>
                <p>
                  {searchTerm ? `Found ${filteredPosts.length} articles matching your search` :
                   'Stay updated with the latest trends and insights in precision tools manufacturing'}
                </p>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="posts-grid">
                  {filteredPosts.map(post => (
                    <article key={post.id} className="post-card">
                      <div className="post-image">
                        <img src={post.image} alt={post.title} />
                        <div className="post-category">{post.category}</div>
                        {post.featured && <div className="featured-badge">Featured</div>}
                      </div>
                      
                      <div className="post-content">
                        <div className="post-meta">
                          <span className="author">By {post.author}</span>
                          <span className="date">{formatDate(post.date)}</span>
                          <span className="read-time">{post.readTime}</span>
                        </div>
                        
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-excerpt">{post.excerpt}</p>
                        
                        <div className="post-tags">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                        
                        <button className="read-more-btn">
                          Read More
                          <span className="btn-arrow">→</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No articles found</h3>
                  <p>Try adjusting your search terms or browse different categories</p>
                  <button 
                    className="reset-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                    }}
                  >
                    Show All Articles
                  </button>
                </div>
              )}
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
              <div className="newsletter-content">
                <div className="newsletter-text">
                  <h2>Stay Updated with DAKS Insights</h2>
                  <p>Get the latest articles, industry news, and technical insights delivered to your inbox</p>
                </div>
                <div className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="newsletter-input"
                  />
                  <button className="subscribe-btn">Subscribe</button>
                </div>
              </div>
            </section>

            {/* Popular Tags Section */}
            <section className="tags-section">
              <div className="section-header">
                <h2>Popular Topics</h2>
                <p>Explore articles by popular tags and topics</p>
              </div>
              
              <div className="tags-cloud">
                {['Manufacturing', 'Technology', 'Innovation', 'CNC', 'AI', 'Sustainability', 
                  'Quality Control', 'Industry 4.0', 'Precision Engineering', 'Case Studies', 
                  'Best Practices', 'Indian Manufacturing'].map((tag, index) => (
                  <button key={index} className="tag-cloud-item">
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="company-footer">
          <p>&copy; 2024 DAKS TOOLS. All rights reserved. | Precision Tools Manufacturing</p>
        </footer>
      </div>
    </div>
  );
}

export default Blog;