import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Account.css';

const getBackendUrl = () => {
  return localStorage.getItem('backend_url') || 'http://192.168.1.9:5001';
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendUrl = getBackendUrl();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        return;
      }

      const response = await fetch(`${backendUrl}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setOrders(data.orders || []);
        setQuoteRequests(data.quoteRequests || []);
      } else {
        if (data.message === 'Authentication required' || data.message === 'Token expired') {
          handleLogout();
        } else {
          setError(data.message);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, handleLogout]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return `₹${numPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'submitted': 'Submitted',
      'quoted': 'Quote Sent',
      'accepted': 'Accepted',
      'rejected': 'Rejected'
    };
    return statusMap[status?.toLowerCase()] || status || 'Pending';
  };

  if (loading) {
    return (
      <div className="account-page">
        <div className="account-loading">
          <div className="loading-spinner"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-page">
        <div className="account-error">
          <h2>Session Expired</h2>
          <p>Please log in to view your account.</p>
          <button onClick={() => navigate('/login')} className="login-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="account-user-info">
            <div className="user-avatar">
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h3>{user?.full_name || 'Welcome'}</h3>
            <p className="user-email">{user?.email}</p>
          </div>
          
          <nav className="account-tabs">
            <button 
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} 
              onClick={() => setActiveTab('orders')}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </span>
              <span className="tab-text">My Orders</span>
              <span className="count-badge">{orders.length}</span>
            </button>
            
            <button 
              className={`tab-button ${activeTab === 'quotes' ? 'active' : ''}`} 
              onClick={() => setActiveTab('quotes')}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </span>
              <span className="tab-text">Quote Requests</span>
              <span className="count-badge">{quoteRequests.length}</span>
            </button>
            
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} 
              onClick={() => setActiveTab('profile')}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <span className="tab-text">Profile Info</span>
            </button>
          </nav>
          
          <button className="logout-button" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </aside>
        
        {/* Main Content */}
        <main className="account-content">
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
              <button onClick={fetchUserData} className="retry-button">Retry</button>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <section className="orders-section">
              <div className="section-header">
                <h2>My Orders</h2>
                <p className="section-subtitle">Track and manage your orders</p>
              </div>
              
              {orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                  </div>
                  <h3>No orders yet</h3>
                  <p>You haven't placed any orders. Start exploring our products!</p>
                  <button onClick={() => navigate('/flawed-specimens')} className="shop-now-button">
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <article key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-number">Order #{order.order_number}</span>
                          <span className="order-date">{formatDate(order.created_at)}</span>
                        </div>
                        <div className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                          {getStatusLabel(order.status)}
                        </div>
                      </div>
                      
                      <div className="order-content">
                        <div className="order-items">
                          <span className="label">Items:</span>
                          <span className="value">{order.product_names || 'Product details unavailable'}</span>
                        </div>
                        <div className="order-total">
                          <span className="label">Total Amount:</span>
                          <span className="value price">{formatPrice(order.total_amount)}</span>
                        </div>
                      </div>
                      
                      <div className="order-footer">
                        <button 
                          className="view-details-button" 
                          onClick={() => navigate(`/order/${order.id}`)}
                        >
                          View Details
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* QUOTES TAB */}
          {activeTab === 'quotes' && (
            <section className="orders-section">
              <div className="section-header">
                <h2>Quote Requests</h2>
                <p className="section-subtitle">View your submitted quote requests</p>
              </div>
              
              {quoteRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <h3>No quote requests yet</h3>
                  <p>Need a custom quote? Browse our products and request one!</p>
                  <button onClick={() => navigate('/flawed-specimens')} className="shop-now-button">
                    Request a Quote
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {quoteRequests.map(quote => (
                    <article key={quote.id} className="order-card quote-card">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-number">Quote #{quote.quote_number}</span>
                          <span className="order-date">{formatDate(quote.created_at)}</span>
                        </div>
                        <div className={`status-badge status-${quote.status?.toLowerCase() || 'submitted'}`}>
                          {getStatusLabel(quote.status)}
                        </div>
                      </div>
                      
                      <div className="order-content">
                        <div className="order-items">
                          <span className="label">Items:</span>
                          <span className="value">{quote.product_names || 'Product details unavailable'}</span>
                        </div>
                        {quote.message && (
                          <div className="order-message">
                            <span className="label">Requirements:</span>
                            <span className="value">{quote.message}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="order-footer">
                        <span className="info-text">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                          Check your email for quote updates
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <section className="profile-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p className="section-subtitle">Your personal details</p>
              </div>
              
              <div className="profile-card">
                <div className="profile-avatar-large">
                  {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                
                <div className="profile-details">
                  <div className="info-row">
                    <label>Full Name</label>
                    <span>{user?.full_name || 'Not provided'}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Email Address</label>
                    <span>{user?.email}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Phone Number</label>
                    <span>{user?.phone || 'Not provided'}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Company</label>
                    <span>{user?.company || 'Not provided'}</span>
                  </div>
                  
                  <div className="info-row">
                    <label>Member Since</label>
                    <span>{formatDate(user?.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-actions">
                <p className="help-text">
                  Need to update your information? Contact our support team.
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;