import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Account.css';

const getBackendUrl = () => {
  return localStorage.getItem('backend_url') || 'http://192.168.1.9:5002';
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
      setError('Network error. Check backend.');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, handleLogout]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) return <div className="account-loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Sidebar */}
        <div className="account-sidebar">
          <div className="account-user-info">
            <h3>My Account</h3>
            <p className="user-email">{user?.email}</p>
          </div>
          <div className="account-tabs">
            <button className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              My Orders <span className="count-badge">{orders.length}</span>
            </button>
            <button className={`tab-button ${activeTab === 'quotes' ? 'active' : ''}`} onClick={() => setActiveTab('quotes')}>
              Quote Requests <span className="count-badge">{quoteRequests.length}</span>
            </button>
            <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              Profile Info
            </button>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        
        {/* Main Content */}
        <div className="account-content">
          {error && <div className="error-message">{error}</div>}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>My Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet.</p>
                  <button onClick={() => navigate('/flawed-specimens')} className="shop-now-button">Browse Products</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div><strong>#{order.order_number}</strong></div>
                        <div>{new Date(order.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="order-content">
                        <p><strong>Items:</strong> {order.product_names || 'Items details unavailable'}</p>
                        <p><strong>Total:</strong> ${order.total_amount}</p>
                        <div className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                          {order.status || 'Pending'}
                        </div>
                      </div>
                      <div className="order-footer">
                        <button className="view-details-button" onClick={() => navigate(`/order/${order.id}`)}>View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="orders-section">
              <h2>Quote Requests</h2>
              {quoteRequests.length === 0 ? (
                <div className="empty-state">
                  <p>No quote requests yet.</p>
                  <button onClick={() => navigate('/flawed-specimens')} className="shop-now-button">Request a Quote</button>
                </div>
              ) : (
                <div className="orders-list">
                  {quoteRequests.map(quote => (
                    <div key={quote.id} className="order-card">
                      <div className="order-header">
                        <div><strong>#{quote.quote_number}</strong></div>
                        <div>{new Date(quote.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="order-content">
                        <p><strong>Items:</strong> {quote.product_names || 'Items details unavailable'}</p>
                        <div className={`status-badge status-${quote.status?.toLowerCase() || 'pending'}`}>
                          {quote.status || 'Submitted'}
                        </div>
                      </div>
                      <div className="order-footer">
                         <span className="info-text">Check your email for updates</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-card">
                <div className="info-row"><label>Full Name:</label> <span>{user?.full_name || '-'}</span></div>
                <div className="info-row"><label>Email:</label> <span>{user?.email}</span></div>
                <div className="info-row"><label>Phone:</label> <span>{user?.phone || '-'}</span></div>
                <div className="info-row"><label>Company:</label> <span>{user?.company || '-'}</span></div>
                <div className="info-row"><label>Member Since:</label> <span>{new Date(user?.created_at).toLocaleDateString()}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;