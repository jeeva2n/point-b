import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductsGrid.css';
import { Helmet } from 'react-helmet-async';

const ProductsGrid = ({ backendUrl = '', typeFilter = null, title = 'Featured NDT Products' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const getGridSeoData = () => {
    const seoTitle = typeFilter 
      ? `${typeFilter.replace(/_/g, ' ')} | NDT Products – DAKS Tools Chennai`
      : `${title} | DAKS Tools – NDT Calibration & Inspection Equipment`;
    
    const seoDescription = typeFilter
      ? `Browse our ${typeFilter.replace(/_/g, ' ')} collection. Premium NDT calibration blocks, flawed specimens, and reference standards manufactured in Chennai, India. ISO 17025 & ASME certified.`
      : `Discover DAKS Tools' featured NDT products including ultrasonic calibration blocks, flawed specimens, and validation standards. Trusted by aerospace, oil & gas, and manufacturing industries across India.`;
    
    return {
      title: seoTitle,
      description: seoDescription,
      keywords: `NDT products Chennai, ${typeFilter || 'calibration blocks'}, ultrasonic testing equipment India, DAKS Tools products, NDT calibration standards, flawed specimens manufacturer`,
      canonicalUrl: typeFilter 
        ? `https://dakstools.com/products/${typeFilter}`
        : 'https://dakstools.com/products',
      ogImage: 'https://dakstools.com/images/products-grid-daks-tools.jpg'
    };
  };

  const seoData = getGridSeoData();

  const gridSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": typeFilter ? `${typeFilter.replace(/_/g, ' ')} NDT Products` : "Featured NDT Products",
        "description": seoData.description,
        "url": seoData.canonicalUrl,
        "provider": {
          "@type": "Organization",
          "name": "DAKS Tools",
          "url": "https://dakstools.com"
        }
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
            "name": "Products",
            "item": "https://dakstools.com/products"
          }
        ].concat(typeFilter ? [{
          "@type": "ListItem",
          "position": 3,
          "name": typeFilter.replace(/_/g, ' '),
          "item": seoData.canonicalUrl
        }] : [])
      },
      {
        "@type": "ItemList",
        "name": typeFilter ? `${typeFilter.replace(/_/g, ' ')} Products` : "Featured NDT Products",
        "description": `DAKS Tools ${typeFilter ? typeFilter.replace(/_/g, ' ') : 'NDT'} products manufactured in Chennai, India.`,
        "numberOfItems": Math.min(products.length, 8),
        "itemListElement": products.slice(0, 8).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "description": product.description || `${product.name} - Premium NDT calibration standard`,
            "sku": product.sku || product.id,
            "image": product.mainImage || product.image_url,
            // UPDATED: Use slug when available, fallback to ID
            "url": `https://dakstools.com/product/${product.slug || product.id}`,
            "brand": {
              "@type": "Brand",
              "name": "DAKS Tools"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "price": product.price || "0.00",
              "priceCurrency": "INR",
              // UPDATED: Use slug when available, fallback to ID
              "url": `https://dakstools.com/product/${product.slug || product.id}`,
              "seller": {
                "@type": "Organization",
                "name": "DAKS Tools"
              }
            }
          }
        }))
      }
    ]
  };

  useEffect(() => {
    fetchProducts();
  }, [typeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${backendUrl}/api/products`;
      if (typeFilter) {
        url = `${backendUrl}/api/products/by-type/${typeFilter}`;
      }
      
      console.log('🔍 Fetching products from:', url); // Debug log
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('🔍 Products response:', data); // Debug log
      
      if (data.success) {
        setProducts(data.products || []);
        console.log('✅ Products loaded:', data.products.length);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('❌ Products fetch error:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    // Simple localStorage cart (integrate with Header cart API later)
    const existingCart = JSON.parse(localStorage.getItem('frontendCart') || '[]');
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('frontendCart', JSON.stringify(existingCart));
    setCart(existingCart);
    
    // Trigger Header cart update
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Products | DAKS Tools</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="products-grid-loading" aria-label="Loading NDT products">
          <div className="loading-skeleton">Loading NDT Products...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error Loading Products | DAKS Tools</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="products-grid-error" role="alert">
          {error}. <button onClick={fetchProducts} aria-label="Retry loading products">Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* SEO - REACT HELMET COMPONENT - UNCHANGED */}
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={seoData.canonicalUrl} />
        
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:image:alt" content={`DAKS Tools ${typeFilter ? typeFilter.replace(/_/g, ' ') : 'NDT'} Products - Chennai`} />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />
        <meta name="twitter:image:alt" content={`DAKS Tools ${title}`} />
        
        <script type="application/ld+json">
          {JSON.stringify(gridSchema)}
        </script>
      </Helmet>

      <section className="products-grid-section" aria-labelledby="products-grid-heading">
        <div className="products-grid-header">
          <h2 id="products-grid-heading" className="products-grid-title">{title}</h2>
          <div className="products-grid-stats">
            {products.length} NDT Products Available from DAKS Tools Chennai
          </div>
        </div>
        
        <div className="products-grid-container">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
              backendUrl={backendUrl}
            />
          ))}
        </div>
        
        {products.length > 8 && (
          <div className="products-grid-footer">
            <button className="view-all-btn" aria-label="View all products">
              View All NDT Products →
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductsGrid;