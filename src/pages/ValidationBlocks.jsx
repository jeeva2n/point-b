// pages/ValidationBlocks.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ValidationBlocks.css";

function ValidationBlocks({ category: initialCategory }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Categories list
  const categories = [
    "All",
    "UT Validation Blocks",
    "PAUT and ToFD Validation Blocks",
    "Boiler Tube PAUT Validation Blocks"
  ];

  // Category to URL mapping
  const categoryUrlMap = {
    "All": "/validation-blocks",
    "UT Validation Blocks": "/validation-blocks/ut",
    "PAUT and ToFD Validation Blocks": "/validation-blocks/paut-tofd",
    "Boiler Tube PAUT Validation Blocks": "/validation-blocks/boiler-tube"
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

  // Scroll reveal animation
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

  // Fetch validation blocks
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products?type=validation_block"
      );
      console.log("Fetching validation blocks from:", response.url);

      const data = await response.json();
      console.log("Validation blocks response:", data);

      if (data.success) {
        setProducts(data.products || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching validation blocks:", err);
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
    navigate(`/product/${product.id}`);
  };

  // Filter products
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
    navigate("/validation-blocks");
  };

  // Page title
  const getPageTitle = () => {
    if (selectedCategory && selectedCategory !== "All") {
      return selectedCategory;
    }
    return "Validation Blocks";
  };

  // Page description
  const getPageDescription = () => {
    const descriptions = {
      "All":
        "Precision-engineered validation blocks for equipment calibration and NDT accuracy verification",
      "UT Validation Blocks":
        "Ultrasonic testing validation blocks for thickness, sensitivity, and velocity checks",
      "PAUT and ToFD Validation Blocks":
        "Advanced validation blocks for phased array and TOFD inspections",
      "Boiler Tube PAUT Validation Blocks":
        "Specialized PAUT validation blocks for boiler and heat exchanger tube inspection"
    };
    return descriptions[selectedCategory] || descriptions["All"];
  };

  return (
    <div className="validation-blocks-container">
      <div className="page-container-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <span className="header-badge">EQUIPMENT VALIDATION</span>
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

        {/* Breadcrumb */}
        {selectedCategory !== "All" && (
          <div className="breadcrumb">
            <span
              onClick={() => navigate("/validation-blocks")}
              className="breadcrumb-link"
            >
              Validation Blocks
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{selectedCategory}</span>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <h2>Browse Validation Blocks</h2>
            <p>Find the right validation block for your NDT equipment</p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search validation blocks..."
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

        {/* Products */}
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading validation blocks...</span>
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
                      <span className="product-category-badge">
                        {product.category}
                      </span>

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

                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(product)}
                      >
                        <span>View Details</span>
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <div className="no-products-icon">⚙️</div>
                <h3>
                  No{" "}
                  {selectedCategory !== "All"
                    ? selectedCategory
                    : "Validation Blocks"}{" "}
                  Found
                </h3>
                <p>
                  {products.length === 0
                    ? "No validation blocks available. Add some from the admin dashboard."
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

export default ValidationBlocks;
