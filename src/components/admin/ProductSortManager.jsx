// In your parent component (e.g., ProductSortManager.js)

import React, { useState } from 'react';
import SortableProductList from './SortableProductList';

const ProductSortManager = ({ backendUrl }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const token = localStorage.getItem('admin_token');

  const handleEdit = (productId) => {
    console.log('Edit product:', productId);
    // Navigate to edit or open modal
  };

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.success) {
        alert('Product deleted!');
        setRefreshTrigger(prev => prev + 1); // Refresh list
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Product Sort Manager</h1>
      
      {/* Calibration Blocks */}
      <SortableProductList
        type="calibration_block"
        typeName="Calibration Blocks"
        backendUrl={backendUrl}
        token={token}
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
      />

      {/* Flawed Specimens */}
      <SortableProductList
        type="flawed_specimen"
        typeName="Flawed Specimens"
        backendUrl={backendUrl}
        token={token}
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
      />

      {/* Validation Blocks */}
      <SortableProductList
        type="validation_block"
        typeName="Validation Blocks"
        backendUrl={backendUrl}
        token={token}
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default ProductSortManager;