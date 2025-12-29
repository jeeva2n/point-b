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

  // Sync category from route
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

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products?type=flawed_specimen"
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
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

  // Page title
  const getPageTitle = () =>
    selectedCategory !== "All" ? selectedCategory : "Flawed Specimens";

  // Page description
  const getPageDescription = () => {
    const descriptions = {
      All:
        "Certified flawed specimens for NDT training, qualification, and probability of detection studies",
      "Ultrasonic Testing Flawed specimens":
        "UT flawed specimens for sensitivity, resolution, and defect characterization",
      "Dye Penetrant Flawed specimens":
        "Surface-breaking flaw specimens for PT training and certification",
      "Eddy Current Flawed specimens":
        "Conductive material specimens with artificial and natural flaws",
      "Radiography Flawed specimens":
        "Radiographic specimens for image interpretation and flaw sizing",
      "Visual testing Flawed specimens":
        "VT specimens for visual inspection training and evaluation",
      "Paut and ToFD Flawed specimens":
        "Advanced PAUT & TOFD flawed specimens for weld inspection",
      "Welded Specimens":
        "Welded flawed specimens with realistic fabrication defects",
      "Advanced NDT Validation Specimens":
        "High-precision specimens for POD and method validation"
    };
    return descriptions[selectedCategory] || descriptions.All;
  };

  return (
    <div className="flawed-specimens-container">
      <div className="page-container-wrapper">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <span className="header-badge">NDT TRAINING & VALIDATION</span>
            <h1>{getPageTitle()}</h1>
            <p>{getPageDescription()}</p>

            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {filteredProducts.length}
                </span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {categories.length - 1}
                </span>
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
              className="breadcrumb-link"
              onClick={() => navigate("/flawed-specimens")}
            >
              Flawed Specimens
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{selectedCategory}</span>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search flawed specimens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>

          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="loading">Loading flawed specimens...</div>
        ) : (
          <div className="products-container">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="product-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className="product-image"
                      onClick={() => handleViewDetails(product)}
                    >
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        onError={(e) =>
                          (e.target.src = "/images/placeholder.jpg")
                        }
                      />
                    </div>

                    <div className="product-info">
                      <span className="product-category-badge">
                        {product.category}
                      </span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>

                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(product)}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No Products Found</h3>
                <button onClick={clearFilters}>
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
