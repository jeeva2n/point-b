import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';
import ep1 from '../assets/primary/ep1.jpg';
import ep2 from '../assets/primary/ep2.webp';
import q1 from '../assets/primary/q1.jpeg';
import q4 from '../assets/primary/q4.jpg';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null); // NEW: For mobile touch
  const [activeTextIndex, setActiveTextIndex] = useState(null);

  // State for image rotation - now per card
  const [cardImageIndices, setCardImageIndices] = useState([0, 0, 0, 0]);
  const [isAnimating, setIsAnimating] = useState([false, false, false, false]);
  const [progressActive, setProgressActive] = useState([false, false, false, false]);

  const [textCoversVisible, setTextCoversVisible] = useState([true, true, true, true]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false); // NEW: Check if mobile
  
  // Ref to track mounted state
  const isMounted = useRef(true);
  const animationTimeouts = useRef([]);

  const navigate = useNavigate();

  // NEW: Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    document.body.classList.add('home-page');
    isMounted.current = true;
    
    // Clear all timeouts on unmount
    return () => {
      document.body.classList.remove('home-page');
      isMounted.current = false;
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      animationTimeouts.current = [];
    };
  }, []);

  // NEW: Handle card click/tap for mobile
  const handleCardClick = (index) => {
    if (isMobile) {
      // Toggle expanded state on mobile
      if (expandedIndex === index) {
        setExpandedIndex(null);
      } else {
        setExpandedIndex(index);
      }
    }
  };

  const handleReadMoreClick = (index, e) => {
    e.stopPropagation();
    if (activeTextIndex === index) {
      setActiveTextIndex(null);
    } else {
      setActiveTextIndex(index);
    }
  };

  const handleMouseEnter = (index) => {
    if (!isMobile) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoveredIndex(null);
      setActiveTextIndex(null);
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseMove = (e, index) => {
    if (!isMobile && hoveredIndex === index) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
      });
    }
  };

  // Define multiple images for each card (4 images per card)
  const cardImageSets = [
    [ep1, ep2, q1, q4], // Card 1 images
    [ep2, q1, q4, ep1], // Card 2 images
    [q1, q4, ep1, ep2], // Card 3 images
    [q4, ep1, ep2, q1], // Card 4 images
  ];

  const cardLetters = ['D', 'A', 'K', 'S'];

  // Staggered delays for each card: 1s, 1.5s, 2s, 2.5s
  const initialDelays = [1000, 1500, 2000, 2500];
  const rotationInterval = 5000; // 5 seconds cycle

  // Auto-hide text covers with smooth stagger
  useEffect(() => {
    const timers = [];
    const delays = [200, 400, 600, 800];

    for (let i = 0; i < 4; i++) {
      const timer = setTimeout(() => {
        if (isMounted.current) {
          setTextCoversVisible(prev => {
            const newVisible = [...prev];
            newVisible[i] = false;
            return newVisible;
          });
        }
      }, delays[i]);
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Function to animate a single card
  const animateCard = (cardIndex) => {
    if (!isMounted.current) return;

    // Reset progress bar for this card
    setProgressActive(prev => {
      const newState = [...prev];
      newState[cardIndex] = false;
      return newState;
    });

    // Start animation for this card
    setIsAnimating(prev => {
      const newState = [...prev];
      newState[cardIndex] = true;
      return newState;
    });

    // After animation completes, update image index
    const animationTimeout = setTimeout(() => {
      if (!isMounted.current) return;
      
      setCardImageIndices(prev => {
        const newIndices = [...prev];
        newIndices[cardIndex] = (prev[cardIndex] + 1) % cardImageSets[cardIndex].length;
        return newIndices;
      });

      setIsAnimating(prev => {
        const newState = [...prev];
        newState[cardIndex] = false;
        return newState;
      });

      // Restart progress bar after a small delay
      const progressTimeout = setTimeout(() => {
        if (isMounted.current) {
          setProgressActive(prev => {
            const newState = [...prev];
            newState[cardIndex] = true;
            return newState;
          });
        }
      }, 100);
      
      animationTimeouts.current.push(progressTimeout);
    }, 600); // Match CSS animation duration

    animationTimeouts.current.push(animationTimeout);
  };

  // Staggered auto image rotation effect
  useEffect(() => {
    const intervalRefs = [];
    const timeoutRefs = [];

    // Start each card's rotation with staggered initial delay
    for (let i = 0; i < 4; i++) {
      // Initial delay before first rotation
      const initialTimeout = setTimeout(() => {
        if (!isMounted.current) return;
        
        // Activate progress bar initially
        setProgressActive(prev => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        });

        // First rotation after initial delay
        animateCard(i);

        // Then continue rotating at regular intervals
        const interval = setInterval(() => {
          animateCard(i);
        }, rotationInterval);
        
        intervalRefs.push(interval);
      }, initialDelays[i]);

      timeoutRefs.push(initialTimeout);
    }

    // Clean up
    return () => {
      timeoutRefs.forEach(timeout => clearTimeout(timeout));
      intervalRefs.forEach(interval => clearInterval(interval));
    };
  }, []);

  const cards = [
    {
      id: 1,
      title: "Our",
      subtitle: "precision ",
      subtitle2: "manufacture",
      description: "Our manufacturing combines advanced machining, expert flaw engineering, and rigorous inspection to deliver world-class reference standards and flawed specimens.",
      features: ["ISO Certified", "Quality Assured", "Fast Delivery"]
    },
    {
      id: 2,
      title: "We",
      subtitle: "analyze",
      subtitle2: "the quality ",
      description: "Our commitment to quality is embedded in every step—design, machining, flaw engineering, inspection, and certification.",
      features: ["Custom Blocks", "Traceability", "Certification"]
    },
    {
      id: 3,
      title: "Specific",
      subtitle: "Applications",
      subtitle2: "customs",
      description: "For specialised NDT applications, we design and manufacture customised blocks that align with your inspection parameters.",
      features: ["Precision Cut", "Advanced Testing", "Documentation"]
    },
    {
      id: 4,
      title: "Who",
      subtitle: "We",
      subtitle2: "are",
      description: "Proven excellence through client experience. We deliver quality NDT solutions worldwide.",
      features: ["Expert Team", "Innovation", "Support"]
    },
  ];

  // Determine if card should show expanded state
  const isCardExpanded = (index) => {
    if (isMobile) {
      return expandedIndex === index;
    }
    return hoveredIndex === index;
  };

  const isCardCollapsed = (index) => {
    if (isMobile) {
      return expandedIndex !== null && expandedIndex !== index;
    }
    return hoveredIndex !== null && hoveredIndex !== index;
  };

  return (
    <div className="home-container">
      <div className="home-wrapper">
        <div className="cards-wrapper">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`card ${isCardExpanded(index) ? 'expanded' : ''} ${isCardCollapsed(index) ? 'collapsed' : ''}`}
              style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`
              }}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              <div className="card-border-animation"></div>

              <div className={`card-text-cover ${!textCoversVisible[index] ? 'slide-away' : ''}`}>
                <div className="card-letter-container">
                  <div className="card-letter">
                    {cardLetters[index]}
                  </div>
                </div>
              </div>

              {/* Progress Bar - now per card */}
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${progressActive[index] && !isAnimating[index] ? 'active' : ''}`}
                  key={`progress-${cardImageIndices[index]}-${index}`}
                ></div>
              </div>

              <div className="card-image-wrapper">
                {/* Current Image - with animation class */}
                <img
                  src={cardImageSets[index][cardImageIndices[index]]}
                  alt={card.title}
                  className={`card-image ${isAnimating[index] ? 'changing' : ''}`}
                />

                <div className="card-overlay"></div>
              </div>

              <div className="card-content">
                <div className="card-text-background"></div>

                <h1 className={`card-title gradient-text ${index === 0 ? 'gradient-green' :
                  index === 1 ? 'gradient-red' :
                    index === 2 ? 'gradient-purple' :
                      'gradient-blue'
                  }`}>
                  {card.title}
                </h1>

                <div className="card-subtitle-container">
                  <h2
                    className={`card-subtitle gradient-text ${index === 0 ? 'gradient-green' :
                        index === 1 ? 'gradient-red' :
                          index === 2 ? 'gradient-purple' :
                            'gradient-blue'
                      }`}
                  >
                    {card.subtitle}
                  </h2>

                  {card.subtitle2 && (
                    <h2
                      className={`card-subtitle2 gradient-text ${index === 0 ? 'gradient-green' :
                          index === 1 ? 'gradient-red' :
                            index === 2 ? 'gradient-purple' :
                              'gradient-blue'
                        }`}
                    >
                      {card.subtitle2}
                    </h2>
                  )}
                </div>

                {/* Details section - shows on hover (desktop) or tap (mobile) */}
                <div className="card-details">
                  <p className="card-description">{card.description}</p>

                  <div className="feature-tags">
                    {card.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="card-buttons">
                    <button
                      className="card-button primary-btn"
                      onClick={(e) => handleReadMoreClick(index, e)}
                    >
                      <span>{activeTextIndex === index ? "Read Less" : "Read More"}</span>
                    </button>
                  </div>

                  {activeTextIndex === index && (
                    <div className="extra-content">
                      <p className="extra-text">
                        Discover our comprehensive range of NDT solutions tailored to your needs.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default Home;