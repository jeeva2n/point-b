import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetail.css';

// --- Backend Helper ---
// Updated to port 5001 as per your running backend
const getBackendUrl = () => {
  return localStorage.getItem("backend_url") || "http://192.168.1.9:5001";
};

const ProductDetail = () => {
  // --- State & Hooks ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState('description');
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const { productId } = useParams();
  const navigate = useNavigate();
  const backendUrl = getBackendUrl();

  // --- Show Notification ---
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // --- Data Fetching ---
  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/products/${productId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setProduct(data.product);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, productId]);

  const fetchAllProducts = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/products?limit=100`);
      const data = await response.json();

      if (response.ok && data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchProductDetails();
    fetchAllProducts();
  }, [fetchProductDetails, fetchAllProducts]);

  // Update current product index for navigation when products or productId changes
  useEffect(() => {
    if (products.length > 0 && productId) {
      const index = products.findIndex(p => p.id.toString() === productId.toString());
      if (index !== -1) {
        setCurrentProductIndex(index);
      }
    }
  }, [products, productId]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [productId]);

  // --- Navigation Handlers ---
  const goToNextProduct = () => {
    if (currentProductIndex < products.length - 1) {
      const nextProduct = products[currentProductIndex + 1];
      navigate(`/product/${nextProduct.id}`);
    }
  };
  
  const goToPrevProduct = () => {
    if (currentProductIndex > 0) {
      const prevProduct = products[currentProductIndex - 1];
      navigate(`/product/${prevProduct.id}`);
    }
  };

  // --- Cart & Quote Handlers ---
  const addToCart = async (productObj) => {
    try {
      setActionLoading(true);
      const cartId = localStorage.getItem('cartId') || null;
      
      const response = await fetch(`${backendUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          productId: productObj.id,
          quantity: 1,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.cartId) localStorage.setItem('cartId', data.cartId);
        showNotification(`${productObj.name} added to cart!`, 'success');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        showNotification('Failed to add to cart.', 'error');
      }
    } catch (error) {
      showNotification('Error adding to cart.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const addToQuoteRequest = async (productObj) => {
    try {
      setActionLoading(true);
      const quoteId = localStorage.getItem('quoteId') || null;
      
      const response = await fetch(`${backendUrl}/api/quote-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId,
          productId: productObj.id,
          quantity: 1,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.quoteId) localStorage.setItem('quoteId', data.quoteId);
        showNotification(`${productObj.name} added to quote request!`, 'success');
        window.dispatchEvent(new CustomEvent('quoteUpdated'));
      } else {
        showNotification('Failed to add to quote request.', 'error');
      }
    } catch (error) {
      showNotification('Error adding to quote request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Data Helpers ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${backendUrl}${imagePath}`;
  };

  const getProductImages = () => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images.map(img => typeof img === 'string' ? img : img.url);
    }
    if (product.mainImage) return [product.mainImage];
    if (product.image_url) return [product.image_url];
    return [];
  };

  const productImages = getProductImages();

  const getHighlights = () => {
    if (!product) return [];
    const highlights = [];
    if (product.type) highlights.push(product.type.replace(/_/g, ' '));
    if (product.tolerance) highlights.push(`Tolerance: ${product.tolerance}`);
    return highlights.length > 0 ? highlights.slice(0, 3) : ["Premium NDT Reference Standard"];
  };

  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  // --- Accordion Content Renderers ---
  const renderTechSpecs = () => {
    const specs = [
      { label: 'Dimensions', value: product.dimensions },
      { label: 'Tolerance', value: product.tolerance },
      { label: 'Standards', value: product.standards },
      { label: 'SKU', value: product.sku }
    ].filter(s => s.value);

    return (
      <div className="tech-specs-container">
        {specs.map((spec, i) => (
          <div key={i} className="spec-row">
            <span className="spec-label">{spec.label}:</span>
            <span className="spec-value">{spec.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="main-container loading-state">Loading product details...</div>;
  if (!product) return (
    <div className="main-container error-state">
      <h2>Product not found</h2>
      <button onClick={() => navigate(-1)} className="contact-button">Go Back</button>
    </div>
  );

  const accordionItems = [
    { 
      id: 'description', 
      title: 'Description & Benefits', 
      content: <p>{product.description || "No description available."}</p>
    },
    { 
      id: 'technical', 
      title: 'Technical Data', 
      content: renderTechSpecs() 
    }
  ];

  return (
    <div className="main-container">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <div className="carousel-container">
        <div className="carousel-content">
          {/* Image Section */}
          <div className="carousel-left">
            <div className="image-container">
              {productImages.length > 0 ? (
                <img 
                  src={getImageUrl(productImages[currentSlide])} 
                  alt={product.name} 
                  className="machine-image"
                  onError={(e) => e.target.src = "/images/placeholder.jpg"}
                />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              
              {productImages.length > 1 && (
                <>
                  <button className="nav-button prev" onClick={() => setCurrentSlide((currentSlide - 1 + productImages.length) % productImages.length)}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#FF4B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="nav-button next" onClick={() => setCurrentSlide((currentSlide + 1) % productImages.length)}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#FF4B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </>
              )}
            </div>
            
            <div className="product-navigation">
              <button onClick={goToPrevProduct} disabled={currentProductIndex <= 0} className="nav-product-btn prev-product">
                <span>Previous</span>
              </button>
              <div className="product-count">Product {currentProductIndex + 1} of {products.length}</div>
              <button onClick={goToNextProduct} disabled={currentProductIndex >= products.length - 1} className="nav-product-btn next-product">
                <span>Next</span>
              </button>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="carousel-right">
            <span className="products-label">{product.category || "NDT Products"}</span>
            <h1 className="product-title">{product.name}</h1>
            <div className="gradient-bar"></div>
            
            <div className="features-list">
              {getHighlights().map((highlight, index) => (
                <div key={index} className="feature-item">
                  <div className="check-icon"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                  <p>{highlight}</p>
                </div>
              ))}
            </div>
            
            <div className="action-buttons">
              <button className="catalogue-button" onClick={() => navigate(-1)}><span>Catalogue</span></button>
              <button className="cart-button" onClick={() => addToCart(product)} disabled={actionLoading}>
                <span>{actionLoading ? 'Adding...' : 'Add to Quote'}</span>
              </button>
              <button className="quote-button" onClick={() => addToQuoteRequest(product)} disabled={actionLoading}>
                <span>{actionLoading ? 'Requesting...' : 'Request Quote'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="accordion-section">
        {accordionItems.map((item) => (
          <div key={item.id} className="accordion-item">
            <button className="accordion-header" onClick={() => toggleAccordion(item.id)}>
              <span className="accordion-icon">{expandedAccordion === item.id ? '−' : '+'}</span>
              <span className="accordion-title">{item.title}</span>
            </button>
            {expandedAccordion === item.id && <div className="accordion-content">{item.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;