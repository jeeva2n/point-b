import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, ENDPOINTS, getImageUrl, apiCall } from '../config/api';
import './ProductDetail.css';

const ProductDetail = () => {
  // --- State & Hooks ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState('description');
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [popup, setPopup] = useState({ 
    show: false, 
    message: '', 
    type: '', 
    action: null,
    productName: ''
  });
  
  const { productId } = useParams();
  const navigate = useNavigate();

  // --- Show Popup ---
  const showPopup = (message, type = 'success', action = null, productName = '') => {
    setPopup({ 
      show: true, 
      message, 
      type, 
      action,
      productName 
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '', action: null, productName: '' });
    }, 5000);
  };

  // --- Data Fetching ---
  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiCall(ENDPOINTS.PRODUCT_BY_ID(productId), {
        method: 'GET',
      });

      if (result.success && result.data?.success) {
        setProduct(result.data.product);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchAllProducts = useCallback(async () => {
    try {
      const result = await apiCall(`${ENDPOINTS.PRODUCTS}?limit=100`, {
        method: 'GET',
      });

      if (result.success && result.data?.success) {
        setProducts(result.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProductDetails();
    fetchAllProducts();
  }, [fetchProductDetails, fetchAllProducts]);

  // Update current product index for navigation
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
      
      const result = await apiCall(ENDPOINTS.CART, {
        method: 'POST',
        body: JSON.stringify({
          cartId,
          productId: productObj.id,
          quantity: 1,
        }),
      });
      
      if (result.success && result.data?.success) {
        if (result.data.cartId) localStorage.setItem('cartId', result.data.cartId);
        
        // Show popup with option to go to cart
        showPopup(
          `${productObj.name} added to cart!`, 
          'cart', 
          () => navigate('/cart'),
          productObj.name
        );
        
        // Trigger cart update event for header
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        showPopup('Failed to add to cart.', 'error');
      }
    } catch (error) {
      showPopup('Error adding to cart.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const addToQuoteRequest = async (productObj) => {
    try {
      setActionLoading(true);
      const quoteId = localStorage.getItem('quoteId') || null;
      
      const result = await apiCall(ENDPOINTS.QUOTES, {
        method: 'POST',
        body: JSON.stringify({
          quoteId,
          productId: productObj.id,
          quantity: 1,
        }),
      });
      
      if (result.success && result.data?.success) {
        if (result.data.quoteId) localStorage.setItem('quoteId', result.data.quoteId);
        
        // Show popup
        showPopup(`${productObj.name} added to quote request!`, 'quote');
        
        // Trigger quote update event for header
        window.dispatchEvent(new CustomEvent('quoteUpdated'));
      } else {
        showPopup('Failed to add to quote request.', 'error');
      }
    } catch (error) {
      showPopup('Error adding to quote request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle popup close
  const handlePopupClose = () => {
    setPopup({ show: false, message: '', type: '', action: null, productName: '' });
  };

  // --- Data Helpers ---
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

  // --- Render ---
  if (loading) {
    return <div className="main-container loading-state">Loading product details...</div>;
  }
  
  if (!product) {
    return (
      <div className="main-container error-state">
        <h2>Product not found</h2>
        <button onClick={() => navigate(-1)} className="contact-button">Go Back</button>
      </div>
    );
  }

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
      {/* Popup Notification */}
      {popup.show && (
        <div className={`popup-notification ${popup.type}`}>
          <div className="popup-content">
            <div className="popup-message">
              <span className="popup-icon">
                {popup.type === 'cart' && '🛒'}
                {popup.type === 'quote' && '📋'}
                {popup.type === 'error' && '❌'}
                {popup.type === 'success' && '✅'}
              </span>
              {popup.message}
            </div>
            
            {popup.type === 'cart' && popup.action && (
              <div className="popup-actions">
                <button 
                  className="popup-action-button"
                  onClick={popup.action}
                >
                  Go to Cart
                </button>
                <button 
                  className="popup-close-button"
                  onClick={handlePopupClose}
                >
                  ×
                </button>
              </div>
            )}
            
            {popup.type !== 'cart' && (
              <button 
                className="popup-close-button"
                onClick={handlePopupClose}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

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
                  <button 
                    className="nav-button prev" 
                    onClick={() => setCurrentSlide((currentSlide - 1 + productImages.length) % productImages.length)}
                  >
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M15 19l-7-7 7-7" stroke="#FF4B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    className="nav-button next" 
                    onClick={() => setCurrentSlide((currentSlide + 1) % productImages.length)}
                  >
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5l7 7-7 7" stroke="#FF4B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}
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
                  <div className="check-icon">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p>{highlight}</p>
                </div>
              ))}
            </div>
            
            <div className="action-buttons">
              <button className="catalogue-button" onClick={() => navigate(-1)}>
                <span>Catalogue</span>
              </button>
              <button 
                className="cart-button" 
                onClick={() => addToCart(product)} 
                disabled={actionLoading}
              >
                <span>{actionLoading ? 'Adding...' : 'Add to Cart'}</span>
              </button>
              <button 
                className="quote-button" 
                onClick={() => addToQuoteRequest(product)} 
                disabled={actionLoading}
              >
                <span>{actionLoading ? 'Requesting...' : 'Add to Quote'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Section */}
      <div className="accordion-section">
        {accordionItems.map((item) => (
          <div key={item.id} className="accordion-item">
            <button className="accordion-header" onClick={() => toggleAccordion(item.id)}>
              <span className="accordion-icon">{expandedAccordion === item.id ? '−' : '+'}</span>
              <span className="accordion-title">{item.title}</span>
            </button>
            {expandedAccordion === item.id && (
              <div className="accordion-content">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;