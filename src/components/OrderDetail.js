import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Cart.css'; // Re-using Cart CSS for consistency, or create OrderDetail.css

const getBackendUrl = () => {
  return localStorage.getItem('backend_url') || 'http://192.168.1.9:5001';
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        // Note: You might need to add headers if your API requires auth for viewing orders
        const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

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
  }, [orderId, backendUrl]);

  if (loading) return <div className="cart-container loading"><div className="loading-spinner"></div></div>;
  if (error) return <div className="cart-container"><div className="error-message">{error}</div><button onClick={() => navigate('/account')}>Back to Account</button></div>;
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
          <p>{order.shipping_address}</p>
          <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
          <p>{order.shipping_country}</p>
          <p>Phone: {order.customer_phone}</p>
        </div>
        <div className="meta-box">
          <h3>Order Summary</h3>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Email:</strong> {order.customer_email}</p>
          <p><strong>Order Type:</strong> {order.order_type}</p>
        </div>
      </div>

      <div className="cart-content">
        <h3>Items Ordered</h3>
        <div className="cart-items">
          {order.items && order.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img 
                  src={item.image_url ? `${backendUrl}${item.image_url}` : '/images/placeholder.jpg'} 
                  alt={item.product_name}
                  onError={(e) => e.target.src = '/images/placeholder.jpg'}
                />
              </div>
              
              <div className="cart-item-details">
                <h3>{item.product_name}</h3>
                <p className="item-price">${parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
              </div>
              
              <div className="cart-item-total">
                ${parseFloat(item.total).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-details">
            <div className="cart-total">
              <span>Subtotal:</span>
              <span>${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Tax (18%):</span>
              <span>${parseFloat(order.tax).toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Shipping:</span>
              <span>${parseFloat(order.shipping_cost).toFixed(2)}</span>
            </div>
            <div className="cart-total grand-total">
              <span>Total Paid:</span>
              <span>${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;