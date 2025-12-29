import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetail.css';

// --- Backend Helper ---
const getBackendUrl = () => {
  return localStorage.getItem("backend_url") || "http://localhost:5000";
};

const ProductDetail = () => {
  // --- State & Hooks ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState('description'); 
  
  const { productId } = useParams();
  const navigate = useNavigate();
  const backendUrl = getBackendUrl();

  // --- Data Fetching ---
  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [product?.id]);

  const fetchProductDetails = async () => {
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

  const getMaterials = () => {
    if (!product?.materials) return [];
    if (Array.isArray(product.materials)) return product.materials;
    if (typeof product.materials === 'string') {
      try {
        return JSON.parse(product.materials);
      } catch {
        return [product.materials];
      }
    }
    return [];
  };

  const getFlawsArray = () => {
    if (!product?.flaws) return [];
    if (Array.isArray(product.flaws)) return product.flaws;
    if (typeof product.flaws === 'string') {
      return product.flaws.split(',').map(flaw => flaw.trim());
    }
    return [];
  };

  // --- Carousel Logic ---
  const productImages = getProductImages();
  const totalSlides = productImages.length > 0 ? productImages.length : 1;

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // --- Dynamic Content Generators ---
  const getHighlights = () => {
    if (!product) return [];
    const materials = getMaterials();
    const flaws = getFlawsArray();
    const highlights = [];

    // Create a mixed list of features for the "Checkmark" list
    if (product.type) highlights.push(`Type: ${product.type.replace('_', ' ')}`);
    if (materials.length > 0) highlights.push(`${materials.length} Certified Material${materials.length > 1 ? 's' : ''}`);
    if (flaws.length > 0) highlights.push(`${flaws.length} Artificial Flaw${flaws.length > 1 ? 's' : ''}`);
    if (product.tolerance) highlights.push(`Tolerance: ${product.tolerance}`);
    
    // Fill with generic if empty
    if (highlights.length === 0) highlights.push("High quality NDT reference standard");
    
    return highlights.slice(0, 3); // Limit to 3 items for UI consistency
  };

  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  // --- Render Content Helpers for Accordion ---
  const renderMaterialsContent = () => {
    const materials = getMaterials();
    if (materials.length === 0) return <p>No specific material data available.</p>;
    return (
      <div className="accordion-tags-container">
        {materials.map((mat, idx) => (
          <span key={idx} className="accordion-tag">{mat}</span>
        ))}
      </div>
    );
  };

  const renderTechSpecs = () => {
    const specs = [
      { label: 'Dimensions', value: product.dimensions },
      { label: 'Tolerance', value: product.tolerance },
      { label: 'Weight', value: product.weight },
      { label: 'Standards', value: product.standards },
    ].filter(s => s.value);

    const flaws = getFlawsArray();

    if (specs.length === 0 && flaws.length === 0) return <p>No technical data available.</p>;

    return (
      <div className="tech-specs-container">
        {specs.map((spec, i) => (
          <div key={i} className="spec-row">
            <span className="spec-label">{spec.label}:</span>
            <span className="spec-value">{spec.value}</span>
          </div>
        ))}
        {flaws.length > 0 && (
          <div className="spec-block">
            <span className="spec-label">Included Flaws:</span>
            <ul className="spec-list">
              {flaws.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // --- Accordion Configuration ---
  const accordionItems = product ? [
    { 
      id: 'description', 
      title: 'Description & Benefits', 
      content: <p>{product.description || "No description available."}</p> 
    },
    { 
      id: 'materials', 
      title: 'Materials', 
      content: renderMaterialsContent() 
    },
    { 
      id: 'technical', 
      title: 'Technical Data', 
      content: renderTechSpecs() 
    }
  ] : [];

  // --- Loading / Error States ---
  if (loading) return <div className="main-container loading-state">Loading product details...</div>;
  if (!product) return (
    <div className="main-container error-state">
      <h2>Product not found</h2>
      <button onClick={() => navigate(-1)} className="contact-button">Go Back</button>
    </div>
  );

  return (
    <div className="main-container">
      <div className="carousel-container">
        <div className="carousel-content">
          {/* Left Side: Image Carousel */}
          <div className="carousel-left">
            <div className="image-container">
              {productImages.length > 0 ? (
                <img 
                  src={getImageUrl(productImages[currentSlide])}
                  alt={product.name}
                  className="machine-image"
                  onError={(e) => { e.target.src = "/images/placeholder.jpg"; }}
                />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              
              {productImages.length > 1 && (
                <>
                  <button className="nav-button prev" onClick={prevSlide}>
                    {/* Increased size to 60 */}
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <path d="M15 19l-7-7 7-7" stroke="#FF4B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="nav-button next" onClick={nextSlide}>
                    {/* Increased size to 60 */}
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5l7 7-7 7" stroke="#FF4B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="dots-container">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Right Side: Product Info */}
          <div className="carousel-right">
            <span className="products-label">{product.category || "NDT Products"}</span>
            <h1 className="product-title">
              {product.name}
            </h1>
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
              <button className="catalogue-button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="arrow-icon">
                  <path d="M10 12L6 8l4-4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Catalogue
              </button>
              <button className="contact-button" onClick={() => navigate("/contact")}>
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Accordion */}
      <div className="accordion-section">
        {accordionItems.map((item) => (
          <div key={item.id} className="accordion-item">
            <button 
              className="accordion-header"
              onClick={() => toggleAccordion(item.id)}
            >
              <span className="accordion-icon">
                {expandedAccordion === item.id ? '−' : '+'}
              </span>
              <span className="accordion-title">{item.title}</span>
            </button>
            {expandedAccordion === item.id && (
              <div className="accordion-content">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail ;
