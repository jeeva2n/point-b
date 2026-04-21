import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getImageUrl } from './../config/api';
import './css/Cart.css';
import { Helmet } from 'react-helmet-async';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [quoteRequest, setQuoteRequest] = useState({ items: [] });
  const [activeTab, setActiveTab] = useState('cart');
  const [loading, setLoading] = useState(true);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const navigate = useNavigate();
  const WEB3_ACCESS_KEY = "73a5d128-f5b6-4b66-80c6-bdac56b080c8";

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const cartSeoData = {
    title: "Shopping Cart | DAKS Tools – NDT Equipment & Quote Requests",
    description: "Review your DAKS Tools shopping cart for NDT calibration blocks, flawed specimens, and inspection equipment. Request quotes or checkout securely for your NDT supplies.",
    canonicalUrl: "https://dakstools.com/cart",
    ogImage: "https://dakstools.com/images/cart-daks-tools.jpg"
  };

  const cartSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "DAKS Tools Shopping Cart & Quote Requests",
        "description": cartSeoData.description,
        "url": cartSeoData.canonicalUrl,
        "publisher": {
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
            "name": "Cart",
            "item": "https://dakstools.com/cart"
          }
        ]
      }
    ]
  };

  // Handle image error - set to placeholder
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  // Get safe image URL
  const getSafeImageUrl = (item) => {
    if (imageErrors[item.id || item.product_id]) {
      return '/images/placeholder.jpg';
    }
    
    const imageUrl = item.image_url || item.mainImage || item.imageUrl;
    
    // Debug log
    console.log('Image URL for', item.product_name, ':', imageUrl);
    
    if (!imageUrl) {
      return '/images/placeholder.jpg';
    }
    
    return getImageUrl(imageUrl);
  };

  const loadCart = useCallback(async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      setCart({ items: [] });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/${cartId}`);
      const data = await response.json();
      
      // DEBUG: Log the full response
      console.log('=== CART API RESPONSE ===');
      console.log('Full response:', JSON.stringify(data, null, 2));
      if (data.cart?.items) {
        data.cart.items.forEach((item, idx) => {
          console.log(`Item ${idx}:`, {
            name: item.product_name,
            image_url: item.image_url,
            product_id: item.product_id
          });
        });
      }
      
      if (data.success && data.cart) {
        setCart(data.cart);
        setImageErrors({}); // Reset image errors when cart loads
      } else {
        setCart({ items: [] });
        if (data.message === 'Cart not found') {
          localStorage.removeItem('cartId');
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart({ items: [] });
    }
  }, []);

  const loadQuoteRequest = useCallback(async () => {
    const quoteId = localStorage.getItem('quoteId');
    if (!quoteId) {
      setQuoteRequest({ items: [] });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/quote-requests/${quoteId}`);
      const data = await response.json();
      
      // DEBUG: Log the full response
      console.log('=== QUOTE API RESPONSE ===');
      console.log('Full response:', JSON.stringify(data, null, 2));
      
      if (data.success && data.quoteRequest) {
        setQuoteRequest(data.quoteRequest);
        setImageErrors({}); // Reset image errors
      } else {
        setQuoteRequest({ items: [] });
        if (data.message === 'Quote request not found') {
          localStorage.removeItem('quoteId');
        }
      }
    } catch (error) {
      console.error('Error loading quote request:', error);
      setQuoteRequest({ items: [] });
    }
  }, []);

  const fetchOrderHistory = useCallback(async (token) => {
    try {
      setOrderHistoryLoading(true);
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderHistory(data.orders || []);
      } else {
        console.error('Failed to fetch order history:', data.message);
        if (['Authentication required', 'Invalid token', 'Token expired'].includes(data.message)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setOrderHistoryLoading(false);
    }
  }, []);

  const checkLoginStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    
    if (token && userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        setUser(userData);
        setIsLoggedIn(true);
        setFormData(prev => ({
          ...prev,
          name: userData.full_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          company: userData.company || ''
        }));
        await fetchOrderHistory(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setOrderHistory([]);
    }
  }, [fetchOrderHistory]);

  const loadCartAndQuote = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadCart(), loadQuoteRequest()]);
    setLoading(false);
  }, [loadCart, loadQuoteRequest]);

  const handleStorageChange = useCallback((e) => {
    if (e.key === 'token' || e.key === 'user') checkLoginStatus();
    if (e.key === 'cartId') loadCart();
    if (e.key === 'quoteId') loadQuoteRequest();
  }, [checkLoginStatus, loadCart, loadQuoteRequest]);

  useEffect(() => {
    const init = async () => {
      await checkLoginStatus();
      await loadCartAndQuote();
    };
    init();
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkLoginStatus, loadCartAndQuote, handleStorageChange]);

  const removeFromCart = async (itemId) => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/cart/${cartId}/items/${itemId}`, { method: 'DELETE' });
      const data = await response.json();
      
      if (data.success) {
        data.cart ? setCart(data.cart) : await loadCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        alert('Failed to remove item from cart');
        await loadCart();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromQuote = async (itemId) => {
    const quoteId = localStorage.getItem('quoteId');
    if (!quoteId) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/quote-requests/${quoteId}/items/${itemId}`, { method: 'DELETE' });
      const data = await response.json();
      
      if (data.success) {
        data.quoteRequest ? setQuoteRequest(data.quoteRequest) : await loadQuoteRequest();
        window.dispatchEvent(new CustomEvent('quoteUpdated'));
      } else {
        alert('Failed to remove item from quote request');
        await loadQuoteRequest();
      }
    } catch (error) {
      console.error('Error removing item from quote:', error);
      await loadQuoteRequest();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity, type = 'cart') => {
    if (newQuantity < 1) return;
    
    const id = type === 'cart' ? localStorage.getItem('cartId') : localStorage.getItem('quoteId');
    if (!id) return;

    try {
      setLoading(true);
      const endpoint = type === 'cart' 
        ? `${API_URL}/api/cart/${id}/items/${itemId}` 
        : `${API_URL}/api/quote-requests/${id}/items/${itemId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (type === 'cart') {
          data.cart ? setCart(data.cart) : await loadCart();
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        } else {
          data.quoteRequest ? setQuoteRequest(data.quoteRequest) : await loadQuoteRequest();
          window.dispatchEvent(new CustomEvent('quoteUpdated'));
        }
      } else {
        alert(`Failed to update quantity. ${data.message || "Please try again."}`);
        type === 'cart' ? await loadCart() : await loadQuoteRequest();
      }
    } catch (error) {
      console.error(`Error updating ${type} quantity:`, error);
      type === 'cart' ? await loadCart() : await loadQuoteRequest();
    } finally {
      setLoading(false);
    }
  };

  const continueShopping = () => navigate('/flawed-specimens');
  
  const handleLoginRedirect = () => {
    localStorage.setItem('loginRedirect', '/cart');
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setOrderHistory([]);
    setCheckoutStep('cart');
    alert('You have been logged out successfully');
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      if (window.confirm("Please log in to proceed. Would you like to log in now?")) {
        handleLoginRedirect();
      }
      return;
    }
    setCheckoutStep('form');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
    }, 0);
  };

  const processOrder = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please log in to place an order.');
      handleLoginRedirect();
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }
    
    try {
      setLoading(true);
      const cartId = localStorage.getItem('cartId');
      
      if (!cartId || cart.items.length === 0) {
        alert('Your cart is empty!');
        setLoading(false);
        return;
      }

      const subtotal = calculateTotal(cart.items);
      const tax = subtotal * 0.18;
      const shipping_cost = 200;
      const total_amount = subtotal + tax + shipping_cost;

      const orderResponse = await fetch(`${API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customerDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            notes: formData.message
          },
          items: cart.items.map(item => ({
            productId: item.product_id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.image_url,
            sku: item.sku
          })),
          paymentMethod: 'COD',
          notes: formData.message
        }),
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const orderNumber = orderData.orderNumber;
      const totalAmount = orderData.totalAmount || total_amount.toFixed(2);

      // Send email
      const mailFormData = new FormData();
      mailFormData.append("access_key", WEB3_ACCESS_KEY);
      mailFormData.append("subject", `Order Confirmation #${orderNumber} - DAKS NDT Services`);
      mailFormData.append("name", formData.name);
      mailFormData.append("email", formData.email);
      mailFormData.append("message", `Order #${orderNumber}\nTotal: ₹${totalAmount}\n\nItems:\n${cart.items.map(item => `- ${item.product_name} x${item.quantity}`).join('\n')}`);

      await fetch("https://api.web3forms.com/submit", { method: "POST", body: mailFormData });

      localStorage.removeItem('cartId');
      setCart({ items: [] });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setCheckoutStep('confirmation');
      
      if (isLoggedIn) await fetchOrderHistory(localStorage.getItem('token'));
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert(`Error processing your order: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const processQuoteRequest = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please log in to submit a quote request.');
      handleLoginRedirect();
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      const quoteId = localStorage.getItem('quoteId');
      
      if (!quoteId || quoteRequest.items.length === 0) {
        alert('Your quote request is empty!');
        setLoading(false);
        return;
      }

      const quoteResponse = await fetch(`${API_URL}/api/quote-requests/${quoteId}/finalize`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          message: formData.message,
          status: 'submitted'
        }),
      });
      
      const quoteData = await quoteResponse.json();
      
      if (!quoteData.success) {
        throw new Error(quoteData.message || 'Failed to finalize quote request');
      }

      localStorage.removeItem('quoteId');
      setQuoteRequest({ items: [] });
      window.dispatchEvent(new CustomEvent('quoteUpdated'));
      await fetchOrderHistory(localStorage.getItem('token'));
      setCheckoutStep('confirmation');
      
    } catch (error) {
      console.error('Error processing quote request:', error);
      alert(`Error: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const getItemCount = () => {
    const cartCount = cart?.items?.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0) || 0;
    const quoteCount = quoteRequest?.items?.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0) || 0;
    return { cartCount, quoteCount };
  };

  const { cartCount, quoteCount } = getItemCount();

  // Loading state
  if (loading && checkoutStep === 'cart') {
    return (
      <>
        <Helmet>
          <title>Loading Cart | DAKS Tools</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="cart-container loading">
          <div className="loading-spinner" aria-label="Loading cart"></div>
          <p>Loading your DAKS Tools cart...</p>
        </div>
      </>
    );
  }

  // Confirmation screen
  if (checkoutStep === 'confirmation') {
    return (
      <>
        <Helmet>
          <title>Order Confirmed | DAKS Tools</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="cart-container">
          <div className="confirmation-message" role="alert">
            <div className="confirmation-icon" aria-hidden="true">✓</div>
            <h2>Thank You for Choosing DAKS Tools!</h2>
            <p>{activeTab === 'cart' ? 'Your NDT equipment order has been received successfully.' : 'Your quote request has been submitted successfully.'}</p>
            <p>Our team in Chennai will contact you shortly.</p>
            <div className="confirmation-actions">
              <button className="continue-shopping-btn" onClick={continueShopping} aria-label="Continue shopping for NDT products">Continue Shopping</button>
              <button className="view-orders-btn" onClick={() => navigate('/account')} aria-label="View your orders">View My Orders</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Order history section
  const renderOrderHistory = () => {
    if (!isLoggedIn) return null;
    
    if (orderHistoryLoading) {
      return (
        <div className="order-history-section loading">
          <h3>Recent NDT Equipment Orders</h3>
          <div className="loading-indicator">Loading...</div>
        </div>
      );
    }
    
    if (orderHistory.length === 0) {
      return (
        <div className="order-history-section empty">
          <h3>Recent Orders</h3>
          <p className="empty-history">No NDT equipment orders yet.</p>
        </div>
      );
    }
    
    return (
      <div className="order-history-section">
        <h3>Recent NDT Orders</h3>
        <div className="recent-orders">
          {orderHistory.slice(0, 3).map((order, index) => (
            <div key={index} className="recent-order-item">
              <div className="order-date">{new Date(order.created_at).toLocaleDateString()}</div>
              <div className="order-status">Status: <span className={`status-${order.status || 'pending'}`}>{order.status || 'Pending'}</span></div>
              <button onClick={() => navigate(`/order/${order.id}`)} className="view-order-btn" aria-label={`View order ${order.order_number}`}>View</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Checkout form
  if (checkoutStep === 'form') {
    if (!isLoggedIn) {
      return (
        <>
          <Helmet>
            <title>Login Required | DAKS Tools</title>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <div className="cart-container">
            <div className="login-required">
              <h2>Login Required</h2>
              <p>You need to be logged in to continue with your NDT equipment order.</p>
              <button className="login-btn" onClick={handleLoginRedirect} aria-label="Log in to your account">Log In</button>
              <button className="back-btn" onClick={() => setCheckoutStep('cart')} aria-label="Go back">Back</button>
            </div>
          </div>
        </>
      );
    }
    
    return (
      <>
        <Helmet>
          <title>Checkout | DAKS Tools – NDT Equipment Order</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="cart-container">
          <h2>{activeTab === 'cart' ? 'Complete Your NDT Equipment Order' : 'Submit Quote Request'}</h2>
          
          <form className="checkoutForm" onSubmit={activeTab === 'cart' ? processOrder : processQuoteRequest}>
            <div className="checkoutSection">
              <h3 className="sectionTitle">Contact Information</h3>
              <div className="formRow">
                <div className="formField">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required aria-required="true" />
                </div>
                <div className="formField">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required aria-required="true" />
                </div>
              </div>
              <div className="formRow">
                <div className="formField">
                  <label htmlFor="phone">Phone *</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required aria-required="true" />
                </div>
                <div className="formField">
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="checkoutSection">
              <h3 className="sectionTitle">Shipping Address</h3>
              <div className="formField">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} />
              </div>
              <div className="formRow">
                <div className="formField">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
                <div className="formField">
                  <label htmlFor="state">State</label>
                  <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange} />
                </div>
                <div className="formField">
                  <label htmlFor="zip">PIN</label>
                  <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="checkoutSection">
              <h3 className="sectionTitle">Notes</h3>
              <div className="formField">
                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows="3" placeholder="Any special requirements for your NDT order..." />
              </div>
            </div>

            <div className="formActions">
              <button type="button" className="secondaryBtn" onClick={() => setCheckoutStep('cart')} aria-label="Go back to cart">Back</button>
              <button type="submit" className="primaryBtn" disabled={loading} aria-label={activeTab === 'cart' ? 'Place order' : 'Submit quote'}>
                {loading ? 'Processing...' : activeTab === 'cart' ? 'Place Order' : 'Submit Quote'}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // Main cart view
  return (
    <>
      {/* ==========================================
          SEO - REACT HELMET COMPONENT
      ========================================== */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{cartSeoData.title}</title>
        <meta name="description" content={cartSeoData.description} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={cartSeoData.canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={cartSeoData.canonicalUrl} />
        <meta property="og:title" content="Shopping Cart – DAKS Tools NDT Equipment" />
        <meta property="og:description" content={cartSeoData.description} />
        <meta property="og:image" content={cartSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools Shopping Cart" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Shopping Cart – DAKS Tools" />
        <meta name="twitter:description" content={cartSeoData.description} />
        <meta name="twitter:image" content={cartSeoData.ogImage} />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(cartSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="cart-container">
        <div className="user-section">
          {isLoggedIn ? (
            <div className="logged-in-user">
              <span>Welcome, {user?.full_name || user?.email}</span>
              <button className="logout-btn" onClick={handleLogout} aria-label="Logout">Logout</button>
            </div>
          ) : (
            <div className="guest-user">
              <p>Please <button className="login-link" onClick={handleLoginRedirect} aria-label="Login to your account">login</button> to save orders.</p>
            </div>
          )}
        </div>
        
        {isLoggedIn && renderOrderHistory()}
        
        <div className="cart-tabs" role="tablist">
          <button 
            className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`} 
            onClick={() => setActiveTab('cart')}
            role="tab"
            aria-selected={activeTab === 'cart'}
            aria-label={`Shopping Cart (${cartCount} items)`}
          >
            Shopping Cart ({cartCount})
          </button>
          <button 
            className={`tab-button ${activeTab === 'quote' ? 'active' : ''}`} 
            onClick={() => setActiveTab('quote')}
            role="tab"
            aria-selected={activeTab === 'quote'}
            aria-label={`Quote Requests (${quoteCount} items)`}
          >
            Quote Requests ({quoteCount})
          </button>
        </div>
        
        {activeTab === 'cart' && (
          <div className="cart-content" role="tabpanel">
            <h2>Your NDT Equipment Cart</h2>
            
            {(!cart || cart.items.length === 0) ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button className="continue-shopping-btn" onClick={continueShopping} aria-label="Browse NDT products">Start Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.items.map((item) => (
                    <div key={item.id || item.product_id} className="cart-item">
                      <div className="cart-item-image">
                        <img 
                          src={getSafeImageUrl(item)} 
                          alt={`${item.product_name || 'NDT Product'} - DAKS Tools`}
                          onError={() => handleImageError(item.id || item.product_id)}
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5'
                          }}
                        />
                      </div>
                      
                      <div className="cart-item-details">
                        <h3>{item.product_name}</h3>
                        <p className="item-description">{item.short_description || item.description}</p>
                        <div className="item-price">₹{parseFloat(item.price || 0).toFixed(2)}</div>
                        
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1), 'cart')}
                            disabled={(item.quantity || 1) <= 1}
                            aria-label="Decrease quantity"
                          >-</button>
                          <span className="item-quantity" aria-label={`Quantity: ${item.quantity || 1}`}>{item.quantity || 1}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1, 'cart')}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                      </div>
                      
                      <div className="cart-item-total">
                        ₹{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}
                      </div>
                      
                      <button className="remove-item-btn" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.product_name} from cart`}>×</button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary">
                  <div className="summary-details">
                    <div className="cart-total"><span>Subtotal:</span><span>₹{calculateTotal(cart.items).toFixed(2)}</span></div>
                    <div className="cart-total"><span>Shipping:</span><span>Calculated at checkout</span></div>
                    <div className="cart-total grand-total"><span>Total:</span><span>₹{calculateTotal(cart.items).toFixed(2)}</span></div>
                  </div>
                  
                  <div className="cart-actions">
                    <button className="continue-shopping-btn" onClick={continueShopping} aria-label="Continue shopping">Continue Shopping</button>
                    {isLoggedIn ? (
                      <button className="checkout-btn" onClick={handleBuyNow} disabled={cart.items.length === 0} aria-label="Proceed to checkout">Checkout</button>
                    ) : (
                      <button className="login-checkout-btn" onClick={handleLoginRedirect} aria-label="Login to checkout">Login to Checkout</button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'quote' && (
          <div className="quote-content" role="tabpanel">
            <h2>Your NDT Quote Requests</h2>
            
            {(!quoteRequest || quoteRequest.items.length === 0) ? (
              <div className="empty-cart">
                <p>No quote requests</p>
                <button className="continue-shopping-btn" onClick={continueShopping} aria-label="Browse NDT products">Start Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {quoteRequest.items.map((item) => (
                    <div key={item.id || item.product_id} className="cart-item">
                      <div className="cart-item-image">
                        <img 
                          src={getSafeImageUrl(item)} 
                          alt={`${item.product_name || 'NDT Product'} - DAKS Tools`}
                          onError={() => handleImageError(item.id || item.product_id)}
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5'
                          }}
                        />
                      </div>
                      
                      <div className="cart-item-details">
                        <h3>{item.product_name}</h3>
                        <p className="item-description">{item.short_description || item.description}</p>
                        
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1), 'quote')}
                            disabled={(item.quantity || 1) <= 1}
                            aria-label="Decrease quantity"
                          >-</button>
                          <span className="item-quantity">{item.quantity || 1}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1, 'quote')}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                      </div>
                      
                      <button className="remove-item-btn" onClick={() => removeFromQuote(item.id)} aria-label={`Remove ${item.product_name} from quote`}>×</button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary">
                  <p className="quote-note"><strong>Note:</strong> These items are for quotation only.</p>
                  
                  <div className="cart-actions">
                    <button className="continue-shopping-btn" onClick={continueShopping} aria-label="Continue shopping">Continue Shopping</button>
                    {isLoggedIn ? (
                      <button className="submit-quote-btn" onClick={handleBuyNow} disabled={quoteRequest.items.length === 0} aria-label="Submit quote request">Submit Quote</button>
                    ) : (
                      <button className="login-quote-btn" onClick={handleLoginRedirect} aria-label="Login to submit quote">Login to Submit</button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;