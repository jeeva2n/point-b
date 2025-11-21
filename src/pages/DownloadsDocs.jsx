import React, { useState } from 'react';
import './css/DownloadsDocs.css';

function DownloadsDocs() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Documents', icon: '📚' },
    { id: 'manuals', name: 'Product Manuals', icon: '📖' },
    { id: 'specs', name: 'Technical Specs', icon: '📋' },
    { id: 'catalogs', name: 'Product Catalogs', icon: '📒' },
    { id: 'safety', name: 'Safety Guides', icon: '🛡️' },
    { id: 'certificates', name: 'Certificates', icon: '🏆' },
    { id: 'drawings', name: 'Technical Drawings', icon: '📐' },
    { id: 'software', name: 'Software & Tools', icon: '💻' }
  ];

  const documents = [
    {
      id: 1,
      name: 'DAKS TOOLS Complete Product Catalog 2024',
      category: 'catalogs',
      description: 'Comprehensive catalog featuring all our precision tools, accessories, and industrial equipment.',
      fileType: 'PDF',
      fileSize: '15.2 MB',
      version: 'v2.4',
      downloadCount: 1247,
      lastUpdated: '2024-12-01',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'CNC Machine Operation Manual',
      category: 'manuals',
      description: 'Detailed operation and maintenance guide for DAKS CNC precision machines.',
      fileType: 'PDF',
      fileSize: '8.7 MB',
      version: 'v1.2',
      downloadCount: 892,
      lastUpdated: '2024-11-15',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Safety Standards & Compliance Guide',
      category: 'safety',
      description: 'Complete safety procedures and compliance guidelines for industrial tool usage.',
      fileType: 'PDF',
      fileSize: '5.3 MB',
      version: 'v3.1',
      downloadCount: 1563,
      lastUpdated: '2024-12-10',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'Precision Tools Technical Specifications',
      category: 'specs',
      description: 'Detailed technical specifications and performance metrics for all precision tools.',
      fileType: 'PDF',
      fileSize: '12.1 MB',
      version: 'v4.0',
      downloadCount: 734,
      lastUpdated: '2024-11-28',
      downloadUrl: '#'
    },
    {
      id: 5,
      name: 'ISO 9001:2015 Quality Certificate',
      category: 'certificates',
      description: 'Official ISO 9001:2015 quality management system certification.',
      fileType: 'PDF',
      fileSize: '2.1 MB',
      version: 'v1.0',
      downloadCount: 543,
      lastUpdated: '2024-10-20',
      downloadUrl: '#'
    },
    {
      id: 6,
      name: 'CAD Technical Drawings Package',
      category: 'drawings',
      description: 'Complete set of CAD drawings for custom tool configurations and installations.',
      fileType: 'ZIP',
      fileSize: '45.8 MB',
      version: 'v2.1',
      downloadCount: 321,
      lastUpdated: '2024-11-05',
      downloadUrl: '#'
    },
    {
      id: 7,
      name: 'DAKS Tool Configuration Software',
      category: 'software',
      description: 'Advanced software for configuring and optimizing precision tool settings.',
      fileType: 'EXE',
      fileSize: '78.3 MB',
      version: 'v5.2',
      downloadCount: 678,
      lastUpdated: '2024-12-05',
      downloadUrl: '#'
    },
    {
      id: 8,
      name: 'Maintenance Schedule & Checklist',
      category: 'manuals',
      description: 'Comprehensive maintenance schedules and checklists for long-term tool performance.',
      fileType: 'PDF',
      fileSize: '3.4 MB',
      version: 'v1.5',
      downloadCount: 987,
      lastUpdated: '2024-11-20',
      downloadUrl: '#'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'zip': return '📦';
      case 'exe': return '⚙️';
      case 'doc': return '📝';
      case 'xls': return '📊';
      default: return '📎';
    }
  };

  const formatDownloadCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="downloads-docs-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="downloads-header">
          <div className="header-overlay">
            <div className="company-logo">DAKS TOOLS</div>
            <div className="header-subtitle">PRECISION TOOLS MANUFACTURING</div>
            <h1 className="header-title">Downloads & Documentation</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
              Access Technical Documents, Manuals, and Resources for Your Precision Tools
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="downloads-content">
          <div className="content-inner">
            {/* Search and Filter Section */}
            <section className="filter-section">
              <div className="search-container">
                <div className="search-box">
                  <div className="search-icon">🔍</div>
                  <input
                    type="text"
                    placeholder="Search documents, manuals, or technical resources..."
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

            {/* Statistics Section */}
            <section className="stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-content">
                    <h3>{documents.length}+</h3>
                    <p>Documents Available</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⬇️</div>
                  <div className="stat-content">
                    <h3>6.9K+</h3>
                    <p>Total Downloads</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔄</div>
                  <div className="stat-content">
                    <h3>24/7</h3>
                    <p>Document Access</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>2024</h3>
                    <p>Latest Updates</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Documents Grid */}
            <section className="documents-section">
              <div className="section-header">
                <h2>Technical Documents & Resources</h2>
                <p>Download manuals, specifications, certificates, and technical resources for your DAKS tools</p>
              </div>

              <div className="documents-grid">
                {filteredDocuments.map(doc => (
                  <div key={doc.id} className="document-card">
                    <div className="document-header">
                      <div className="file-icon">{getFileIcon(doc.fileType)}</div>
                      <div className="document-info">
                        <h3>{doc.name}</h3>
                        <div className="document-meta">
                          <span className="file-type">{doc.fileType}</span>
                          <span className="file-size">{doc.fileSize}</span>
                          <span className="version">{doc.version}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="document-content">
                      <p className="document-description">{doc.description}</p>
                      
                      <div className="document-stats">
                        <div className="stat">
                          <span className="stat-icon">⬇️</span>
                          <span>{formatDownloadCount(doc.downloadCount)} downloads</span>
                        </div>
                        <div className="stat">
                          <span className="stat-icon">📅</span>
                          <span>Updated {doc.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="document-actions">
                      <button className="download-btn">
                        <span className="btn-icon">⬇️</span>
                        Download Now
                      </button>
                      <button className="preview-btn">
                        <span className="btn-icon">👁️</span>
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Access Section */}
            <section className="quick-access-section">
              <div className="section-header">
                <h2>Quick Access Resources</h2>
                <p>Frequently accessed documents and essential resources</p>
              </div>

              <div className="quick-access-grid">
                <div className="quick-access-card">
                  <div className="access-icon">🚀</div>
                  <h3>Getting Started Guide</h3>
                  <p>Quick start guide for new DAKS tools users</p>
                  <button className="access-btn">Access Guide</button>
                </div>
                <div className="quick-access-card">
                  <div className="access-icon">🛠️</div>
                  <h3>Troubleshooting Manual</h3>
                  <p>Common issues and solutions for precision tools</p>
                  <button className="access-btn">View Manual</button>
                </div>
                <div className="quick-access-card">
                  <div className="access-icon">📞</div>
                  <h3>Support Contacts</h3>
                  <p>Technical support and customer service contacts</p>
                  <button className="access-btn">Contact Info</button>
                </div>
                <div className="quick-access-card">
                  <div className="access-icon">🎥</div>
                  <h3>Video Tutorials</h3>
                  <p>Step-by-step video guides and tutorials</p>
                  <button className="access-btn">Watch Videos</button>
                </div>
              </div>
            </section>

            {/* Support Section */}
            <section className="support-section">
              <div className="support-content">
                <h2>Need Help Finding Documents?</h2>
                <p>Our technical support team is available to help you find the right documents and resources</p>
                <div className="support-actions">
                  <button className="support-btn primary">Contact Technical Support</button>
                  <button className="support-btn secondary">Request Custom Documentation</button>
                </div>
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

export default DownloadsDocs;