import React, { useState } from 'react';
import './css/AccessoriesDocs.css';

function AccessoriesDocs() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Products', icon: '📦' },
    { id: 'cutting', name: 'Cutting Tools', icon: '✂️' },
    { id: 'measuring', name: 'Measuring Instruments', icon: '📐' },
    { id: 'power', name: 'Power Tools', icon: '⚡' },
    { id: 'safety', name: 'Safety Equipment', icon: '🛡️' },
    { id: 'consumables', name: 'Consumables', icon: '🔄' }
  ];

  const products = [
    {
      id: 1,
      name: 'Precision CNC Cutting Tools',
      category: 'cutting',
      description: 'High-precision CNC cutting tools for industrial applications with superior durability and performance.',
      specs: ['Titanium Coated', '0.01mm Precision', 'High-Speed Steel'],
      price: '₹2,500 - ₹15,000',
      image: 'https://tse1.mm.bing.net/th/id/OIP.9iRRE8y5RKhQPCkZtprqwwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
      documents: ['Product Spec Sheet.pdf', 'Installation Guide.pdf', 'Safety Manual.pdf']
    },
    {
      id: 2,
      name: 'Digital Calipers Set',
      category: 'measuring',
      description: 'Advanced digital calipers with LCD display and precision measurement capabilities.',
      specs: ['0-150mm Range', 'IP54 Rated', 'Carbon Fiber Body'],
      price: '₹1,200 - ₹8,000',
      image: 'https://m.media-amazon.com/images/I/71TfgH5ycfL._SL1500_.jpg',
      documents: ['User Manual.pdf', 'Calibration Guide.pdf', 'Warranty Card.pdf']
    },
    {
      id: 3,
      name: 'Industrial Power Drill Kit',
      category: 'power',
      description: 'Heavy-duty industrial power drill kit with variable speed and multiple accessories.',
      specs: ['800W Motor', 'Variable Speed', 'Keyless Chuck'],
      price: '₹4,500 - ₹25,000',
      image: 'https://i5.walmartimages.com/seo/20v-Electric-Power-Drill-Kit-For-Home-Repair-Maintainance-And-Improvements-Including-All-Daily-Tools-Bits-Sockets-Screwdriver-Tape-Measure-Plier-Leve_72a21db1-8075-45e9-8eb2-cc89a84c2263.3c32ac42ad241df3c40c9029282652ae.jpeg',
      documents: ['Operation Manual.pdf', 'Safety Guidelines.pdf', 'Accessories List.pdf']
    },
    {
      id: 4,
      name: 'Safety Goggles & Helmets',
      category: 'safety',
      description: 'Industrial-grade safety equipment including anti-fog goggles and impact-resistant helmets.',
      specs: ['Anti-Fog Coating', 'UV Protection', 'Adjustable Headgear'],
      price: '₹800 - ₹3,500',
      image: 'https://tse1.mm.bing.net/th/id/OIP.7qQ6z_6Bc_xVd13Wxc-fRgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      documents: ['Safety Standards.pdf', 'Usage Guide.pdf', 'Cleaning Instructions.pdf']
    },
    {
      id: 5,
      name: 'Industrial Lubricants Pack',
      category: 'consumables',
      description: 'High-performance industrial lubricants for machinery maintenance and optimal performance.',
      specs: ['High Temperature', 'Water Resistant', 'Long Lasting'],
      price: '₹500 - ₹2,800',
      image: 'https://interstatesupply.co.in/wp-content/uploads/2024/08/b2b-MARCH-2016-may-pg-38-.jpg',
      documents: ['MSDS Sheet.pdf', 'Application Guide.pdf', 'Storage Instructions.pdf']
    },
    {
      id: 6,
      name: 'Precision Grinding Wheels',
      category: 'cutting',
      description: 'Diamond-coated grinding wheels for precision surface finishing and material removal.',
      specs: ['Diamond Coated', 'Multiple Grits', 'Heat Resistant'],
      price: '₹1,800 - ₹12,000',
      image: 'https://tse1.mm.bing.net/th/id/OIP.zHQZy8v0ld-HGxWWeZRmwQHaD5?rs=1&pid=ImgDetMain&o=7&rm=3',
      documents: ['Technical Specs.pdf', 'Usage Manual.pdf', 'Safety Precautions.pdf']
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="accessories-docs-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="accessories-header">
          <div className="header-overlay">
            <div className="company-logo">DAKS TOOLS</div>
            <div className="header-subtitle">PRECISION TOOLS MANUFACTURING</div>
            <h1 className="header-title">Accessories & Documentation</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
              Premium Tools and Comprehensive Documentation for Industrial Excellence
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="accessories-content">
          <div className="content-inner">
            {/* Search and Filter Section */}
            <section className="filter-section">
              <div className="search-container">
                <div className="search-box">
                  <div className="search-icon">🔍</div>
                  <input
                    type="text"
                    placeholder="Search products, specifications, or documents..."
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

            {/* Products Grid */}
            <section className="products-section">
              <div className="section-header">
                <h2>Our Products & Accessories</h2>
                <p>Discover our comprehensive range of precision tools and industrial accessories</p>
              </div>

              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-category">{product.category}</div>
                    </div>
                    
                    <div className="product-content">
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-specs">
                        <h4>Key Specifications:</h4>
                        <ul>
                          {product.specs.map((spec, index) => (
                            <li key={index}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="product-price">{product.price}</div>
                      
                      <div className="product-documents">
                        <h4>Available Documents:</h4>
                        <div className="documents-list">
                          {product.documents.map((doc, index) => (
                            <div key={index} className="document-item">
                              <span className="doc-icon">📄</span>
                              <span className="doc-name">{doc}</span>
                              <button className="download-btn">Download</button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="product-actions">
                        <button className="inquiry-btn">Request Quote</button>
                        <button className="catalog-btn">View Catalog</button>
                      </div>
                    </div>
                  </div>
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

export default AccessoriesDocs;