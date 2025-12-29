import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
// import "./css/ProductsPage.css";

function ProductsPage() {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");

  // Extract category from query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cat = queryParams.get('category');
    if (cat) {
      setCategory(cat);
    }
  }, [location]);

  // Fetch products based on type and category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products';
        
        if (type) {
          url = `http://localhost:5000/api/products/type/${type}`;
          if (category) {
            url += `?category=${encodeURIComponent(category)}`;
          }
        }
        
        console.log("Fetching from:", url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products || []);
        } else {
          setError(data.message || "Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, category]);

  // Get page title based on type
  const getPageTitle = () => {
    const titles = {
      calibration_block: "Reference Standards",
      flawed_specimen: "Flawed Specimens",
      validation_block: "Validation Blocks"
    };
    return titles[type] || "Products";
  };

  // Get category title
  const getCategoryTitle = () => {
    return category || "All Products";
  };

  if (loading) {
    return (
      <div className="products-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Header />
      
      <div className="products-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate("/")}>Home</button>
          <span>›</span>
          <button onClick={() => navigate(-1)}>{getPageTitle()}</button>
          {category && (
            <>
              <span>›</span>
              <span className="current">{getCategoryTitle()}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="page-header">
          <h1>{getPageTitle()}</h1>
          {category && <h2>{getCategoryTitle()}</h2>}
          <p className="page-description">
            {type === 'calibration_block' && "High-quality calibration blocks for various NDT methods"}
            {type === 'flawed_specimen' && "Precision-manufactured flawed specimens for training and testing"}
            {type === 'validation_block' && "Certified validation blocks for equipment calibration"}
          </p>
        </div>

        {/* Products Grid */}
        {error ? (
          <div className="error-message">
            <h3>Error loading products</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>No products available in this category yet.</p>
            <button onClick={() => navigate("/")}>Back to Home</button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image_url ? (
                    <img 
                      src={`http://localhost:5000${product.image_url}`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="product-type-badge">
                    {type === 'calibration_block' && 'Reference Standard'}
                    {type === 'flawed_specimen' && 'Flawed Specimen'}
                    {type === 'validation_block' && 'Validation Block'}
                  </div>
                </div>
                
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <div className="product-category">{product.category}</div>
                  {product.subcategory && (
                    <div className="product-subcategory">{product.subcategory}</div>
                  )}
                  
                  <p className="product-description">
                    {product.description?.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description}
                  </p>
                  
                  <div className="product-specs">
                    {product.material && (
                      <div className="spec">
                        <strong>Material:</strong> {product.material}
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="spec">
                        <strong>Dimensions:</strong> {product.dimensions}
                      </div>
                    )}
                    {product.standards && (
                      <div className="spec">
                        <strong>Standards:</strong> {product.standards}
                      </div>
                    )}
                  </div>
                  
                  <div className="product-footer">
                    {product.price && (
                      <div className="product-price">
                        ${parseFloat(product.price).toFixed(2)}
                      </div>
                    )}
                    <button 
                      className="inquiry-btn"
                      onClick={() => {
                        const subject = `Inquiry about ${product.name}`;
                        const body = `Hello,\n\nI am interested in your product: ${product.name}\n\nPlease send me more information.\n\nThank you.`;
                        window.location.href = `mailto:jeevaoff22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      }}
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;