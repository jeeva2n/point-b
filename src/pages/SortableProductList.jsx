// SortableProductList.js
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  const [isReordering, setIsReordering] = useState(false);

  // Fetch products specifically for this type
  const fetchProductsByType = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/products/by-type/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByType();
  }, [type, refreshTrigger]);

  // Handle Drag End
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    // 1. Reorder locally
    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProducts(items);

    // 2. Send to Backend
    const orderData = items.map((item, index) => ({
      id: item.id,
      sort_order: index
    }));

    try {
      await fetch(`${backendUrl}/api/products/reorder/${type}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: orderData })
      });
      console.log(`Sort order saved for ${type}`);
    } catch (err) {
      console.error("Failed to save order", err);
    }
  };

  // Helper for images
  const getImageUrl = (input) => {
    if (!input) return '/placeholder-image.png';
    let path = typeof input === 'object' ? input.url : input;
    if (!path) return '/placeholder-image.png';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${backendUrl}${cleanPath}`;
  };

  const formatPrice = (price) => price ? `₹${parseFloat(price).toFixed(2)}` : "₹0.00";

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <i className="fas fa-spinner fa-spin"></i> Loading {typeName}...
    </div>
  );

  return (
    <div className="type-section-container">
      <div className="type-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
            {typeName} <span style={{ fontSize: '0.8em', color: '#888', fontWeight: 'normal' }}>({products.length})</span>
        </h3>
        
        <button 
          className="reorder-btn"
          onClick={() => setIsReordering(!isReordering)}
          style={{
            padding: '8px 16px',
            background: isReordering ? '#ff9800' : '#f8f9fa',
            color: isReordering ? 'white' : '#333',
            border: isReordering ? 'none' : '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-sort"></i> {isReordering ? "Done Sorting" : "Change Order"}
        </button>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
            <i className="fas fa-box-open" style={{ fontSize: '24px', marginBottom: '10px', display: 'block' }}></i>
            No products found in this category.
        </div>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId={`list-${type}`} direction="horizontal">
            {(provided) => (
              <div 
                className="products-grid"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                  minHeight: '200px'
                }}
              >
                {products.map((product, index) => (
                  <Draggable 
                    key={product.id} 
                    draggableId={String(product.id)} 
                    index={index}
                    isDragDisabled={!isReordering}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="product-card"
                        style={{
                          ...provided.draggableProps.style,
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: snapshot.isDragging ? '0 15px 30px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
                          border: isReordering ? '2px dashed #2196f3' : '1px solid #eee',
                          transform: snapshot.isDragging ? provided.draggableProps.style.transform : 'translate(0,0)',
                          opacity: snapshot.isDragging ? 0.9 : 1,
                          transition: snapshot.isDragging ? 'none' : 'all 0.2s',
                          cursor: isReordering ? 'grab' : 'default',
                          position: 'relative'
                        }}
                      >
                         {isReordering && (
                           <div style={{
                             position: 'absolute', top: 0, left: 0, right: 0,
                             background: 'rgba(33, 150, 243, 0.9)', color: 'white', 
                             textAlign: 'center', padding: '6px', 
                             fontSize: '0.85rem', fontWeight: 'bold',
                             zIndex: 10
                           }}>
                             <i className="fas fa-arrows-alt"></i> Drag to Reorder
                           </div>
                         )}

                        <div className="product-image" style={{ height: '200px', overflow: 'hidden', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={getImageUrl(product.mainImage || product.image_url)} 
                            alt={product.name}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        
                        <div className="product-info" style={{ padding: '15px' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#2c3e50', lineHeight: '1.4', height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>
                              {product.name}
                          </h4>
                          <div className="product-category" style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {product.category}
                          </div>
                          
                          <div className="product-footer" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                            <div className="product-price" style={{ fontWeight: '700', color: '#2c3e50', fontSize: '1.1rem' }}>
                              {formatPrice(product.price)}
                            </div>
                            <div className="product-actions" style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => onEdit(product.id)} 
                                className="view-button"
                                style={{
                                    background: '#e3f2fd', color: '#1976d2', border: 'none',
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                                title="View/Edit"
                              >
                                  <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                onClick={() => onDelete(product.id)} 
                                className="delete-button"
                                style={{
                                    background: '#ffebee', color: '#d32f2f', border: 'none',
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                                title="Delete"
                              >
                                  <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
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