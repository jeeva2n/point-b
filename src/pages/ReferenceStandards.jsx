// pages/ReferenceStandards.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ReferenceStandards.css";

function ReferenceStandards({ category: initialCategory }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Categories list
  const categories = [
    "All",
    "UT Calibration Blocks",
    "PAUT Calibration Blocks",
    "TOFD Calibration Blocks",
    "MT/PT Calibration Blocks",
    "ET Calibration Blocks",
    "ECT/RFT/MFL Calibration Tubes",
    "APR Reference Tubes",
    "AUT-Z Reference Blocks"
  ];

  // Category to URL mapping
  const categoryUrlMap = {
    "All": "/reference-standards",
    "UT Calibration Blocks": "/calibration-blocks/ut",
    "PAUT Calibration Blocks": "/calibration-blocks/paut",
    "TOFD Calibration Blocks": "/calibration-blocks/tofd",
    "MT/PT Calibration Blocks": "/calibration-blocks/mt-pt",
    "ET Calibration Blocks": "/calibration-blocks/et",
    "ECT/RFT/MFL Calibration Tubes": "/calibration-blocks/ect-rft-mfl",
    "APR Reference Tubes": "/calibration-blocks/apr",
    "AUT-Z Reference Blocks": "/calibration-blocks/aut-z"
  };

  // Update selected category when prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const reveal = () => {
      const elements = document.querySelectorAll(".product-card");
      elements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products?type=calibration_block");
      console.log("Fetching reference standards from:", response.url);
      
      const data = await response.json();
      console.log("Reference standards response:", data);

      if (data.success) {
        setProducts(data.products || []);
        console.log("Loaded reference standards:", data.products.length);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reference standards:", err);
      setLoading(false);
    }
  };

  // Handle category change with navigation
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const url = categoryUrlMap[category];
    if (url) {
      navigate(url);
    }
  };

  // Navigate to product detail page
  const handleViewDetails = (product) => {
    // Navigate to product detail page with product ID
    navigate(`/product/${product.id}`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    navigate("/reference-standards");
  };

  // Get page title based on category
  const getPageTitle = () => {
    if (selectedCategory && selectedCategory !== "All") {
      return selectedCategory;
    }
    return "Reference Standards";
  };

  // Get page description based on category
  const getPageDescription = () => {
    const descriptions = {
      "All": "Industry-certified reference standards for accurate NDT calibration and validation",
      "UT Calibration Blocks": "Precision ultrasonic testing calibration blocks for thickness and flaw detection",
      "PAUT Calibration Blocks": "Phased Array Ultrasonic Testing calibration blocks for advanced inspections",
      "TOFD Calibration Blocks": "Time-of-Flight Diffraction calibration blocks for weld inspection",
      "MT/PT Calibration Blocks": "Magnetic Particle and Penetrant Testing reference standards",
      "ET Calibration Blocks": "Eddy Current Testing calibration standards for surface inspections",
      "ECT/RFT/MFL Calibration Tubes": "Tube inspection calibration standards for heat exchangers",
      "APR Reference Tubes": "Acoustic Pulse Reflectometry reference tubes for pipeline inspection",
      "AUT-Z Reference Blocks": "Automated Ultrasonic Testing reference blocks for pipeline girth welds"
    };
    return descriptions[selectedCategory] || descriptions["All"];
  };

  return (
    <div className="reference-standards-container">
      <div className="page-container-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <span className="header-badge">NDT EXCELLENCE</span>
            <h1>{getPageTitle()}</h1>
            <p>{getPageDescription()}</p>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{filteredProducts.length}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{categories.length - 1}</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">ISO</span>
                <span className="stat-label">Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {selectedCategory !== "All" && (
          <div className="breadcrumb">
            <span onClick={() => navigate("/reference-standards")} className="breadcrumb-link">
              Reference Standards
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{selectedCategory}</span>
          </div>
        )}

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h2>Browse Standards</h2>
            <p>Find the perfect reference standard for your NDT requirements</p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search reference standards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {(searchTerm || selectedCategory !== "All") && (
            <div className="active-filters">
              <span className="filters-label">Active filters:</span>
              {selectedCategory !== "All" && (
                <span className="filter-tag">
                  {selectedCategory}
                  <button onClick={() => handleCategoryChange("All")}>×</button>
                </span>
              )}
              {searchTerm && (
                <span className="filter-tag">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>×</button>
                </span>
              )}
              <button className="clear-all-btn" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Products Section */}
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading reference standards...</span>
          </div>
        ) : (
          <div className="products-container">
            <div className="results-header">
              <span className="results-count">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="product-card hardware-accelerated"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className="product-image"
                      onClick={() => handleViewDetails(product)}
                    >
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>

                    <div className="product-info">
                      <div className="product-badges">
                        <span className="product-category-badge">
                          {product.category}
                        </span>
                        {product.subcategory && (
                          <span className="product-subcategory-badge">
                            {product.subcategory}
                          </span>
                        )}
                      </div>

                      <h3>{product.name}</h3>
                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-meta">
                        {product.material && (
                          <span className="meta-item">📦 {product.material}</span>
                        )}
                        {product.dimensions && (
                          <span className="meta-item">📐 {product.dimensions}</span>
                        )}
                        {product.standards && (
                          <span className="meta-item">📋 {product.standards}</span>
                        )}
                      </div>

                      <div className="product-footer">
                        {/* <div className="product-price">
                          ₹{parseFloat(product.price || 0).toFixed(2)}
                        </div> */}
                        <button
                          className="view-details-btn"
                          onClick={() => handleViewDetails(product)}
                        >
                          <span>View Details</span>
                          <span className="btn-arrow">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No {selectedCategory !== "All" ? selectedCategory : "Reference Standards"} Found</h3>
                <p>
                  {products.length === 0
                    ? "No products available. Add some from the admin dashboard."
                    : "No products match your current search criteria."}
                </p>
                {products.length > 0 && (
                  <button className="reset-btn" onClick={clearFilters}>
                    Clear Filters & Show All
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReferenceStandards;
