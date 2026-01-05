import React, { useState, useEffect } from 'react';
import './css/Gallery.css';
import g1 from '../assets/Gallary/g1.JPG';
import g2 from '../assets/Gallary/g2.JPG';
import g3 from '../assets/Gallary/g3.JPG';
import g4 from '../assets/Gallary/g4.JPG';
import g5 from '../assets/Gallary/g5.JPG';
import g6 from '../assets/Gallary/g6.JPG';
import g7 from '../assets/Gallary/g7.jpg';
import g8 from '../assets/Gallary/g8.jpg';

// --- SAMPLE DATA ---
const mediaData = [
  // PHOTOS
  {
    id: 1,
    type: 'photo',
    category: 'Machinery',
    title: "CNC High Precision",
    description: "Automated lathe systems for micro-precision cuts.",
    src: g1
  },
  {
    id: 2,
    type: 'photo',
    category: 'Facility',
    title: "Assembly Line A",
    description: "Our primary automated assembly facility in Pune.",
    src: g2
  },
  {
    id: 3,
    type: 'photo',
    category: 'Products',
    title: "Carbide Drill Bits",
    description: "Heat-resistant tungsten carbide coatings.",
    src: g3
  },
  {
    id: 4,
    type: 'photo',
    category: 'Quality',
    title: "Laser Measurement",
    description: "Micrometer-level tolerance testing.",
    src: g4
  },
  {
    id: 5,
    type: 'photo',
    category: 'Machinery',
    title: "Heavy Duty Milling",
    description: "Industrial-grade milling operations.",
    src: g5
  },
  {
    id: 6,
    type: 'photo',
    category: 'Facility',
    title: "Production Floor",
    description: "Optimized workflow and safety-first design.",
    src: g6
  },
  {
    id: 7,
    type: 'photo',
    category: 'Products',
    title: "Precision Components",
    description: "High tolerance engineered parts.",
    src: g7
  },
  {
    id: 8,
    type: 'photo',
    category: 'Quality',
    title: "Inspection Lab",
    description: "Multi-stage quality inspection process.",
    src: g8
  },

  // VIDEOS (keep as-is)
  {
    id: 101,
    type: 'video',
    category: 'Process',
    title: "Automated Robotic Arm",
    description: "Watch our automated heavy lifting bots in action.",
    thumbnail: g1, // optional: you can also use local images here
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },

];


function Gallery() {
  const [filter, setFilter] = useState('Photos'); // Default to Photos
  const [selectedVideo, setSelectedVideo] = useState(null); // For Modal
  const [lightboxPhoto, setLightboxPhoto] = useState(null); // For Photo Lightbox
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Current photo index
  const [isAutoplay, setIsAutoplay] = useState(false); // Auto-scroll state

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
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Close Photo Lightbox
  const closeLightbox = () => {
    setLightboxPhoto(null);
    setIsAutoplay(false);
    document.body.style.overflow = 'auto';
  };

  // Navigate Photos
  const navigatePhoto = (direction) => {
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentPhotoIndex + 1) % allPhotos.length;
    } else {
      newIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
    }
    setCurrentPhotoIndex(newIndex);
    setLightboxPhoto(allPhotos[newIndex]);
  };

  // Toggle Autoplay
  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };

  // Autoplay Effect
  useEffect(() => {
    let interval;
    if (isAutoplay && lightboxPhoto) {
      interval = setInterval(() => {
        navigatePhoto('next');
      }, 3000); // Change photo every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoplay, currentPhotoIndex, lightboxPhoto]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (lightboxPhoto) {
        if (e.key === 'ArrowLeft') navigatePhoto('prev');
        if (e.key === 'ArrowRight') navigatePhoto('next');
        if (e.key === 'Escape') closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxPhoto, currentPhotoIndex]);

  // Close Modal
  const closeVideoModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="gallery-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="gallery-header">
          <div className="header-overlay">
            <h1 className="header-title">Our Gallery</h1>
            <div className="header-divider"></div>
            <p className="header-tagline">
             Precision you can see. Integrity you can trust
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="gallery-content">
          <div className="content-inner">
            
            {/* Filter Bar - Restricted to Photos and Videos */}
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

            {/* Gallery Grid Section */}
            <section className="gallery-section">
              <h2>
                {filter === 'Photos' ? 'Industrial Imagery' : 'Process Videos'}
              </h2>
              <p>
                {filter === 'Photos' 
                  ? "High-resolution captures of our machinery, products, and facilities." 
                  : "In-depth video tours and operational footage of our manufacturing processes."}
              </p>
              
              <div className="gallery-grid">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`gallery-card ${item.type === 'video' ? 'video-card' : 'photo-card'}`}
                    onClick={item.type === 'video' ? () => handleVideoClick(item) : () => handlePhotoClick(item)}
                  >
                    <div className="image-wrapper">
                      <img src={item.type === 'photo' ? item.src : item.thumbnail} alt={item.title} />
                      
                      {/* Video Play Overlay */}
                      {item.type === 'video' && (
                        <div className="play-icon-overlay">
                          <div className="play-button">▶</div>
                        </div>
                      )}

                      <div className="image-overlay">
                        <span className="category-tag">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="no-results">
                  <p>No {filter.toLowerCase()} available at the moment.</p>
                </div>
              )}
            </section>

          </div>
        </main>
      </div>

      {/* PHOTO LIGHTBOX */}
      {lightboxPhoto && (
        <div className="photo-lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Navigation Arrows */}
            <button className="nav-arrow left-arrow" onClick={() => navigatePhoto('prev')}>
              ‹
            </button>
            <button className="nav-arrow right-arrow" onClick={() => navigatePhoto('next')}>
              ›
            </button>

            {/* Image */}
            <img 
              src={lightboxPhoto.src} 
              alt={lightboxPhoto.title}
              className="lightbox-image"
            />

            {/* Caption */}
            <div className="lightbox-caption">
              <h3>{lightboxPhoto.title}</h3>
              <p>{lightboxPhoto.description}</p>
              <span className="counter">{currentPhotoIndex + 1} / {allPhotos.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL (Full Screen) */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeVideoModal}>×</button>
            <div className="video-wrapper">
              <video 
                src={selectedVideo.videoUrl} 
                controls 
                autoPlay 
                className="full-screen-video"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="modal-info">
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
