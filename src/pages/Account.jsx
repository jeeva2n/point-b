import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getImageUrl } from './../config/api';
import './css/Account.css';
import { Helmet } from 'react-helmet-async';

const Account = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const accountSeoData = {
    title: "My Account | DAKS Tools – NDT Equipment Orders & Quotes",
    description: "Access your DAKS Tools account to track NDT equipment orders, view quote requests for calibration blocks and flawed specimens, and manage your profile information.",
    canonicalUrl: "https://dakstools.com/account",
    ogImage: "https://dakstools.com/images/account-daks-tools.jpg"
  };

  const accountSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "DAKS Tools Customer Account Dashboard",
        "description": accountSeoData.description,
        "url": accountSeoData.canonicalUrl,
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
            "name": "My Account",
            "item": "https://dakstools.com/account"
          }
        ]
      }
    ]
  };

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

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      console.log('Profile API Response:', data);
      
      if (data.success) {
        setUser(data.user);
        setOrders(data.orders || []);
        setQuoteRequests(data.quoteRequests || []);
      } else {
        if (data.message === 'Authentication required' || data.message === 'Token expired' || data.message === 'Invalid token') {
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
  }, [handleLogout]);

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
      <>
        <Helmet>
          <title>Loading Account | DAKS Tools</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="account-page">
          <div className="account-loading">
            <div className="loading-spinner" aria-label="Loading account"></div>
            <p>Loading your DAKS Tools account...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Account Login | DAKS Tools</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="account-page">
          <div className="account-error">
            <h2>Session Expired</h2>
            <p>Please log in to view your DAKS Tools account.</p>
            <button onClick={() => navigate('/login')} className="login-button" aria-label="Go to login">
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ==========================================
          SEO - REACT HELMET COMPONENT
      ========================================== */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{accountSeoData.title}</title>
        <meta name="description" content={accountSeoData.description} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={accountSeoData.canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={accountSeoData.canonicalUrl} />
        <meta property="og:title" content="My Account – DAKS Tools Customer Dashboard" />
        <meta property="og:description" content={accountSeoData.description} />
        <meta property="og:image" content={accountSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools Customer Account Dashboard" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="My Account – DAKS Tools" />
        <meta name="twitter:description" content={accountSeoData.description} />
        <meta name="twitter:image" content={accountSeoData.ogImage} />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(accountSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="account-page">
        <div className="account-container">
          <aside className="account-sidebar">
            <div className="account-user-info">
              <div className="user-avatar" aria-label="User avatar">
                {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3>{user?.full_name || 'Welcome'}</h3>
              <p className="user-email">{user?.email}</p>
            </div>
            
            <nav className="account-tabs" aria-label="Account sections">
              <button 
                className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} 
                onClick={() => setActiveTab('orders')}
                aria-label={`Orders (${orders.length})`}
                aria-current={activeTab === 'orders' ? 'page' : undefined}
              >
                <span className="tab-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
                aria-label={`Quote Requests (${quoteRequests.length})`}
                aria-current={activeTab === 'quotes' ? 'page' : undefined}
              >
                <span className="tab-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </span>
                <span className="tab-text">Quote Requests</span>
                <span className="count-badge">{quoteRequests.length}</span>
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} 
                onClick={() => setActiveTab('profile')}
                aria-label="Profile Information"
                aria-current={activeTab === 'profile' ? 'page' : undefined}
              >
                <span className="tab-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <span className="tab-text">Profile Info</span>
              </button>
            </nav>
            
            <button className="logout-button" onClick={handleLogout} aria-label="Logout from account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Logout</span>
            </button>
          </aside>
          
          <main className="account-content">
            {error && (
              <div className="error-message" role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
                <button onClick={fetchUserData} className="retry-button" aria-label="Retry loading account data">Retry</button>
              </div>
            )}

            {activeTab === 'orders' && (
              <section className="orders-section" aria-labelledby="orders-heading">
                <div className="section-header">
                  <h2 id="orders-heading">My Orders</h2>
                  <p className="section-subtitle">Track and manage your NDT equipment orders</p>
                </div>
                
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    </div>
                    <h3>No orders yet</h3>
                    <p>You haven't placed any orders. Explore our NDT calibration blocks and flawed specimens!</p>
                    <button onClick={() => navigate('/flawed-specimens')} className="shop-now-button" aria-label="Browse products">
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
                            aria-label={`View details for order ${order.order_number}`}
                          >
                            View Details
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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

            {activeTab === 'quotes' && (
              <section className="orders-section" aria-labelledby="quotes-heading">
                <div className="section-header">
                  <h2 id="quotes-heading">Quote Requests</h2>
                  <p className="section-subtitle">View your submitted NDT equipment quote requests</p>
                </div>
                
                {quoteRequests.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <h3>No quote requests yet</h3>
                    <p>Need a custom quote for calibration blocks or flawed specimens? Browse our products and request one!</p>
                    <button onClick={() => navigate('/flawed-specimens')} className="shop-now-button" aria-label="Request a quote">
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
                        </div>
                        
                        <div className="order-footer">
                          <span className="info-text">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="16" x2="12" y2="12"/>
                              <line x1="12" y1="8" x2="12.01" y2="8"/>
                            </svg>
                            Check your email for quote updates from DAKS Tools
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'profile' && (
              <section className="profile-section" aria-labelledby="profile-heading">
                <div className="section-header">
                  <h2 id="profile-heading">Profile Information</h2>
                  <p className="section-subtitle">Your DAKS Tools account details</p>
                </div>
                
                <div className="profile-card">
                  <div className="profile-avatar-large" aria-label="Profile avatar">
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
                    Need to update your information? Contact our DAKS Tools support team.
                  </p>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Account;