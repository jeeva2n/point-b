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

  // Configuration
  const BACKEND_URL = "http://192.168.1.9:5001";

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

  // --- IMAGE HELPER FUNCTION (Fixes runtime errors) ---
  const getImageSrc = (product) => {
    if (!product) return "/images/placeholder.jpg";

    let imagePath = 
      product.image_url || 
      product.mainImage || 
      (product.images && product.images.length > 0 ? product.images[0] : null);

    if (!imagePath) return "/images/placeholder.jpg";

    // Handle object structure safely
    if (typeof imagePath === 'object') {
      if (imagePath.url) imagePath = imagePath.url;
      else if (imagePath.path) imagePath = imagePath.path;
      else return "/images/placeholder.jpg";
    }

    const pathString = String(imagePath);

    if (pathString.startsWith("http") || pathString.startsWith("blob:")) {
      return pathString;
    }

    const cleanPath = pathString.startsWith("/") ? pathString : `/${pathString}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  // Fetch validation blocks
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/products?type=validation_block`
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const url = categoryUrlMap[category];
    if (url) {
      navigate(url);
    }
  };

  const handleViewDetails = (product) => {
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
    navigate("/validation-blocks");
  };

  const getPageTitle = () => {
    if (selectedCategory && selectedCategory !== "All") {
      return selectedCategory;
    }
    return "Validation Blocks";
  };

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

  // Helper for material string
  const getMaterialString = (material) => {
    if (!material) return null;
    if (Array.isArray(material)) return material[0];
    if (typeof material === 'object') return JSON.stringify(material);
    return String(material);
  };

  // --- SVG ICONS ---
  const Icons = {
    Search: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
    Close: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    Box: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    Ruler: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20"></path>
        <path d="M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"></path>
        <path d="M2 12V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"></path>
        <path d="M12 2v20"></path>
      </svg>
    ),
    Clipboard: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      </svg>
    ),
    ArrowRight: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    ),
    Empty: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
    ArrowRightSm: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    )
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
            <span className="breadcrumb-separator"><Icons.ArrowRightSm /></span>
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
            {searchTerm ? (
              <button className="search-clear" onClick={() => setSearchTerm("")}>
                <Icons.Close />
              </button>
            ) : (
              <div className="search-icon-wrapper">
                <Icons.Search />
              </div>
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
                  <button onClick={() => handleCategoryChange("All")}><Icons.Close /></button>
                </span>
              )}

              {searchTerm && (
                <span className="filter-tag">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}><Icons.Close /></button>
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
                        src={getImageSrc(product)}
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
                          <span className="meta-item">
                            <span className="meta-icon"><Icons.Box /></span>
                            {getMaterialString(product.material)}
                          </span>
                        )}
                        {product.dimensions && (
                          <span className="meta-item">
                            <span className="meta-icon"><Icons.Ruler /></span>
                            {product.dimensions}
                          </span>
                        )}
                        {product.standards && (
                          <span className="meta-item">
                            <span className="meta-icon"><Icons.Clipboard /></span>
                            {product.standards}
                          </span>
                        )}
                      </div>

                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(product)}
                      >
                        <span>View Details</span>
                        <span className="btn-arrow"><Icons.ArrowRight /></span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <div className="no-products-icon"><Icons.Empty /></div>
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