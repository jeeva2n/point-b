// pages/FlawedSpecimens.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/FlawedSpecimens.css";

function FlawedSpecimens({ category: initialCategory }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || "All"
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Configuration
  const BACKEND_URL = "http://192.168.1.9:5001";

  // Categories
  const categories = [
    "All",
    "Training and Examination Flawed specimens",
    "Ultrasonic Testing Flawed specimens",
    "Dye Penetrant Flawed specimens",
    "Eddy Current Flawed specimens",
    "Radiography Flawed specimens",
    "Visual testing Flawed specimens",
    "Paut and ToFD Flawed specimens",
    "NDT Flawed Specimens Kit",
    "UT Flawed Specimens Kit",
    "NDT Standards Flawed Specimens Kit",
    "MT Flawed Specimens Kit",
    "PT Flawed Specimens Kit",
    "RT Flawed Specimens Kit",
    "ET Flawed Specimens Kit",
    "PAUT and ToFD Flawed Specimens Kit",
    "Welded Specimens",
    "Base Material Flawed Specimens",
    "Advanced NDT Validation Specimens",
    "POD & Training Specimens"
  ];

  // Category → URL mapping
  const categoryUrlMap = {
    All: "/flawed-specimens",
    "Training and Examination Flawed specimens":
      "/flawed-specimens/training-examination",
    "Ultrasonic Testing Flawed specimens": "/flawed-specimens/ultrasonic",
    "Dye Penetrant Flawed specimens": "/flawed-specimens/dye-penetrant",
    "Eddy Current Flawed specimens": "/flawed-specimens/eddy-current",
    "Radiography Flawed specimens": "/flawed-specimens/radiography",
    "Visual testing Flawed specimens": "/flawed-specimens/visual-testing",
    "Paut and ToFD Flawed specimens": "/flawed-specimens/paut-tofd",
    "NDT Flawed Specimens Kit": "/flawed-specimens/ndt-kit",
    "UT Flawed Specimens Kit": "/flawed-specimens/ut-kit",
    "NDT Standards Flawed Specimens Kit": "/flawed-specimens/standards-kit",
    "MT Flawed Specimens Kit": "/flawed-specimens/mt-kit",
    "PT Flawed Specimens Kit": "/flawed-specimens/pt-kit",
    "RT Flawed Specimens Kit": "/flawed-specimens/rt-kit",
    "ET Flawed Specimens Kit": "/flawed-specimens/et-kit",
    "PAUT and ToFD Flawed Specimens Kit":
      "/flawed-specimens/paut-tofd-kit",
    "Welded Specimens": "/flawed-specimens/welded",
    "Base Material Flawed Specimens": "/flawed-specimens/base-material",
    "Advanced NDT Validation Specimens": "/flawed-specimens/advanced",
    "POD & Training Specimens": "/flawed-specimens/pod-training"
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
      document.querySelectorAll(".product-card").forEach((el) => {
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

  // --- IMAGE HELPER FUNCTION ---
  const getImageSrc = (product) => {
    if (!product) return "/images/placeholder.jpg";

    let imagePath = 
      product.image_url || 
      product.mainImage || 
      (product.images && product.images.length > 0 ? product.images[0] : null);

    if (!imagePath) return "/images/placeholder.jpg";

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

  // Helper for material string
  const getMaterialString = (material) => {
    if (!material) return null;
    if (Array.isArray(material)) return material[0];
    if (typeof material === 'object') return JSON.stringify(material);
    return String(material);
  };

  // Fetch products with sorting logic
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/products?type=flawed_specimen`
      );
      const data = await response.json();
      if (data.success) {
        // --- ADDED SORTING LOGIC HERE ---
        const sortedProducts = (data.products || []).sort((a, b) => {
          return (a.sort_order || 0) - (b.sort_order || 0);
        });
        setProducts(sortedProducts);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching flawed specimens:", err);
      setLoading(false);
    }
  };

  // Category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(categoryUrlMap[category]);
  };

  // Navigate to product detail
  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Filtering
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
    navigate("/flawed-specimens");
  };

  const getPageTitle = () =>
    selectedCategory !== "All" ? selectedCategory : "Flawed Specimens";

  const getPageDescription = () => {
    const descriptions = {
      All: "Certified flawed specimens for NDT training, qualification, and probability of detection studies",
      "Ultrasonic Testing Flawed specimens": "UT flawed specimens for sensitivity, resolution, and defect characterization",
      "Dye Penetrant Flawed specimens": "Surface-breaking flaw specimens for PT training and certification",
      "Eddy Current Flawed specimens": "Conductive material specimens with artificial and natural flaws",
      "Radiography Flawed specimens": "Radiographic specimens for image interpretation and flaw sizing",
      "Visual testing Flawed specimens": "VT specimens for visual inspection training and evaluation",
      "Paut and ToFD Flawed specimens": "Advanced PAUT & TOFD flawed specimens for weld inspection",
      "Welded Specimens": "Welded flawed specimens with realistic fabrication defects",
      "Advanced NDT Validation Specimens": "High-precision specimens for POD and method validation"
    };
    return descriptions[selectedCategory] || descriptions.All;
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
    <div className="flawed-specimens-container">
      <div className="page-container-wrapper">
        <div className="page-header">
          <div className="header-content">
            <span className="header-badge">NDT TRAINING & VALIDATION</span>
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

        {selectedCategory !== "All" && (
          <div className="breadcrumb">
            <span className="breadcrumb-link" onClick={() => navigate("/flawed-specimens")}>
              Flawed Specimens
            </span>
            <span className="breadcrumb-separator"><Icons.ArrowRightSm /></span>
            <span className="breadcrumb-current">{selectedCategory}</span>
          </div>
        )}

        <div className="filters-section">
          <div className="filters-header">
             <h2>Browse Specimens</h2>
             <p>Certified flawed specimens for detailed NDT evaluation</p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search flawed specimens..."
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
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
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

        {loading ? (
          <div className="loading">
             <div className="loading-spinner"></div>
             <span>Loading flawed specimens...</span>
          </div>
        ) : (
          <div className="products-container">
            <div className="results-header">
              <span className="results-count">
                Showing {filteredProducts.length} of {products.length} products
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
                    <div className="product-image" onClick={() => handleViewDetails(product)}>
                      <img
                        src={getImageSrc(product)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                      />
                    </div>

                    <div className="product-info">
                      <span className="product-category-badge">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      
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
                      </div>

                      <button className="view-details-btn" onClick={() => handleViewDetails(product)}>
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
                <h3>No Products Found</h3>
                <button className="reset-btn" onClick={clearFilters}>
                  Clear Filters & Show All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlawedSpecimens;