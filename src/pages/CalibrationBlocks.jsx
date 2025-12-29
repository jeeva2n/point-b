import { useState, useEffect } from "react";
import "./css/CalibrationBlocks.css";
import SimpleProductModal from "./SimpleProductModal";

function CalibrationBlocks() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    "Standard Calibration Block",
    "Custom / Non-Standard Blocks",
    "Application Based Blocks",
    "Specialized Blocks"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("Fetching calibration blocks from /api/products?type=calibration_blocks");
      const response = await fetch("/api/products?type=calibration_blocks");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Calibration blocks response:", data);

      if (data.success) {
        setProducts(data.products || []);
        console.log("Fetched calibration blocks:", data.products);
      } else {
        setProducts([]);
        console.log("No calibration blocks found or API error");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching calibration blocks:", err);
      setProducts([]);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="calibration-blocks-container">
      <div className="hero-banner">
        <h1>Calibration Blocks</h1>
        <p>Browse our complete range of calibration blocks for NDT testing standards</p>
      </div>

      <div className="content-wrapper">
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => {
                  console.log("Selected category:", category);
                  setSelectedCategory(category);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="loading">Loading calibration blocks...</div>
        ) : (
          <div className="products-container">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div 
                      className="product-image"
                      onClick={() => {
                        console.log("Clicking product thumbnail:", product.id);
                        setSelectedProductId(product.id);
                      }}
                    >
                      <img
                        src={`/api${product.image_url}`}
                        alt={product.name}
                        onError={(e) => {
                          console.log("Image failed to load:", product.image_url);
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>

                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <p className="products-category">
                        {product.category} • {product.subcategory}
                      </p>

                      <button
                        className="view-details-btn"
                        onClick={() => {
                          console.log("Clicking view details:", product.id);
                          setSelectedProductId(product.id);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No calibration blocks found matching your criteria.</p>
                {products.length === 0 && (
                  <p className="no-products-hint">
                    No calibration blocks available in the database.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedProductId && (
        <SimpleProductModal
          product={products.find((p) => p.id === selectedProductId)}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}

export default CalibrationBlocks;