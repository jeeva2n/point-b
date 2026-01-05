import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Cart.css';

// --- Backend Helper ---
const getBackendUrl = () => {
  return localStorage.getItem('backend_url') || 'http://192.168.1.9:5001';
};

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

  const navigate = useNavigate();
  const backendUrl = getBackendUrl();
  
  // Web3Forms Access Key
  const WEB3_ACCESS_KEY = "73a5d128-f5b6-4b66-80c6-bdac56b080c8";

  // Load cart from API
  const loadCart = useCallback(async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      setCart({ items: [] });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/cart/${cartId}`);
      const data = await response.json();
      
      if (data.success && data.cart) {
        setCart(data.cart);
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
  }, [backendUrl]);

  // Load quote request from API
  const loadQuoteRequest = useCallback(async () => {
    const quoteId = localStorage.getItem('quoteId');
    if (!quoteId) {
      setQuoteRequest({ items: [] });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/quote-requests/${quoteId}`);
      const data = await response.json();
      
      if (data.success && data.quoteRequest) {
        setQuoteRequest(data.quoteRequest);
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
  }, [backendUrl]);

  // Fetch order history
  const fetchOrderHistory = useCallback(async (token) => {
    try {
      setOrderHistoryLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderHistory(data.orders || []);
      } else {
        console.error('Failed to fetch order history:', data.message);
        if (data.message === 'Authentication required' || data.message === 'Invalid token' || data.message === 'Token expired') {
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
  }, [backendUrl]);

  // Check login status
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

  // Load cart and quote
  const loadCartAndQuote = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadCart(), loadQuoteRequest()]);
    setLoading(false);
  }, [loadCart, loadQuoteRequest]);

  // Handle storage changes
  const handleStorageChange = useCallback((e) => {
    if (e.key === 'token' || e.key === 'user') {
      checkLoginStatus();
    }
    if (e.key === 'cartId') {
      loadCart();
    }
    if (e.key === 'quoteId') {
      loadQuoteRequest();
    }
  }, [checkLoginStatus, loadCart, loadQuoteRequest]);

  // Initial load
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
      const response = await fetch(`${backendUrl}/api/cart/${cartId}/items/${itemId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.cart) {
          setCart(data.cart);
        } else {
          await loadCart();
        }
      } else {
        alert('Failed to remove item from cart');
        await loadCart();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Error removing item from cart');
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
      const response = await fetch(`${backendUrl}/api/quote-requests/${quoteId}/items/${itemId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.quoteRequest) {
          setQuoteRequest(data.quoteRequest);
        } else {
          await loadQuoteRequest();
        }
      } else {
        alert('Failed to remove item from quote request');
        await loadQuoteRequest();
      }
    } catch (error) {
      console.error('Error removing item from quote:', error);
      alert('Error removing item from quote request');
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
        ? `${backendUrl}/api/cart/${id}/items/${itemId}` 
        : `${backendUrl}/api/quote-requests/${id}/items/${itemId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (type === 'cart' && data.cart) {
          setCart(data.cart);
        } else if (type === 'quote' && data.quoteRequest) {
          setQuoteRequest(data.quoteRequest);
        } else {
          type === 'cart' ? await loadCart() : await loadQuoteRequest();
        }
      } else {
        console.error(`Failed to update ${type} quantity:`, data.message || "Unknown error");
        alert(`Failed to update quantity. ${data.message || "Please try again."}`);
        type === 'cart' ? await loadCart() : await loadQuoteRequest();
      }
    } catch (error) {
      console.error(`Error updating ${type} quantity:`, error);
      alert(`Error updating quantity. Please try again.`);
      type === 'cart' ? await loadCart() : await loadQuoteRequest();
    } finally {
      setLoading(false);
    }
  };

  const continueShopping = () => {
    navigate('/flawed-specimens');
  };

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // PROCESS ORDER
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

      // CREATE ORDER IN DATABASE
      const orderResponse = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cartId: cartId,
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
          orderType: 'purchase'
        }),
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order in database');
      }

      const orderNumber = orderData.orderNumber || `ORD-${Date.now()}`;
      const totalAmount = calculateTotal(cart.items).toFixed(2);

      // SEND EMAIL USING WEB3FORMS
      const mailFormData = new FormData();
      mailFormData.append("access_key", WEB3_ACCESS_KEY);
      mailFormData.append("subject", `New Order #${orderNumber} - Rs.${totalAmount} - DAKS NDT Services`);
      mailFormData.append("name", formData.name);
      mailFormData.append("email", formData.email);
      mailFormData.append("phone", formData.phone);
      mailFormData.append("company", formData.company || 'Not provided');
      mailFormData.append("message", `
        New Purchase Order #${orderNumber}
        Total Amount: Rs.${totalAmount}
        
        Customer: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Company: ${formData.company || 'Not provided'}
        User ID: ${user.id}
        
        Shipping Address:
        ${formData.address || 'Not provided'}
        ${formData.city || ''} ${formData.state || ''} ${formData.zip || ''}
        ${formData.country || 'India'}
        
        Order Notes: ${formData.message || 'No special instructions'}
        
        Order Items:
        ${cart.items.map(item => `- ${item.product_name} x${item.quantity || 1} @ Rs.${parseFloat(item.price || 0).toFixed(2)} each = Rs.${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`).join('\n')}
      `);
      
      mailFormData.append("from_name", "DAKS NDT Order System");
      mailFormData.append("reply_to", formData.email);

      const mailResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: mailFormData
      });

      const mailResult = await mailResponse.json();

      if (mailResult.success) {
        localStorage.removeItem('cartId');
        setCart({ items: [] });
        await fetchOrderHistory(localStorage.getItem('token'));
        setCheckoutStep('confirmation');
      } else {
        console.error("Order email API error:", mailResult);
        alert('Order was saved but email notification failed. Our team will contact you.');
        setCheckoutStep('confirmation');
      }
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert(`Error processing your order: ${error.message || 'Please try again or contact support.'}`);
    } finally {
      setLoading(false);
    }
  };

  // PROCESS QUOTE REQUEST
  const processQuoteRequest = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please log in to submit a quote request.');
      handleLoginRedirect();
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)');
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

      // FINALIZE QUOTE REQUEST IN DATABASE
      const quoteResponse = await fetch(`${backendUrl}/api/quote-requests/${quoteId}/finalize`, {
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

      const quoteNumber = quoteData.quoteNumber || `QUOTE-${Date.now()}`;

      // SEND EMAIL USING WEB3FORMS
      const mailFormData = new FormData();
      mailFormData.append("access_key", WEB3_ACCESS_KEY);
      mailFormData.append("subject", `New Quote Request #${quoteNumber} - DAKS NDT Services`);
      mailFormData.append("name", formData.name);
      mailFormData.append("email", formData.email);
      mailFormData.append("phone", formData.phone);
      mailFormData.append("company", formData.company || 'Not provided');
      mailFormData.append("message", `
        NEW QUOTE REQUEST #${quoteNumber}
        
        Customer: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Company: ${formData.company || 'Not provided'}
        User ID: ${user.id}
        
        Address:
        ${formData.address || 'Not provided'}
        ${formData.city || ''} ${formData.state || ''} ${formData.zip || ''}
        ${formData.country || 'India'}
        
        Requirements: ${formData.message || 'No specific requirements mentioned'}
        
        Items Requested:
        ${quoteRequest.items.map(item => `- ${item.product_name} (Quantity: ${item.quantity})${item.description ? ` - ${item.description}` : ''}`).join('\n')}
        
        ACTION REQUIRED: Please prepare a detailed quote with pricing and send it to the customer within 24-48 hours.
      `);
      
      mailFormData.append("from_name", "DAKS NDT Quote System");
      mailFormData.append("reply_to", formData.email);

      const mailResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: mailFormData
      });

      const mailResult = await mailResponse.json();

      if (mailResult.success) {
        localStorage.removeItem('quoteId');
        setQuoteRequest({ items: [] });
        await fetchOrderHistory(localStorage.getItem('token'));
        setCheckoutStep('confirmation');
      } else {
        console.error("Email API error:", mailResult);
        alert('Quote request was saved but email notification failed. Our team will contact you.');
        setCheckoutStep('confirmation');
      }
      
    } catch (error) {
      console.error('Error processing quote request:', error);
      alert(`Error submitting your quote request: ${error.message || 'Please try again or contact support.'}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
    }, 0);
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
      <div className="cart-container loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  // Confirmation screen
  if (checkoutStep === 'confirmation') {
    return (
      <div className="cart-container">
        <div className="confirmation-message">
          <div className="confirmation-icon">✓</div>
          <h2>Thank You!</h2>
          <p>
            {activeTab === 'cart' 
              ? 'Your order has been received successfully.' 
              : 'Your quote request has been submitted successfully.'
            }
          </p>
          <p>Our team will contact you shortly with more information.</p>
          <p>You will receive a confirmation email with your reference number.</p>
          <div className="confirmation-actions">
            <button 
              className="continue-shopping-btn"
              onClick={continueShopping}
            >
              Continue Shopping
            </button>
            
            <button 
              className="view-orders-btn"
              onClick={() => navigate('/account')}
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order history section for logged-in users
  const renderOrderHistory = () => {
    if (!isLoggedIn) return null;
    
    if (orderHistoryLoading) {
      return (
        <div className="order-history-section loading">
          <h3>Recent Orders</h3>
          <div className="loading-indicator">Loading your order history...</div>
        </div>
      );
    }
    
    if (orderHistory.length === 0) {
      return (
        <div className="order-history-section empty">
          <h3>Recent Orders</h3>
          <p className="empty-history">You haven't placed any orders yet.</p>
        </div>
      );
    }
    
    return (
      <div className="order-history-section">
        <h3>Recent Orders</h3>
        <div className="recent-orders">
          {orderHistory.slice(0, 3).map((order, index) => (
            <div key={index} className="recent-order-item">
              <div className="order-date">
                {new Date(order.created_at).toLocaleDateString()}
              </div>
              <div className="order-status">
                Status: <span className={`status-${order.status || 'pending'}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              <button 
                onClick={() => navigate(`/order/${order.id}`)}
                className="view-order-btn"
              >
                View Order
              </button>
            </div>
          ))}
          {orderHistory.length > 3 && (
            <div className="view-all-orders">
              <button 
                onClick={() => navigate('/account')}
                className="view-all-btn"
              >
                View All Orders
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Checkout form
  if (checkoutStep === 'form') {
    if (!isLoggedIn) {
      return (
        <div className="cart-container">
          <div className="login-required">
            <h2>Login Required</h2>
            <p>You need to be logged in to complete your {activeTab === 'cart' ? 'order' : 'quote request'}.</p>
            <button 
              className="login-btn"
              onClick={handleLoginRedirect}
            >
              Log In or Register
            </button>
            <button 
              className="back-btn"
              onClick={() => setCheckoutStep('cart')}
            >
              Back to Cart
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="cart-container">
        <h2>{activeTab === 'cart' ? 'Complete Your Order' : 'Submit Quote Request'}</h2>
        
<form
  className="checkoutForm"
  onSubmit={activeTab === 'cart' ? processOrder : processQuoteRequest}
>
  {/* Contact Information */}
  <div className="checkoutSection">
    <h3 className="sectionTitle">Contact Information</h3>

    <div className="formRow">
      <div className="formField">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="John Doe"
        />
      </div>

      <div className="formField">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="john@example.com"
        />
      </div>
    </div>

    <div className="formRow">
      <div className="formField">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          placeholder="+91 9876543210"
        />
      </div>

      <div className="formField">
        <label htmlFor="company">Company Name</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Your Company"
        />
      </div>
    </div>
  </div>

  {/* Shipping Address */}
  <div className="checkoutSection">
    <h3 className="sectionTitle">Shipping Address</h3>

    <div className="formField">
      <label htmlFor="address">Address</label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Street Address"
      />
    </div>

    <div className="formRow">
      <div className="formField">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="City"
        />
      </div>

      <div className="formField">
        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="State"
        />
      </div>

      <div className="formField">
        <label htmlFor="zip">PIN Code</label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={formData.zip}
          onChange={handleInputChange}
          placeholder="PIN Code"
        />
      </div>
    </div>

    <div className="formField">
      <label htmlFor="country">Country</label>
      <input
        type="text"
        id="country"
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        placeholder="Country"
      />
    </div>
  </div>

  {/* Additional Information */}
  <div className="checkoutSection">
    <h3 className="sectionTitle">Additional Information</h3>

    <div className="formField">
      <label htmlFor="message">
        {activeTab === 'cart' ? 'Order Notes' : 'Quote Requirements'}
      </label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        rows="4"
        placeholder={
          activeTab === 'cart'
            ? 'Any special instructions for your order...'
            : 'Please describe your requirements, specifications, or any other details...'
        }
      />
    </div>
  </div>

  {/* Actions */}
  <div className="formActions">
    <button
      type="button"
      className="secondaryBtn"
      onClick={() => setCheckoutStep('cart')}
    >
      Back to Cart
    </button>

    <button
      type="submit"
      className="primaryBtn"
      disabled={loading}
    >
      {loading
        ? 'Processing...'
        : activeTab === 'cart'
        ? 'Place Order'
        : 'Submit Quote Request'}
    </button>
  </div>
</form>

      </div>
    );
  }

  // Cart view (default)
  return (
    <div className="cart-container">
      {/* User section with login/logout */}
      <div className="user-section">
        {isLoggedIn ? (
          <div className="logged-in-user">
            <span>Welcome, {user?.full_name || user?.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="guest-user">
            <p>Please <button className="login-link" onClick={handleLoginRedirect}>login</button> to save your orders and view your history.</p>
          </div>
        )}
      </div>
      
      {/* Order history for logged-in users */}
      {isLoggedIn && renderOrderHistory()}
      
      <div className="cart-tabs">
        <button 
          className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          Shopping Cart ({cartCount})
        </button>
        <button 
          className={`tab-button ${activeTab === 'quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('quote')}
        >
          Quote Requests ({quoteCount})
        </button>
      </div>
      
      {activeTab === 'cart' && (
        <div className="cart-content">
          <h2>Your Shopping Cart</h2>
          
          {(!cart || cart.items.length === 0) ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button 
                className="continue-shopping-btn"
                onClick={continueShopping}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.id || item.product_id} className="cart-item">
                    <div className="cart-item-image">
                      <img 
                        src={item.image_url ? `${backendUrl}${item.image_url}` : '/images/placeholder.jpg'} 
                        alt={item.product_name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
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
                          onClick={() => updateQuantity(item.id, Math.max(1, parseInt(item.quantity || 1) - 1), 'cart')}
                          disabled={parseInt(item.quantity || 1) <= 1}
                        >
                          -
                        </button>
                        <span className="item-quantity">{item.quantity || 1}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, parseInt(item.quantity || 1) + 1, 'cart')}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-total">
                      ₹{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}
                    </div>
                    
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-details">
                  <div className="cart-total">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal(cart.items).toFixed(2)}</span>
                  </div>
                  <div className="cart-total">
                    <span>Shipping:</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="cart-total grand-total">
                    <span>Total:</span>
                    <span>₹{calculateTotal(cart.items).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="continue-shopping-btn"
                    onClick={continueShopping}
                  >
                    Continue Shopping
                  </button>
                  
                  {isLoggedIn ? (
                    <button 
                      className="checkout-btn"
                      onClick={handleBuyNow}
                      disabled={cart.items.length === 0}
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <button 
                      className="login-checkout-btn"
                      onClick={handleLoginRedirect}
                      disabled={cart.items.length === 0}
                    >
                      Login to Checkout
                    </button>
                  )}
                </div>
                
                {!isLoggedIn && cart.items.length > 0 && (
                  <div className="login-notice">
                    <p>Please log in to complete your purchase</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      {activeTab === 'quote' && (
        <div className="quote-content">
          <h2>Your Quote Requests</h2>
          
          {(!quoteRequest || quoteRequest.items.length === 0) ? (
            <div className="empty-cart">
              <p>You have no quote requests</p>
              <button 
                className="continue-shopping-btn"
                onClick={continueShopping}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {quoteRequest.items.map((item) => (
                  <div key={item.id || item.product_id} className="cart-item">
                    <div className="cart-item-image">
                      <img 
                        src={item.image_url ? `${backendUrl}${item.image_url}` : '/images/placeholder.jpg'} 
                        alt={item.product_name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="cart-item-details">
                      <h3>{item.product_name}</h3>
                      <p className="item-description">{item.short_description || item.description}</p>
                      
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, Math.max(1, parseInt(item.quantity || 1) - 1), 'quote')}
                          disabled={parseInt(item.quantity || 1) <= 1}
                        >
                          -
                        </button>
                        <span className="item-quantity">{item.quantity || 1}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, parseInt(item.quantity || 1) + 1, 'quote')}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromQuote(item.id)}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-details">
                  <p className="quote-note">
                    <strong>Note:</strong> These items are for quotation only. You'll receive pricing after our team reviews your request.
                  </p>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="continue-shopping-btn"
                    onClick={continueShopping}
                  >
                    Continue Shopping
                  </button>
                  
                  {isLoggedIn ? (
                    <button 
                      className="submit-quote-btn"
                      onClick={handleBuyNow}
                      disabled={quoteRequest.items.length === 0}
                    >
                      Submit Quote Request
                    </button>
                  ) : (
                    <button 
                      className="login-quote-btn"
                      onClick={handleLoginRedirect}
                      disabled={quoteRequest.items.length === 0}
                    >
                      Login to Submit Quote
                    </button>
                  )}
                </div>
                
                {!isLoggedIn && quoteRequest.items.length > 0 && (
                  <div className="login-notice">
                    <p>Please log in to submit your quote request</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;