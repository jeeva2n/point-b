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

  // Configuration
  const BACKEND_URL = "http://192.168.1.9:5001"; 

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

  // --- IMAGE HELPER FUNCTION (FIXED) ---
  const getImageSrc = (product) => {
    if (!product) return "/images/placeholder.jpg";

    // 1. Get raw value
    let imagePath = 
      product.image_url || 
      product.mainImage || 
      (product.images && product.images.length > 0 ? product.images[0] : null);

    // 2. Safety check: if empty, return placeholder
    if (!imagePath) return "/images/placeholder.jpg";

    // 3. Handle if imagePath is an object (e.g. { url: "..." })
    if (typeof imagePath === 'object') {
      if (imagePath.url) imagePath = imagePath.url;
      else if (imagePath.path) imagePath = imagePath.path;
      else return "/images/placeholder.jpg"; // Unknown object structure
    }

    // 4. Ensure it is a string before calling startsWith
    const pathString = String(imagePath);

    // 5. Check URL type
    if (pathString.startsWith("http") || pathString.startsWith("blob:")) {
      return pathString;
    }

    // 6. Return backend path
    const cleanPath = pathString.startsWith("/") ? pathString : `/${pathString}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/products?type=calibration_block`
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reference standards:", err);
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
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    navigate("/reference-standards");
  };

  const getPageTitle = () => {
    if (selectedCategory && selectedCategory !== "All") {
      return selectedCategory;
    }
    return "Reference Standards";
  };

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

  const getMaterialString = (materials) => {
    if (!materials) return null;
    if (Array.isArray(materials)) return materials[0];
    if (typeof materials === 'object') return JSON.stringify(materials); // Safe fallback
    return String(materials);
  };

  // --- SVG ICONS COMPONENTS ---
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
    <div className="reference-standards-container">
      <div className="page-container-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <span className="header-badge">NDT Excellence</span>
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
              onClick={() => navigate("/reference-standards")}
              className="breadcrumb-link"
            >
              Reference Standards
            </span>
            <span className="breadcrumb-separator"><Icons.ArrowRightSm /></span>
            <span className="breadcrumb-current">{selectedCategory}</span>
          </div>
        )}

        {/* Filters */}
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

        {/* Products Grid */}
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
                    {/* Image Section */}
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

                    {/* Info Section */}
                    <div className="product-info">
                      <span className="product-category-badge">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>
                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-meta">
                        {(product.materials || product.material) && (
                          <span className="meta-item">
                            <span className="meta-icon"><Icons.Box /></span>
                            {getMaterialString(product.materials || product.material)}
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
                  No Results Found
                </h3>
                <p>
                  {products.length === 0
                    ? "No reference standards available."
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