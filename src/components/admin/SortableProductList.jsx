// src/components/admin/SortableProductList.js

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import './SortableProductList.css'; // Add CSS file

const SortableProductList = ({ 
  type, 
  typeName, 
  backendUrl, 
  token, 
  onEdit, 
  onDelete, 
  refreshTrigger 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Fetch products by type
  const fetchProductsByType = async () => {
    try {
      setLoading(true);
      
      // Use the main products endpoint with type filter
      const res = await fetch(`${backendUrl}/api/products?type=${type}&limit=500`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Sort by sort_order if available
        const sortedProducts = (data.products || []).sort((a, b) => {
          return (a.sort_order || 9999) - (b.sort_order || 9999);
        });
        setProducts(sortedProducts);
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type && backendUrl) {
      fetchProductsByType();
    }
  }, [type, refreshTrigger, backendUrl]);

  // Handle Drag End
  const handleOnDragEnd = async (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // No movement
    if (result.source.index === result.destination.index) {
      return;
    }

    // 1. Reorder locally first (optimistic update)
    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update state immediately for smooth UX
    setProducts(items);

    // 2. Prepare order data for backend
    const orderData = items.map((item, index) => ({
      id: item.id,
      sort_order: index
    }));

    // 3. Send to Backend
    try {
      setSaving(true);
      
      const res = await fetch(`${backendUrl}/api/products/reorder`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: orderData })
      });

      const data = await res.json();
      
      if (data.success) {
        console.log(`✅ Sort order saved for ${type}`);
      } else {
        console.error('Failed to save order:', data.message);
        // Revert on failure
        fetchProductsByType();
      }
    } catch (err) {
      console.error("Failed to save order", err);
      // Revert on error
      fetchProductsByType();
    } finally {
      setSaving(false);
    }
  };

  // Helper for images
  const getImageUrl = (input) => {
    if (!input) return '/placeholder-image.png';
    
    let path = input;
    if (typeof input === 'object' && input !== null) {
      path = input.url || input.path;
    }
    
    if (!path || typeof path !== 'string') return '/placeholder-image.png';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${backendUrl}${cleanPath}`;
  };

  const formatPrice = (price) => {
    return price ? `₹${parseFloat(price).toFixed(2)}` : "₹0.00";
  };

  const handleImageError = (e) => {
    if (!e.target.src.includes('placeholder')) {
      e.target.src = '/placeholder-image.png';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="sort-loading">
        <i className="fas fa-spinner fa-spin"></i> 
        <span>Loading {typeName}...</span>
      </div>
    );
  }

  return (
    <div className="sortable-list-container">
      {/* Header */}
      <div className="sortable-list-header">
        <h3>
          {typeName} 
          <span className="product-count">({products.length})</span>
        </h3>
        
        <div className="header-actions">
          {saving && (
            <span className="saving-indicator">
              <i className="fas fa-spinner fa-spin"></i> Saving...
            </span>
          )}
          
          <button 
            className={`reorder-toggle-btn ${isReordering ? 'active' : ''}`}
            onClick={() => setIsReordering(!isReordering)}
          >
            <i className="fas fa-sort"></i> 
            {isReordering ? "Done Sorting" : "Reorder Products"}
          </button>
        </div>
      </div>

      {/* Instruction when reordering */}
      {isReordering && (
        <div className="reorder-instruction">
          <i className="fas fa-info-circle"></i>
          Drag and drop products to change their display order. Changes are saved automatically.
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-box-open"></i>
          <p>No products found in this category.</p>
        </div>
      ) : (
        /* Drag & Drop Context */
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable 
            droppableId={`sortable-${type}`} 
            direction="vertical"
            type="PRODUCT"
          >
            {(provided, snapshot) => (
              <div 
                className={`products-sortable-grid ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {products.map((product, index) => (
                  <Draggable 
                    key={`product-${product.id}`}
                    draggableId={`product-${product.id}`}
                    index={index}
                    isDragDisabled={!isReordering}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`sortable-product-card ${snapshot.isDragging ? 'is-dragging' : ''} ${isReordering ? 'reorder-mode' : ''}`}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        {/* Drag Handle - Only visible when reordering */}
                        {isReordering && (
                          <div 
                            className="drag-handle"
                            {...provided.dragHandleProps}
                          >
                            <i className="fas fa-grip-vertical"></i>
                            <span>#{index + 1}</span>
                          </div>
                        )}

                        {/* Product Image */}
                        <div className="product-image-wrapper">
                          <img 
                            src={getImageUrl(product.mainImage || product.image_url)} 
                            alt={product.name}
                            loading="lazy"
                            onError={handleImageError}
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="product-info-wrapper">
                          <h4 className="product-title">{product.name}</h4>
                          <div className="product-category-tag">{product.category}</div>
                          
                          <div className="product-footer-row">
                            <div className="product-price-tag">
                              {formatPrice(product.price)}
                            </div>
                            
                            {!isReordering && (
                              <div className="product-action-btns">
                                <button 
                                  onClick={() => onEdit && onEdit(product.id)} 
                                  className="action-btn view-btn"
                                  title="View/Edit"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this product?')) {
                                      onDelete && onDelete(product.id);
                                    }
                                  }} 
                                  className="action-btn delete-btn"
                                  title="Delete"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default SortableProductList;