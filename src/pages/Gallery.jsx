import React, { useState, useEffect, useCallback } from 'react';
import { API_URL, getImageUrl } from './../config/api';
import './css/Gallery.css';

function Gallery() {
  // State for data
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [filter, setFilter] = useState('Photos');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Fetch gallery data from backend
  const fetchGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/gallery`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.gallery) {
        // Transform backend data to match our UI format
        const transformedData = data.gallery.map(item => {
          const isVideo = item.file_type === 'video';
          
          // Logic for Thumbnails:
          // 1. If user uploaded a thumbnail_url, use it.
          // 2. If it's a photo, use the file_url.
          // 3. If it's a video without a thumbnail, use a placeholder image.
          let thumbnailSrc;
          if (item.thumbnail_url) {
            thumbnailSrc = getImageUrl(item.thumbnail_url);
          } else if (!isVideo) {
            thumbnailSrc = getImageUrl(item.file_url);
          } else {
            // Fallback for videos without thumbnails
            thumbnailSrc = '/images/video-placeholder.jpg'; 
          }

          return {
            id: item.id,
            type: isVideo ? 'video' : 'photo',
            category: item.category || 'General',
            title: item.title || 'Untitled',
            description: item.description || '',
            // src is only for the Photo Lightbox
            src: !isVideo ? getImageUrl(item.file_url) : null,
            thumbnail: thumbnailSrc,
            videoUrl: isVideo ? getImageUrl(item.file_url) : null
          };
        });

        setMediaData(transformedData);
      } else {
        setMediaData([]);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Failed to load gallery. Please try again later.');
      setMediaData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  // Get all photos for navigation
  const allPhotos = mediaData.filter(item => item.type === 'photo');

  // Filter Logic
  const filteredItems = mediaData.filter(item =>
    filter === 'Photos' ? item.type === 'photo' : item.type === 'video'
  );

  // Handle Photo Click
  const handlePhotoClick = (photoItem) => {
    const photoIndex = allPhotos.findIndex(photo => photo.id === photoItem.id);
    setCurrentPhotoIndex(photoIndex);
    setLightboxPhoto(photoItem);
    document.body.style.overflow = 'hidden';
  };

  // Handle Video Click
  const handleVideoClick = (videoItem) => {
    setSelectedVideo(videoItem);
    document.body.style.overflow = 'hidden';
  };

  // Close Photo Lightbox
  const closeLightbox = () => {
    setLightboxPhoto(null);
    document.body.style.overflow = 'auto';
  };

  // Navigate Photos
  const navigatePhoto = useCallback((direction) => {
    if (allPhotos.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentPhotoIndex + 1) % allPhotos.length;
    } else {
      newIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
    }
    setCurrentPhotoIndex(newIndex);
    setLightboxPhoto(allPhotos[newIndex]);
  }, [currentPhotoIndex, allPhotos]);

  // Close Video Modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (lightboxPhoto) {
        if (e.key === 'ArrowLeft') navigatePhoto('prev');
        if (e.key === 'ArrowRight') navigatePhoto('next');
        if (e.key === 'Escape') closeLightbox();
      }
      if (selectedVideo && e.key === 'Escape') {
        closeVideoModal();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxPhoto, selectedVideo, navigatePhoto]);

  // Handle image loading error
  const handleImageError = (e) => {
    // If a thumbnail fails, show a generic placeholder
    e.target.src = "/images/placeholder.jpg";
  };

  return (
    <div className="gallery-page">
      <div className="page-container">
        <header className="gallery-header">
          <div className="header-overlay">
            <h1 className="header-title">Our Gallery</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">Precision you can see. Integrity you can trust</p>
          </div>
        </header>

        <main className="gallery-content">
          <div className="content-inner">
            <div className="filter-container">
              <span className="filter-label">View Mode:</span>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === 'Photos' ? 'active' : ''}`}
                  onClick={() => setFilter('Photos')}
                >
                  Photos
                </button>
                <button
                  className={`filter-btn ${filter === 'Videos' ? 'active' : ''}`}
                  onClick={() => setFilter('Videos')}
                >
                  Videos
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchGalleryData} className="retry-btn">Try Again</button>
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading gallery...</p>
              </div>
            )}

            {!loading && !error && mediaData.length === 0 && (
              <div className="empty-state">
                <h3>No Gallery Items Yet</h3>
              </div>
            )}

            {!loading && !error && mediaData.length > 0 && (
              <section className="gallery-section">
                <div className="section-header">
                  <h2>{filter === 'Photos' ? ' Industrial Imagery' : ' Process Videos'}</h2>
                </div>

                <div className="gallery-grid">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`gallery-card ${item.type === 'video' ? 'video-card' : 'photo-card'}`}
                      onClick={item.type === 'video' ? () => handleVideoClick(item) : () => handlePhotoClick(item)}
                    >
                      <div className="image-wrapper">
                        {/* 
                          CRITICAL FIX: 
                          For videos, we use the thumbnail (which is an image). 
                          We NEVER put the videoUrl into an <img> tag.
                        */}
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          onError={handleImageError}
                          loading="lazy"
                        />

                        {item.type === 'video' && (
                          <div className="play-icon-overlay">
                            <div className="play-button"><span>▶</span></div>
                          </div>
                        )}

                        <div className="card-overlay">
                          <div className="overlay-content">
                            <span className="category-tag">{item.category}</span>
                            <h4 className="card-title">{item.title}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* PHOTO LIGHTBOX */}
      {lightboxPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            {allPhotos.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-prev" onClick={() => navigatePhoto('prev')}>‹</button>
                <button className="lightbox-nav lightbox-next" onClick={() => navigatePhoto('next')}>›</button>
              </>
            )}
            <div className="lightbox-image-wrapper">
              <img src={lightboxPhoto.src} alt={lightboxPhoto.title} className="lightbox-image" />
            </div>
            <div className="lightbox-caption">
              <div className="caption-content">
                <span className="caption-category">{lightboxPhoto.category}</span>
                <h3>{lightboxPhoto.title}</h3>
                <p>{lightboxPhoto.description}</p>
              </div>
              <div className="caption-counter">{currentPhotoIndex + 1} / {allPhotos.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div className="video-overlay" onClick={closeVideoModal}>
          <div className="video-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" onClick={closeVideoModal}>×</button>
            <div className="video-player">
              <video src={selectedVideo.videoUrl} controls autoPlay playsInline>
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video-info">
              <span className="video-category">{selectedVideo.category}</span>
              <h3>{selectedVideo.title}</h3>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;