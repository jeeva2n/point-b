import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './GalleryManager.css';

const GalleryManager = ({ backendUrl }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    file: null,
    preview: null
  });

  const categories = [
    'Products',
    'Manufacturing',
    'Laboratory',
    'Team',
    'Events',
    'Certificates',
    'General'
  ];

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const url = filterType === 'all' 
        ? `${backendUrl}/api/gallery/admin`
        : `${backendUrl}/api/gallery/admin?type=${filterType}`;
        
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setGallery(data.gallery || []);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, filterType]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = file.type.startsWith('video/') 
        ? null 
        : URL.createObjectURL(file);
      
      setUploadForm({
        ...uploadForm,
        file,
        preview,
        title: uploadForm.title || file.name.split('.')[0]
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category || 'General');
      formData.append('tags', uploadForm.tags);

      const res = await fetch(`${backendUrl}/api/gallery`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      
      if (data.success) {
        alert('File uploaded successfully!');
        resetUploadForm();
        setShowUploadModal(false);
        fetchGallery();
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editingItem) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      
      formData.append('title', editingItem.title);
      formData.append('description', editingItem.description || '');
      formData.append('category', editingItem.category || 'General');
      formData.append('tags', editingItem.tags || '');
      formData.append('is_active', editingItem.is_active);
      
      if (editingItem.newFile) {
        formData.append('file', editingItem.newFile);
      }

      const res = await fetch(`${backendUrl}/api/gallery/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Item updated successfully!');
        setEditingItem(null);
        fetchGallery();
      } else {
        alert('Update failed: ' + data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${backendUrl}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Item deleted successfully!');
        fetchGallery();
      } else {
        alert('Delete failed: ' + data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(gallery);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGallery(items);
    setHasOrderChanges(true);
  };

  const saveOrder = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const orderData = gallery.map((item, index) => ({
        id: item.id,
        sort_order: index
      }));

      const res = await fetch(`${backendUrl}/api/gallery/reorder/items`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: orderData })
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Order saved successfully!');
        setHasOrderChanges(false);
        setIsReordering(false);
      } else {
        alert('Failed to save order');
      }
    } catch (error) {
      console.error('Save order error:', error);
      alert('Failed to save order. Please try again.');
    }
  };

  const resetUploadForm = () => {
    if (uploadForm.preview) {
      URL.revokeObjectURL(uploadForm.preview);
    }
    setUploadForm({
      title: '',
      description: '',
      category: '',
      tags: '',
      file: null,
      preview: null
    });
  };

  const getFileUrl = (item) => {
    if (!item.file_url) return '/placeholder-image.png';
    if (item.file_url.startsWith('http')) return item.file_url;
    return `${backendUrl}${item.file_url}`;
  };

  const stats = {
    total: gallery.length,
    images: gallery.filter(g => g.file_type === 'image').length,
    videos: gallery.filter(g => g.file_type === 'video').length
  };

  return (
    <div className="gm-container">
      <div className="gm-header">
        <div className="gm-header-left">
          <h2><i className="fas fa-images"></i> Gallery Manager</h2>
          <p>Upload and manage photos and videos for your gallery</p>
        </div>
        <button 
          className="gm-btn-upload"
          onClick={() => setShowUploadModal(true)}
        >
          <i className="fas fa-cloud-upload-alt"></i> Upload New
        </button>
      </div>

      {/* Stats */}
      <div className="gm-stats-row">
        <div className="gm-stat-card">
          <i className="fas fa-folder"></i>
          <span>{stats.total} Total</span>
        </div>
        <div className="gm-stat-card">
          <i className="fas fa-image"></i>
          <span>{stats.images} Images</span>
        </div>
        <div className="gm-stat-card">
          <i className="fas fa-video"></i>
          <span>{stats.videos} Videos</span>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="gm-toolbar">
        <div className="gm-filter-group">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            disabled={isReordering}
          >
            <option value="all">All Files</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>
        
        <div className="gm-toolbar-actions">
          {isReordering ? (
            <>
              <button 
                onClick={() => { setIsReordering(false); fetchGallery(); setHasOrderChanges(false); }}
                className="gm-btn-cancel-reorder"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
              {hasOrderChanges && (
                <button onClick={saveOrder} className="gm-btn-save-order">
                  <i className="fas fa-save"></i> Save Order
                </button>
              )}
            </>
          ) : (
            <button 
              onClick={() => setIsReordering(true)}
              className="gm-btn-reorder"
            >
              <i className="fas fa-sort"></i> Reorder Items
            </button>
          )}
        </div>
      </div>

      {isReordering && (
        <div className="gm-reorder-notice">
          <i className="fas fa-info-circle"></i>
          Drag items to reorder. Click "Save Order" when done.
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="gm-loading-container">
          <div className="gm-spinner"></div>
          <p>Loading gallery...</p>
        </div>
      ) : gallery.length === 0 ? (
        <div className="gm-empty-state">
          <i className="fas fa-images"></i>
          <p>No gallery items yet</p>
          <button onClick={() => setShowUploadModal(true)}>
            <i className="fas fa-plus"></i> Upload Your First File
          </button>
        </div>
      ) : isReordering ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery-reorder" direction="horizontal">
            {(provided) => (
              <div 
                className="gm-grid gm-reordering"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {gallery.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`gm-card gm-draggable ${snapshot.isDragging ? 'gm-dragging' : ''}`}
                      >
                        <div className="gm-drag-overlay">
                          <i className="fas fa-arrows-alt"></i>
                          <span>{index + 1}</span>
                        </div>
                        {item.file_type === 'video' ? (
                          <div className="gm-video-placeholder">
                            <i className="fas fa-video"></i>
                          </div>
                        ) : (
                          <img src={getFileUrl(item)} alt={item.title} />
                        )}
                        <div className="gm-item-title">{item.title}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="gm-grid">
          {gallery.map((item) => (
            <div key={item.id} className={`gm-card ${!item.is_active ? 'gm-inactive' : ''}`}>
              {item.file_type === 'video' ? (
                <div className="gm-video-thumbnail">
                  <video src={getFileUrl(item)} />
                  <div className="gm-play-icon">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              ) : (
                <img src={getFileUrl(item)} alt={item.title} />
              )}
              
              <div className="gm-card-overlay">
                <div className="gm-item-info">
                  <h4>{item.title}</h4>
                  <span className={`gm-type-badge ${item.file_type}`}>
                    <i className={`fas fa-${item.file_type === 'video' ? 'video' : 'image'}`}></i>
                    {item.file_type}
                  </span>
                </div>
                <div className="gm-item-actions">
                  <button onClick={() => setEditingItem(item)} title="Edit">edit
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(item.id)} title="Delete" className="gm-delete">delete
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              {!item.is_active && (
                <div className="gm-inactive-badge">Hidden</div>
              )}
              
              {item.category && (
                <div className="gm-category-tag">{item.category}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="gm-modal-overlay" onClick={() => { setShowUploadModal(false); resetUploadForm(); }}>
          <div className="gm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="gm-modal-header">
              <h3><i className="fas fa-cloud-upload-alt"></i> Upload New File</h3>
              <button onClick={() => { setShowUploadModal(false); resetUploadForm(); }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="gm-upload-form">
              <div className="gm-drop-zone">
                <input 
                  type="file" 
                  id="galleryFile"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="galleryFile">
                  {uploadForm.preview ? (
                    <img src={uploadForm.preview} alt="Preview" className="gm-file-preview" />
                  ) : uploadForm.file ? (
                    <div className="gm-video-selected">
                      <i className="fas fa-video"></i>
                      <span>{uploadForm.file.name}</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Click to select or drag & drop</span>
                      <small>Images (JPG, PNG, GIF) or Videos (MP4, WebM)</small>
                    </>
                  )}
                </label>
              </div>

              <div className="gm-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  placeholder="Enter title..."
                  required
                />
              </div>

              <div className="gm-form-group">
                <label>Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  placeholder="Enter description..."
                  rows="3"
                />
              </div>

              <div className="gm-form-row">
                <div className="gm-form-group">
                  <label>Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="gm-form-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                    placeholder="Comma-separated tags..."
                  />
                </div>
              </div>

              <div className="gm-modal-footer">
                <button type="button" onClick={() => { setShowUploadModal(false); resetUploadForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="gm-btn-primary" disabled={uploading || !uploadForm.file}>
                  {uploading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                  ) : (
                    <><i className="fas fa-upload"></i> Upload</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="gm-modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="gm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="gm-modal-header">
              <h3><i className="fas fa-edit"></i> Edit Gallery Item</h3>
              <button onClick={() => setEditingItem(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="gm-upload-form">
              <div className="gm-current-file">
                {editingItem.file_type === 'video' ? (
                  <video src={getFileUrl(editingItem)} controls />
                ) : (
                  <img src={getFileUrl(editingItem)} alt={editingItem.title} />
                )}
              </div>

              <div className="gm-form-group">
                <label>Replace File (optional)</label>
                <input 
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setEditingItem({...editingItem, newFile: e.target.files[0]});
                    }
                  }}
                />
              </div>

              <div className="gm-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  required
                />
              </div>

              <div className="gm-form-group">
                <label>Description</label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="gm-form-row">
                <div className="gm-form-group">
                  <label>Category</label>
                  <select
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="gm-form-group">
                  <label>Status</label>
                  <select
                    value={editingItem.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({...editingItem, is_active: e.target.value === 'true'})}
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="gm-form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={editingItem.tags || ''}
                  onChange={(e) => setEditingItem({...editingItem, tags: e.target.value})}
                  placeholder="Comma-separated tags..."
                />
              </div>

              <div className="gm-modal-footer">
                <button type="button" onClick={() => setEditingItem(null)}>Cancel</button>
                <button type="submit" className="gm-btn-primary" disabled={uploading}>
                  {uploading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                  ) : (
                    <><i className="fas fa-save"></i> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;