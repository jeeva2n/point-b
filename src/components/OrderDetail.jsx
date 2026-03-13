import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, getImageUrl } from '../config/api';
import '../pages/css/Cart.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        console.log('Order Detail API Response:', data);

        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Order not found');
        }
      } catch (err) {
        setError('Failed to fetch order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="cart-container loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">{error}</div>
        <button className="back-btn" onClick={() => navigate('/account')}>
          Back to Account
        </button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="cart-container">
      <div className="order-detail-header">
        <button className="back-btn" onClick={() => navigate('/account')}>
          ← Back to Orders
        </button>
        <h2>Order #{order.order_number}</h2>
        <span className={`status-badge status-${order.order_status?.toLowerCase() || 'pending'}`}>
          {order.order_status || 'Pending'}
        </span>
      </div>

      <div className="order-meta-grid">
        <div className="meta-box">
          <h3>Shipping Details</h3>
          <p><strong>{order.customer_name}</strong></p>
          <p>{order.shipping_address || 'Not provided'}</p>
          <p>{order.shipping_city || ''}{order.shipping_city && order.shipping_state ? ', ' : ''}{order.shipping_state || ''} {order.shipping_zip || ''}</p>
          <p>{order.shipping_country || 'India'}</p>
          <p>Phone: {order.customer_phone || 'Not provided'}</p>
        </div>
        <div className="meta-box">
          <h3>Order Summary</h3>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Email:</strong> {order.customer_email}</p>
          <p><strong>Status:</strong> {order.order_status || 'Pending'}</p>
        </div>
      </div>

      <div className="cart-content">
        <h3>Items Ordered</h3>
        <div className="cart-items">
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={getImageUrl(item.image_url)} 
                    alt={item.product_name || 'Product'}
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.product_name || 'Product'}</h3>
                  <p className="item-price">
                    ₹{parseFloat(item.product_price || item.price || 0).toFixed(2)} x {item.quantity}
                  </p>
                </div>
                
                <div className="cart-item-total">
                  ₹{parseFloat(item.total_price || item.total || (item.price * item.quantity) || 0).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p>No items found for this order.</p>
          )}
        </div>

        <div className="cart-summary">
          <div className="summary-details">
            <div className="cart-total">
              <span>Subtotal:</span>
              <span>₹{parseFloat(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Tax (18% GST):</span>
              <span>₹{parseFloat(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Shipping:</span>
              <span>₹{parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
            </div>
            <div className="cart-total grand-total">
              <span>Total:</span>
              <span>₹{parseFloat(order.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="order-notes-section">
            <h3>Order Notes</h3>
            <p className="quote-note">{order.notes}</p>
          </div>
        )}

        <div className="order-actions">
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/flawed-specimens')}
          >
            Continue Shopping
          </button>
          
          <button 
            className="view-orders-btn"
            onClick={() => navigate('/account')}
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;