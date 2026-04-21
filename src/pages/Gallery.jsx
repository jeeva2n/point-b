import React, { useState, useEffect, useCallback } from 'react';
import { API_URL, getImageUrl } from './../config/api';
import './css/Gallery.css';
import { Helmet } from 'react-helmet-async';

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

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const gallerySeoData = {
    title: "NDT Gallery | Calibration Blocks & Flawed Specimens Photos – DAKS Tools Chennai",
    description: "View DAKS Tools' NDT manufacturing gallery featuring ultrasonic calibration blocks, flawed specimens, EDM machining, and weld overlay cladding. ISO 17025 certified facility in Chennai, India.",
    keywords: "NDT gallery Chennai, ultrasonic calibration blocks photos, flawed specimens images, EDM machining gallery, NDT manufacturing facility India, DAKS Tools photo gallery, NDT equipment images, calibration standards photos",
    canonicalUrl: "https://dakstools.com/resources/gallery",
    ogImage: "https://dakstools.com/images/gallery-daks-tools.jpg"
  };

  const gallerySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": "DAKS Tools NDT Manufacturing Gallery",
        "description": gallerySeoData.description,
        "url": gallerySeoData.canonicalUrl,
        "publisher": {
          "@type": "Organization",
          "name": "DAKS Tools",
          "url": "https://dakstools.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://dakstools.com/daks.png",
            "width": "161",
            "height": "70"
          }
        },
        "mainEntity": {
          "@type": "ImageGallery",
          "name": "NDT Equipment & Manufacturing Gallery",
          "description": "Visual showcase of DAKS Tools' precision NDT calibration blocks, flawed specimens, and manufacturing processes in Chennai, India.",
          "image": mediaData.filter(item => item.type === 'photo').map(item => ({
            "@type": "ImageObject",
            "contentUrl": item.src,
            "thumbnailUrl": item.thumbnail,
            "name": item.title,
            "description": item.description,
            "keywords": item.category
          }))
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
            "name": "Resources",
            "item": "https://dakstools.com/resources"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Gallery",
            "item": "https://dakstools.com/resources/gallery"
          }
        ]
      },
      {
        "@type": "VideoGallery",
        "name": "DAKS Tools NDT Process Videos",
        "description": "Video demonstrations of DAKS Tools' NDT manufacturing processes, EDM machining, and quality control procedures.",
        "video": mediaData.filter(item => item.type === 'video').map(item => ({
          "@type": "VideoObject",
          "contentUrl": item.videoUrl,
          "thumbnailUrl": item.thumbnail,
          "name": item.title,
          "description": item.description,
          "uploadDate": new Date().toISOString().split('T')[0],
          "publisher": {
            "@type": "Organization",
            "name": "DAKS Tools"
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What can I see in the DAKS Tools gallery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The DAKS Tools gallery showcases our precision NDT manufacturing including ultrasonic calibration blocks, flawed specimens for training and validation, EDM machining processes, weld overlay cladding, and quality control procedures at our ISO 17025 certified Chennai facility."
            }
          },
          {
            "@type": "Question",
            "name": "Does DAKS Tools have videos of their manufacturing processes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, DAKS Tools' video gallery features demonstrations of our advanced CNC and EDM machining, ultrasonic calibration block manufacturing, flawed specimen creation, and precision inspection processes. Visit our Videos section to see our craftsmanship in action."
            }
          },
          {
            "@type": "Question",
            "name": "Where is the DAKS Tools manufacturing facility located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools' state-of-the-art manufacturing facility is located in Chennai, Tamil Nadu, India. Our facility features advanced CNC machines, EDM equipment, and quality control laboratories for producing ISO 17025 and ASME compliant NDT calibration standards."
            }
          }
        ]
      }
    ]
  };

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

  // Calculate photo and video counts for display
  const photoCount = mediaData.filter(item => item.type === 'photo').length;
  const videoCount = mediaData.filter(item => item.type === 'video').length;

  return (
    <>
      {/* ==========================================
          SEO - REACT HELMET COMPONENT
      ========================================== */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{gallerySeoData.title}</title>
        <meta name="description" content={gallerySeoData.description} />
        <meta name="keywords" content={gallerySeoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={gallerySeoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={gallerySeoData.canonicalUrl} />
        <meta property="og:title" content="DAKS Tools Gallery – NDT Manufacturing & Calibration Blocks" />
        <meta property="og:description" content={gallerySeoData.description} />
        <meta property="og:image" content={gallerySeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools NDT Manufacturing Gallery - Chennai Facility" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="DAKS Tools Gallery – NDT Equipment & Manufacturing" />
        <meta name="twitter:description" content={gallerySeoData.description} />
        <meta name="twitter:image" content={gallerySeoData.ogImage} />
        <meta name="twitter:image:alt" content="DAKS Tools NDT Manufacturing Gallery" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(gallerySchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="gallery-page">
        <div className="page-container">
          <header className="gallery-header">
            <div className="header-overlay">
              <h1 className="header-title">Our NDT Manufacturing Gallery</h1>
              <div className="header-divider"></div>
              <p className="header-tagline">Precision Calibration Blocks & Flawed Specimens – DAKS Tools Chennai</p>
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
                    aria-label={`View Photos (${photoCount} items)`}
                  >
                    Photos {photoCount > 0 && `(${photoCount})`}
                  </button>
                  <button
                    className={`filter-btn ${filter === 'Videos' ? 'active' : ''}`}
                    onClick={() => setFilter('Videos')}
                    aria-label={`View Videos (${videoCount} items)`}
                  >
                    Videos {videoCount > 0 && `(${videoCount})`}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={fetchGalleryData} className="retry-btn" aria-label="Retry loading gallery">Try Again</button>
                </div>
              )}

              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner" aria-label="Loading gallery"></div>
                  <p>Loading NDT manufacturing gallery...</p>
                </div>
              )}

              {!loading && !error && mediaData.length === 0 && (
                <div className="empty-state">
                  <h3>No Gallery Items Yet</h3>
                  <p>Check back soon for photos of our NDT calibration blocks and manufacturing processes.</p>
                </div>
              )}

              {!loading && !error && mediaData.length > 0 && (
                <section className="gallery-section">
                  <div className="section-header">
                    <h2>
                      {filter === 'Photos' 
                        ? '📸 NDT Industrial Imagery – Calibration Blocks & Manufacturing' 
                        : '🎥 NDT Process Videos – EDM Machining & Quality Control'}
                    </h2>
                    <p className="section-description">
                      {filter === 'Photos'
                        ? `Explore ${photoCount} high-resolution images of DAKS Tools' precision NDT calibration blocks, flawed specimens, and ISO 17025 certified manufacturing facility in Chennai, India.`
                        : `Watch ${videoCount} demonstration videos of our advanced NDT manufacturing processes including EDM machining, ultrasonic calibration, and quality assurance procedures.`}
                    </p>
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
                            alt={`${item.title} - ${item.category} | DAKS Tools NDT Gallery Chennai`}
                            onError={handleImageError}
                            loading="lazy"
                          />

                          {item.type === 'video' && (
                            <div className="play-icon-overlay" aria-label="Play video">
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
          <div className="lightbox-overlay" onClick={closeLightbox} role="dialog" aria-label="Photo lightbox">
            <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">×</button>
              {allPhotos.length > 1 && (
                <>
                  <button className="lightbox-nav lightbox-prev" onClick={() => navigatePhoto('prev')} aria-label="Previous photo">‹</button>
                  <button className="lightbox-nav lightbox-next" onClick={() => navigatePhoto('next')} aria-label="Next photo">›</button>
                </>
              )}
              <div className="lightbox-image-wrapper">
                <img src={lightboxPhoto.src} alt={`${lightboxPhoto.title} - DAKS Tools NDT Equipment`} className="lightbox-image" />
              </div>
              <div className="lightbox-caption">
                <div className="caption-content">
                  <span className="caption-category">{lightboxPhoto.category}</span>
                  <h3>{lightboxPhoto.title}</h3>
                  <p>{lightboxPhoto.description || 'Precision NDT calibration standards manufactured by DAKS Tools in Chennai, India.'}</p>
                </div>
                <div className="caption-counter">{currentPhotoIndex + 1} / {allPhotos.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* VIDEO MODAL */}
        {selectedVideo && (
          <div className="video-overlay" onClick={closeVideoModal} role="dialog" aria-label="Video player">
            <div className="video-container" onClick={(e) => e.stopPropagation()}>
              <button className="video-close" onClick={closeVideoModal} aria-label="Close video">×</button>
              <div className="video-player">
                <video 
                  src={selectedVideo.videoUrl} 
                  controls 
                  autoPlay 
                  playsInline
                  aria-label={`${selectedVideo.title} - DAKS Tools manufacturing process video`}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="video-info">
                <span className="video-category">{selectedVideo.category}</span>
                <h3>{selectedVideo.title}</h3>
                <p>{selectedVideo.description || 'DAKS Tools NDT manufacturing process demonstration from our Chennai facility.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Gallery;