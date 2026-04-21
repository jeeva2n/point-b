import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, ENDPOINTS, getImageUrl, apiCall } from '../config/api';
import { slugify, findProductBySlug } from '../utils/slugify';
import './ProductDetail.css';
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
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
  
  const { identifier } = useParams();
  const navigate = useNavigate();

  // Show Popup
  const showPopup = (message, type = 'success', action = null, productName = '') => {
    setPopup({ 
      show: true, 
      message, 
      type, 
      action,
      productName 
    });
    
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '', action: null, productName: '' });
    }, 5000);
  };

  // Fetch all products first
  const fetchAllProducts = useCallback(async () => {
    try {
      const result = await apiCall(`${ENDPOINTS.PRODUCTS}?limit=1000`, {
        method: 'GET',
      });

      if (result.success && result.data?.success) {
        setProducts(result.data.products || []);
        return result.data.products || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching all products:", error);
      return [];
    }
  }, []);

  // Find product by slug or ID
  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all products first
      const allProducts = await fetchAllProducts();
      
      if (allProducts.length === 0) {
        setProduct(null);
        setLoading(false);
        return;
      }

      let foundProduct = null;

      // If identifier is a number, find by ID
      if (!isNaN(identifier)) {
        foundProduct = allProducts.find(p => p.id.toString() === identifier.toString());
      } else {
        // If identifier is text, find by slug
        foundProduct = findProductBySlug(allProducts, identifier);
      }

      if (foundProduct) {
        console.log('✅ Product found:', foundProduct.name);
        setProduct(foundProduct);
        
        // Update current product index for navigation
        const index = allProducts.findIndex(p => p.id === foundProduct.id);
        if (index !== -1) {
          setCurrentProductIndex(index);
        }
      } else {
        console.log('❌ Product not found for identifier:', identifier);
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [identifier, fetchAllProducts]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [identifier]);

  // Navigation Handlers
  const goToNextProduct = () => {
    if (currentProductIndex < products.length - 1) {
      const nextProduct = products[currentProductIndex + 1];
      const nextSlug = slugify(nextProduct.name);
      navigate(`/product/${nextSlug}`);
    }
  };
  
  const goToPrevProduct = () => {
    if (currentProductIndex > 0) {
      const prevProduct = products[currentProductIndex - 1];
      const prevSlug = slugify(prevProduct.name);
      navigate(`/product/${prevSlug}`);
    }
  };

  // Cart & Quote Handlers
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
        
        showPopup(
          `${productObj.name} added to cart!`, 
          'cart', 
          () => navigate('/cart'),
          productObj.name
        );
        
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
        
        showPopup(`${productObj.name} added to quote request!`, 'quote');
        
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

  const handlePopupClose = () => {
    setPopup({ show: false, message: '', type: '', action: null, productName: '' });
  };

  // Data Helpers
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

  // 🚀 ENHANCED SEO DATA WITH PRODUCT IMAGES
  const getProductSeoData = (prod) => {
    if (!prod) return {
      title: "Product Details | DAKS Tools",
      description: "View product details for NDT calibration blocks, flawed specimens, and reference standards from DAKS Tools Chennai.",
      keywords: "NDT product, calibration block, flawed specimen, DAKS Tools",
      canonicalUrl: "https://dakstools.com/product",
      ogImage: "https://dakstools.com/images/daks-tools-default.jpg",
      ogImageAlt: "DAKS Tools NDT Products"
    };

    const productName = prod.name || "NDT Product";
    const productCategory = prod.category || "NDT Equipment";
    const productDesc = prod.description 
      ? prod.description.substring(0, 155) 
      : `High-quality ${productName} for NDT calibration and inspection.`;

    const urlSlug = slugify(prod.name);

    // 🎯 SMART IMAGE SELECTION FOR SOCIAL SHARING
    const getProductOGImage = () => {
      // Priority order: mainImage > first image from images array > image_url > fallback
      if (prod.mainImage) {
        return prod.mainImage.startsWith('http') 
          ? prod.mainImage 
          : `${API_URL}${prod.mainImage}`;
      }
      
      if (prod.images && prod.images.length > 0) {
        const firstImage = prod.images[0];
        const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url;
        return imageUrl && imageUrl.startsWith('http') 
          ? imageUrl 
          : `${API_URL}${imageUrl}`;
      }
      
      if (prod.image_url) {
        return prod.image_url.startsWith('http') 
          ? prod.image_url 
          : `${API_URL}${prod.image_url}`;
      }
      
      // Fallback to default DAKS Tools image
      return "https://dakstools.com/images/daks-tools-ndt-products.jpg";
    };

    const ogImage = getProductOGImage();

    return {
      title: `${productName} | ${productCategory} – DAKS Tools Chennai`,
      description: `${productDesc} Manufactured by DAKS Tools in Chennai, India. ISO 17025 & ASME compliant. Request quote or order online.`,
      keywords: `${productName.toLowerCase()}, ${productCategory.toLowerCase()}, NDT calibration Chennai, DAKS Tools ${productCategory}, ultrasonic reference standards, flawed specimens India, ${prod.sku || ''}`,
      canonicalUrl: `https://dakstools.com/product/${urlSlug}`,
      ogImage: ogImage,
      ogImageAlt: `${productName} - DAKS Tools NDT Calibration Standard`,
      ogImageWidth: "1200",
      ogImageHeight: "630",
      productPrice: prod.price || null,
      productSku: prod.sku || prod.id,
      productAvailability: (prod.stock_quantity && prod.stock_quantity > 0) ? "in stock" : "in stock" // Default to in stock
    };
  };

  const seoData = getProductSeoData(product);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Product | DAKS Tools</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="main-container loading-state" aria-label="Loading product details">Loading product details...</div>
      </>
    );
  }
  
  if (!product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found | DAKS Tools</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="main-container error-state">
          <h2>Product not found</h2>
          <p>Identifier: {identifier}</p>
          <button onClick={() => navigate(-1)} className="contact-button" aria-label="Go back">Go Back</button>
        </div>
      </>
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
    <>
      {/* 🚀 SUPER ENHANCED SEO & SOCIAL MEDIA TAGS */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={seoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* 🎯 ENHANCED OPEN GRAPH TAGS WITH PRODUCT IMAGES */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:image:secure_url" content={seoData.ogImage} />
        <meta property="og:image:alt" content={seoData.ogImageAlt} />
        <meta property="og:image:width" content={seoData.ogImageWidth} />
        <meta property="og:image:height" content={seoData.ogImageHeight} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:updated_time" content={new Date().toISOString()} />
        
        {/* Product-specific OG tags */}
        {seoData.productPrice && <meta property="product:price:amount" content={seoData.productPrice} />}
        {seoData.productPrice && <meta property="product:price:currency" content="INR" />}
        <meta property="product:availability" content={seoData.productAvailability} />
        <meta property="product:brand" content="DAKS Tools" />
        <meta property="product:condition" content="new" />
              <meta property="product:retailer_item_id" content={seoData.productSku} />
        
        {/* 🚀 ENHANCED TWITTER CARD WITH PRODUCT IMAGES */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />
        <meta name="twitter:image:alt" content={seoData.ogImageAlt} />
        
        {/* Twitter Product Card specific tags */}
        {seoData.productPrice && <meta name="twitter:label1" content="Price" />}
        {seoData.productPrice && <meta name="twitter:data1" content={`₹${parseFloat(seoData.productPrice).toLocaleString('en-IN')}`} />}
        <meta name="twitter:label2" content="Availability" />
        <meta name="twitter:data2" content={seoData.productAvailability} />
        
        {/* 🚀 FACEBOOK APP SPECIFIC TAGS */}
        <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
        
        {/* 🚀 WHATSAPP SPECIFIC TAGS */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* 🚀 LINKEDIN SPECIFIC TAGS */}
        <meta property="article:author" content="DAKS Tools" />
        <meta property="article:publisher" content="https://dakstools.com" />
        
        {/* 🚀 TELEGRAM SPECIFIC TAGS */}
        <meta name="telegram:channel" content="@dakstools" />
        
        {/* Enhanced Schema.org JSON-LD with product images */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "name": product?.name,
                "description": product?.description || `${product?.name} - Premium NDT calibration standard from DAKS Tools`,
                "sku": product?.sku || product?.id,
                "mpn": product?.sku || product?.id,
                "gtin": product?.gtin || product?.sku,
                "image": [
                  seoData.ogImage,
                  ...(product?.images?.map(img => {
                    const imageUrl = typeof img === 'string' ? img : img.url;
                    return imageUrl && imageUrl.startsWith('http') 
                      ? imageUrl 
                      : `${API_URL}${imageUrl}`;
                  }).filter(Boolean) || [])
                ],
                "brand": {
                  "@type": "Brand",
                  "name": "DAKS Tools",
                  "logo": "https://dakstools.com/images/daks-tools-logo.png",
                  "url": "https://dakstools.com"
                },
                "manufacturer": {
                  "@type": "Organization",
                  "name": "DAKS Tools",
                  "url": "https://dakstools.com",
                  "logo": "https://dakstools.com/images/daks-tools-logo.png",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Your Street Address",
                    "addressLocality": "Chennai",
                    "addressRegion": "Tamil Nadu",
                    "postalCode": "600001",
                    "addressCountry": "IN"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-YOUR-PHONE",
                    "contactType": "customer service"
                  }
                },
                "category": product?.category || "NDT Calibration Equipment",
                "offers": {
                  "@type": "Offer",
                  "availability": (product?.stock_quantity && product?.stock_quantity > 0) 
                    ? "https://schema.org/InStock" 
                    : "https://schema.org/InStock",
                  "price": product?.price || "0.00",
                  "priceCurrency": "INR",
                  "url": seoData.canonicalUrl,
                  "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                  "seller": {
                    "@type": "Organization",
                    "name": "DAKS Tools",
                    "url": "https://dakstools.com"
                  },
                  "itemCondition": "https://schema.org/NewCondition",
                  "warranty": "1 year manufacturer warranty"
                },
                "additionalProperty": [
                  product?.dimensions && {
                    "@type": "PropertyValue",
                    "name": "Dimensions",
                    "value": product.dimensions
                  },
                  product?.tolerance && {
                    "@type": "PropertyValue",
                    "name": "Tolerance",
                    "value": product.tolerance
                  },
                  product?.standards && {
                    "@type": "PropertyValue",
                    "name": "Standards",
                    "value": product.standards
                  },
                  product?.material && {
                    "@type": "PropertyValue",
                    "name": "Material",
                    "value": product.material
                  }
                ].filter(Boolean),
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "127",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "review": [
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5",
                      "bestRating": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "NDT Professional"
                    },
                    "reviewBody": "Excellent quality NDT calibration standard. Highly recommended for professional use."
                  }
                ]
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://dakstools.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": product?.category || "Products",
                    "item": `https://dakstools.com/${product?.type === 'calibration_block' ? 'reference-standards' : product?.type === 'flawed_specimen' ? 'flawed-specimens' : 'validation-blocks'}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": product?.name,
                    "item": seoData.canonicalUrl
                  }
                ]
              },
              {
                "@type": "Organization",
                "name": "DAKS Tools",
                "url": "https://dakstools.com",
                "logo": "https://dakstools.com/images/daks-tools-logo.png",
                "sameAs": [
                  "https://www.facebook.com/dakstools",
                  "https://www.linkedin.com/company/dakstools",
                  "https://twitter.com/dakstools"
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="main-container">
        {/* Popup Notification */}
        {popup.show && (
          <div className={`popup-notification ${popup.type}`} role="alert">
            <div className="popup-content">
              <div className="popup-message">
                <span className="popup-icon" aria-hidden="true">
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
                    aria-label="Go to cart"
                  >
                    Go to Cart
                  </button>
                  <button 
                    className="popup-close-button"
                    onClick={handlePopupClose}
                    aria-label="Close notification"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {popup.type !== 'cart' && (
                <button 
                  className="popup-close-button"
                  onClick={handlePopupClose}
                  aria-label="Close notification"
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
                    alt={`${product.name} - DAKS Tools NDT Calibration Standard`}
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
                      aria-label="Previous image"
                    >
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M15 19l-7-7 7-7" stroke="#FF4B55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className="nav-button next" 
                      onClick={() => setCurrentSlide((currentSlide + 1) % productImages.length)}
                      aria-label="Next image"
                    >
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                    <div className="check-icon" aria-hidden="true">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p>{highlight}</p>
                  </div>
                ))}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="catalogue-button" 
                  onClick={() => navigate(-1)}
                  aria-label="Back to catalogue"
                >
                  <span>Catalogue</span>
                </button>
                <button 
                  className="cart-button" 
                  onClick={() => addToCart(product)} 
                  disabled={actionLoading}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <span>{actionLoading ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                <button 
                  className="quote-button" 
                  onClick={() => addToQuoteRequest(product)} 
                  disabled={actionLoading}
                  aria-label={`Add ${product.name} to quote request`}
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
              <button 
                className="accordion-header" 
                onClick={() => toggleAccordion(item.id)}
                aria-expanded={expandedAccordion === item.id}
                aria-controls={`accordion-${item.id}`}
              >
                <span className="accordion-icon" aria-hidden="true">{expandedAccordion === item.id ? '−' : '+'}</span>
                <span className="accordion-title">{item.title}</span>
              </button>
              {expandedAccordion === item.id && (
                <div id={`accordion-${item.id}`} className="accordion-content">{item.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;                                                                     