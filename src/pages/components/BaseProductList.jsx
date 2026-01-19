// components/BaseProductList.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config/api';
import styles from "../css/ProductsGrid.module.css"; 

// ... (Icons remain the same) ...
export const Icons = {
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

// Shared Image Helper Function - Now uses API_URL from config
export const getImageSrc = (product, backendUrl = API_URL) => {
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
  return `${backendUrl}${cleanPath}`;
};

// Shared Material Helper Function
export const getMaterialString = (material) => {
  if (!material) return null;
  if (Array.isArray(material)) return material[0];
  if (typeof material === 'object') return JSON.stringify(material);
  return String(material);
};

// Base Product List Component
export const BaseProductList = ({
  productType,
  categories,
  categoryUrlMap,
  pageTitle,
  pageDescriptions,
  badgeText,
  initialCategory = "All",
  config = {}
}) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const productCardsRef = useRef([]);

  // Use API_URL from config, with fallback to passed config or environment
  const BACKEND_URL = config.BACKEND_URL || API_URL;

  // Calculate filteredProducts here (BEFORE any effects)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && 
       product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    fetchProducts();
  }, [productType]);

  // Scroll reveal animation using refs - SIMPLE VERSION
  useEffect(() => {
    const handleScroll = () => {
      productCardsRef.current.forEach((card) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100) {
            card.classList.add(styles.active);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check after a short delay
    setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredProducts]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/products?type=${productType}`
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      }
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${productType}:`, err);
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    navigate(categoryUrlMap["All"]);
  };

  const getCurrentPageTitle = () => {
    if (selectedCategory && selectedCategory !== "All") {
      return selectedCategory;
    }
    return pageTitle;
  };

  const getCurrentPageDescription = () => {
    return pageDescriptions[selectedCategory] || pageDescriptions["All"];
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageWrapper}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <span className={styles.headerBadge}>{badgeText}</span>
            <h1>{getCurrentPageTitle()}</h1>
            <p>{getCurrentPageDescription()}</p>
          </div>
        </div>

        {/* Breadcrumb */}
        {selectedCategory !== "All" && (
          <div className={styles.breadcrumb}>
            <span
              onClick={() => navigate(categoryUrlMap["All"])}
              className={styles.breadcrumbLink}
            >
              {pageTitle}
            </span>
            <span className={styles.breadcrumbSeparator}><Icons.ArrowRightSm /></span>
            <span className={styles.breadcrumbCurrent}>{selectedCategory}</span>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <h2>Browse {pageTitle}</h2>
            <p>Find the perfect solution for your NDT requirements</p>
          </div>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder={`Search ${pageTitle.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm ? (
              <button className={styles.searchClear} onClick={() => setSearchTerm("")}>
                <Icons.Close />
              </button>
            ) : (
              <div className={styles.searchIconWrapper}>
                <Icons.Search />
              </div>
            )}
          </div>

          <div className={styles.categoryFilter}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryBtn} ${
                  selectedCategory === category ? styles.active : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <span>Loading {pageTitle.toLowerCase()}...</span>
          </div>
        ) : (
          <div className={styles.productsContainer}>
            <div className={styles.resultsHeader}>
              <span className={styles.resultsCount}>
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    ref={(el) => (productCardsRef.current[index] = el)}
                    className={`${styles.productCard} ${styles.hardwareAccelerated}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image Section */}
                    <div
                      className={styles.productImage}
                      onClick={() => handleViewDetails(product)}
                    >
                      <img
                        src={getImageSrc(product, BACKEND_URL)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>

                    {/* Info Section */}
                    <div className={styles.productInfo}>
                      <span className={styles.productCategoryBadge}>
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>
                      <p className={styles.productDescription}>
                        {product.description}
                      </p>

                      <div className={styles.productMeta}>
                        {(product.materials || product.material) && (
                          <span className={styles.metaItem}>
                            <span className={styles.metaIcon}><Icons.Box /></span>
                            {getMaterialString(product.materials || product.material)}
                          </span>
                        )}
                        {product.dimensions && (
                          <span className={styles.metaItem}>
                            <span className={styles.metaIcon}><Icons.Ruler /></span>
                            {product.dimensions}
                          </span>
                        )}
                        {product.standards && (
                          <span className={styles.metaItem}>
                            <span className={styles.metaIcon}><Icons.Clipboard /></span>
                            {product.standards}
                          </span>
                        )}
                      </div>

                      <button
                        className={styles.viewDetailsBtn}
                        onClick={() => handleViewDetails(product)}
                      >
                        <span>View Details</span>
                        <span className={styles.btnArrow}><Icons.ArrowRight /></span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <div className={styles.noProductsIcon}><Icons.Empty /></div>
                <h3>
                  No Results Found
                </h3>
                <p>
                  {products.length === 0
                    ? `No ${pageTitle.toLowerCase()} available.`
                    : "No products match your current search criteria."}
                </p>
                {products.length > 0 && (
                  <button className={styles.resetBtn} onClick={clearFilters}>
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
};