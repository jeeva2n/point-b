import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // NEW: Store email history
  const [emailHistory, setEmailHistory] = useState([]);

  // --- FETCH ORDERS ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) { navigate('/admin/login'); return; }

      const res = await fetch(`${API_URL}/api/orders/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- FETCH EMAIL HISTORY ---
  const fetchEmailHistory = async (orderId) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/orders/admin/${orderId}/email-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setEmailHistory(data.emails || []);
    } catch (error) {
      console.error("Failed to load email history");
    }
  };

  // --- VIEW DETAILS ---
  const handleViewDetails = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/orders/admin/${id}/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        setEmailMessage(""); 
        fetchEmailHistory(id); // Fetch history when opening modal
        setShowModal(true);
      }
    } catch (error) {
      alert("Error fetching details");
    }
  };

  // --- UPDATE STATUS ---
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/orders/admin/${selectedOrder.id}/status`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder({ ...selectedOrder, order_status: newStatus });
        fetchOrders();
        
        let msg = "";
        if (newStatus === 'processing') msg = "Your order is now being processed. We will notify you once it ships.";
        if (newStatus === 'shipped') msg = "Great news! Your order has been shipped. It will arrive soon.";
        if (newStatus === 'delivered') msg = "Your order has been delivered. Thank you for shopping with DAKS NDT.";
        if (newStatus === 'cancelled') msg = "Your order has been cancelled. Please contact us if this is a mistake.";
        setEmailMessage(msg);

        alert("Status updated successfully");
      }
    } catch (error) {
      alert("Update failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // --- SEND EMAIL ---
  const handleSendEmail = async () => {
    if (!emailMessage.trim()) { alert("Please enter a message."); return; }
    setSendingEmail(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/orders/admin/${selectedOrder.id}/email`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          message: emailMessage,
          subject: `Update regarding Order #${selectedOrder.order_number}`
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Email sent and saved!");
        setEmailMessage("");
        fetchEmailHistory(selectedOrder.id); // Refresh history list
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network error sending email");
    } finally {
      setSendingEmail(false);
    }
  };

  const formatPrice = (p) => `₹${parseFloat(p || 0).toFixed(2)}`;

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <button onClick={() => navigate('/admin/dashboard')} className="back-btn" style={{marginRight: '15px', padding: '8px 15px', cursor:'pointer', background:'#eee', border:'none', borderRadius:'4px'}}>← Back to Products</button>
          <h1>Order Management</h1>
        </div>
        <div className="header-right"><button onClick={fetchOrders} className="refresh-button" disabled={loading}><i className="fas fa-sync-alt"></i> Refresh List</button></div>
      </div>

      <div className="dashboard-content">
        <div className="products-list-container">
          {loading ? <div style={{padding:'20px', textAlign:'center'}}>Loading orders...</div> : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', background: 'white'}}>
                <thead>
                  <tr style={{background: '#f8f9fa', borderBottom: '2px solid #ddd', textAlign:'left'}}>
                    <th style={{padding: '15px'}}>Order #</th><th style={{padding: '15px'}}>Date</th><th style={{padding: '15px'}}>Customer</th><th style={{padding: '15px'}}>Total</th><th style={{padding: '15px'}}>Status</th><th style={{padding: '15px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{borderBottom: '1px solid #eee'}}>
                      <td style={{padding: '15px'}}><strong>{order.order_number}</strong></td>
                      <td style={{padding: '15px'}}>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td style={{padding: '15px'}}>{order.customer_name}<br/><small style={{color:'#666'}}>{order.customer_email}</small></td>
                      <td style={{padding: '15px'}}>{formatPrice(order.total_amount)}</td>
                      <td style={{padding: '15px'}}><span style={{padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', background: order.order_status === 'pending' ? '#fff3cd' : '#d4edda', color: order.order_status === 'pending' ? '#856404' : '#155724'}}>{order.order_status}</span></td>
                      <td style={{padding: '15px'}}><button onClick={() => handleViewDetails(order.id)} className="view-button">Details</button></td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No orders found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{maxWidth: '900px', width:'90%'}} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><h3>Order #{selectedOrder.order_number}</h3><button className="close-button" onClick={() => setShowModal(false)}>×</button></div>
            
            <div className="modal-body" style={{padding: '20px'}}>
              <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #eee'}}>
                <div><strong>Current Status: </strong> <span style={{color: '#0056b3', fontWeight:'bold', textTransform:'uppercase'}}>{selectedOrder.order_status}</span></div>
                <div><label style={{marginRight:'10px'}}>Update:</label><select value={selectedOrder.order_status} onChange={(e) => handleUpdateStatus(e.target.value)} disabled={updatingStatus} style={{padding: '8px', borderRadius: '4px', border:'1px solid #ccc'}}><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></div>
              </div>

              {/* EMAIL SECTION */}
              <div style={{background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #90caf9'}}>
                <h4 style={{marginTop: 0, marginBottom: '10px', color: '#0d47a1'}}><i className="fas fa-envelope"></i> Notify Customer</h4>
                <textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} placeholder="Write a message to the customer..." style={{width: '100%', height: '70px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px'}}/>
                <div style={{textAlign: 'right'}}><button onClick={handleSendEmail} disabled={sendingEmail || !emailMessage} style={{padding: '8px 20px', background: '#0d47a1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: sendingEmail ? 0.7 : 1}}>{sendingEmail ? 'Sending...' : 'Send Email & Save'}</button></div>
                
                {/* Email History List */}
                {emailHistory.length > 0 && (
                  <div style={{marginTop: '15px', borderTop: '1px solid #bbdefb', paddingTop: '10px'}}>
                    <h5 style={{margin: '0 0 10px 0', color: '#555'}}>Previous Emails:</h5>
                    <div style={{maxHeight: '150px', overflowY: 'auto'}}>
                      {emailHistory.map(email => (
                        <div key={email.id} style={{background: 'white', padding: '10px', borderRadius: '4px', marginBottom: '8px', fontSize: '13px'}}>
                          <div style={{display:'flex', justifyContent:'space-between', color:'#888', marginBottom:'4px'}}>
                            <span>{new Date(email.sent_at).toLocaleString()}</span>
                          </div>
                          <div>{email.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
                <div>
                  <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Customer Info</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer_name}</p><p><strong>Email:</strong> {selectedOrder.customer_email}</p><p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                  <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'5px', marginTop:'20px'}}>Shipping Address</h4>
                  <p>{selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_zip}</p>
                </div>
                <div>
                  <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'5px'}}>Items</h4>
                  <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px', borderBottom:'1px solid #f9f9f9', paddingBottom:'10px'}}>
                        <div style={{display:'flex', alignItems:'center'}}><img src={getImageUrl(item.image_url)} alt="" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px', marginRight:'10px'}}/><div><div style={{fontWeight:'bold', fontSize:'14px'}}>{item.name || 'Product'}</div><small style={{color:'#666'}}>Qty: {item.quantity}</small></div></div><div style={{fontWeight:'bold'}}>{formatPrice(item.total)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop: '15px', background:'#f9f9f9', padding:'15px', borderRadius:'8px', textAlign:'right', fontSize:'1.1em', fontWeight:'bold'}}>Total: {formatPrice(selectedOrder.total_amount)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;