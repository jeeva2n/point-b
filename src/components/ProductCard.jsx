import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';
import { slugify } from '../../utils/slugify';

const ProductCard = ({ product, onAddToCart, backendUrl }) => {
  const {
    id,
    name,
    category,
    type,
    price,
    compare_price: comparePrice,
    mainImage,
    image_url: fallbackImage,
    short_description: shortDesc
  } = product;
const productSlug = slugify(name);
const productUrl = `/product/${productSlug}`;
  const image = mainImage || fallbackImage || '/placeholder-ndt.jpg';
  const displayPrice = parseFloat(price) || 0;
  const savings = comparePrice ? ((comparePrice - displayPrice) / comparePrice * 100).toFixed(0) : null;

//   // Generate slug for URL
//   const productSlug = slugify(name);
//  // Just use ID - guaranteed to work
// const productUrl = `/product/${id}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Link to={productUrl} className="product-card" title={name}>
      {/* Rest of your component stays exactly the same */}
      <div className="product-card-image-wrapper">
        <img
          src={`${backendUrl}${image}`}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />
        {savings && (
          <div className="product-card-badge savings-badge">
            {savings}% OFF
          </div>
        )}
        <div className="product-card-type-badge">{type?.toUpperCase()}</div>
      </div>

      <div className="product-card-content">
        <div className="product-card-category">{category}</div>
        <h3 className="product-card-title">{name}</h3>
        {shortDesc && (
          <p className="product-card-short-desc">{shortDesc}</p>
        )}

        <div className="product-card-price-section">
          <div className="product-card-price">
            ₹{displayPrice.toLocaleString('en-IN')}
            {comparePrice && (
              <span className="product-card-compare-price">₹{parseFloat(comparePrice).toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            className="product-card-add-cart"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>

      <div className="product-card-hover-overlay">
        <div className="product-card-hover-content">
          <h4>View Details</h4>
          <p>Materials, Specifications & Features</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;