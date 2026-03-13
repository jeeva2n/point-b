import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';
import ep1 from '../assets/primary/ep1.jpg';
import ep3 from '../assets/primary/blocks camera visual QUALITY.mp4';
import ep4 from '../assets/primary/1.mp4';
import ep2 from '../assets/primary/ep2.webp';
import q1 from '../assets/primary/q1.jpeg';
import q4 from '../assets/primary/q4.jpg';
import Chatbot from '../components/Chatbot';

const Home = () => {
  // ... [Keep all existing state and logic as is] ...
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeTextIndex, setActiveTextIndex] = useState(null);
  const [cardImageIndices, setCardImageIndices] = useState([0, 0, 0, 0]);
  const [isAnimating, setIsAnimating] = useState([false, false, false, false]);
  const [progressActive, setProgressActive] = useState([false, false, false, false]);
  const [textCoversVisible, setTextCoversVisible] = useState([true, true, true, true]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const isMounted = useRef(true);
  const animationTimeouts = useRef([]);
  const navigate = useNavigate();

  // ... [Keep all existing useEffects and functions as is] ...

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

    return () => {
      document.body.classList.remove('home-page');
      isMounted.current = false;
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      animationTimeouts.current = [];
    };
  }, []);

  const handleCardClick = (index) => {
    if (isMobile) {
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

  const cardImageSets = [
    [ep1, ep2, q1, q4],
    [ep2, q1, q4, ep1],
    [q1, q4, ep1, ep2],
    [q4, ep1, ep2, q1],
  ];

  const cardLetters = ['D', 'A', 'K', 'S'];
  const initialDelays = [1000, 1500, 2000, 2500];
  const rotationInterval = 5000;

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

  const animateCard = (cardIndex) => {
    if (!isMounted.current) return;

    setProgressActive(prev => {
      const newState = [...prev];
      newState[cardIndex] = false;
      return newState;
    });

    setIsAnimating(prev => {
      const newState = [...prev];
      newState[cardIndex] = true;
      return newState;
    });

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
    }, 600);

    animationTimeouts.current.push(animationTimeout);
  };

  useEffect(() => {
    const intervalRefs = [];
    const timeoutRefs = [];

    for (let i = 0; i < 4; i++) {
      const initialTimeout = setTimeout(() => {
        if (!isMounted.current) return;

        setProgressActive(prev => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        });

        animateCard(i);

        const interval = setInterval(() => {
          animateCard(i);
        }, rotationInterval);

        intervalRefs.push(interval);
      }, initialDelays[i]);

      timeoutRefs.push(initialTimeout);
    }

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

              <div className="progress-bar">
                <div
                  className={`progress-fill ${progressActive[index] && !isAnimating[index] ? 'active' : ''}`}
                  key={`progress-${cardImageIndices[index]}-${index}`}
                ></div>
              </div>

              <div className="card-image-wrapper">
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

        {/* Company Overview Section */}
        <section className="company-overview">
          <div className="overview-container">
            <h2 className="overview-title">900 employees, one promise</h2>
            <p className="overview-subtitle">We give our all to deliver to you</p>
            <p className="overview-description">
              We are as diverse as our target groups. More than one hundred years ago, we revolutionized
              German brush production; today, we are a globally active technology company with a broad
              focus, offering the perfect solution for all your demands.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="values-container">
            <div className="value-card">
              <div className="value-header">State-of-the-art technology</div>
              <div className="value-content">
                <div className="value-logo">D</div>
                <h3 className="value-title">Passion for<br />perfection</h3>
                <div className="value-divider"></div>
                <p className="value-description">
                  With our passion for perfection, we guarantee reliable precision technology,
                  offering our customers that vital innovative edge in daily competition.
                </p>
                <button className="value-button">Read more &gt;</button>
              </div>
            </div>

            <div className="value-card">
              <div className="value-header">Part of a family</div>
              <div className="value-content">
                <div className="value-logo">A</div>
                <h3 className="value-title">Passion for<br />cooperation</h3>
                <div className="value-divider"></div>
                <p className="value-description">
                  Respectful interactions with customers, business partners, and employees – at
                  eye level – creates trust as well as long-lasting, personal, and close relationships.
                </p>
                <button className="value-button">Read more &gt;</button>
              </div>
            </div>

            <div className="value-card">
              <div className="value-header">Corporate philosophy</div>
              <div className="value-content">
                <div className="value-logo">KS</div>
                <h3 className="value-title">Passion for<br />responsibility</h3>
                <div className="value-divider"></div>
                <p className="value-description">
                  We are a future-proof partner and employer, thanks to our forward-looking
                  and responsible business insight.
                </p>
                <button className="value-button">Read more &gt;</button>
              </div>
            </div>
          </div>
        </section>

        {/* Expedition Section */}

        <section className="expedition-section">
          <div className="expedition-container">
            <div className="expedition-content">
              <h2 className="expedition-title">Expedition D</h2>
              <h3 className="expedition-subtitle">Discover your excellence</h3>
              <p className="expedition-description">
                Follow your journey into the world of DAKS innovations.
                Discover uncharted territory in NDT production. Simply start exploring and
                navigate through all our highlights.
              </p>
              <button className="expedition-button">
                <span>&gt;&gt; discover Expedition D</span>
              </button>
            </div>
            <div className="expedition-visual">
              <div className="visual-box">
                <span className="visual-text">D</span>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Section - CENTER ALIGNED */}
        <section className="heritage-section">
          <div className="heritage-container">
            <h2 className="heritage-title">Black Forest</h2>
            <h3 className="heritage-subtitle">At home in the world, rooted in the Black Forest</h3>
            <p className="heritage-description">
              The Black Forest is renowned across the globe for the fairytales of the Brothers Grimm,
              the <em>Bollenhut</em>, traditional clothing such as dirndls, cuckoo clocks... and of course for the
              pioneers in brush production. Americans, Swiss, Brits, Chinese, Indians, Arabs – they
              might all love its green pines, delightful mountain panoramas, and lush-green meadows.
              But above all they love the German engineering spirit at DAKS.
            </p>
          </div>
        </section>

        {/* Quality Section - LEFT IMAGE, RIGHT TEXT (REVERSED) */}
        <section className="quality-section">
          <div className="quality-container">
            <div className="quality-visual">
              <div className="image-placeholder">
                {/* Add your image here */}
                <img src={ep3} alt="Quality" />
              </div>
            </div>
            <div className="quality-content">
              <h2 className="quality-title">Black Forest Quality</h2>
              <h3 className="quality-subtitle">Guaranteed quality, 4,000 successful companies around the world</h3>
              <p className="quality-description">
                More than 100 years ago, Black Forest-based DAKS developed the first brush,
                drill, and tuft machine – and brought forth a new era in brush production. From these
                beginnings developed an internationally active full-range supplier in machine construction,
                injection molding, and automation technology. A lot has changed since then, but our
                pledge to always deliver quality remains. We are driven by much more than just solid
                German Engineering and concentrated innovative force. We are passionate and strive for
                perfection in developing solutions to meet the most discerning demands, with heart, soul,
                and perseverance. Our solutions do exactly what we promise.
              </p>
            </div>
          </div>
        </section>

        {/* Film Section - LEFT TEXT, RIGHT VIDEO */}
        {/* Film Section - LEFT TEXT, RIGHT VIDEO */}
        <section className="film-section">
          <div className="film-container">
            <div className="film-content">
              <h2 className="film-title">Our pleasure, DAKS</h2>
              <h3 className="film-subtitle">The film</h3>
              <p className="film-description">
                We created our company film – "Our pleasure, DAKS" – to offer you a vivid representation
                of our modern company, which revolutionized German brush production over a century
                ago. Our employees are crucial to our success, which is why we place them front and
                center in our film. They are people who implement our customers' projects with creative
                input that extends far beyond the brush industry alone.
              </p>
            </div>

            <div className="film-video">
              <div className="video-wrapper">

                <video
                  className="film-video-player"
                  autoPlay
                  muted
                  loop
                  controls
                  playsInline
                >
                  <source src={ep4} type="video/mp4" />
                </video>

                <div className="video-overlay-text">
                  <span className="video-brand">DAKS</span>
                  <span className="video-tagline">Feel Different</span>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 360 Tour Section - CENTER ALIGNED */}
        <section className="tour-section">
          <div className="tour-container">
            <h2 className="tour-title">360 degree tour</h2>
            <p className="tour-description">
              DAKS not only offers 360° service, but also 360° tours. Go on safari and discover
              our state-of-the-art facilities and innovative solutions.
            </p>
          </div>
        </section>
        {/* Text Introduction Section */}
        <section className="zahos-intro">
          <div className="intro-container">
            <h1 className="intro-main-title">We are #TheDAKSTOOLS</h1>
            <h2 className="intro-sub-title">Customer and business partner interaction at eye level</h2>
            <p className="intro-body-text">
              We know that we are not perfect. But we are "PERFECTLY DIFFERENT". This is why we invest in
              human relationships that reach beyond only assisting our customers and business partners. We
              involve rather than care for, we strive for happiness rather than satisfaction.
            </p>
          </div>
        </section>

        {/* Team Gallery Section - No Top Margin/Padding */}
        {/* Team Gallery Section - No Top Margin/Padding */}
        <section className="team-gallery-section">
          <div className="team-grid">
            {[
              { name: "Aavind", role: "DAKS do Brazil" },
              { name: "Kumar", role: "Quality Engineering" },
              { name: "Bharath", role: "Lead Developer" },
              { name: "Aavind", role: "Project Manager" },
              { name: "Aavind", role: "Technical Sales" },
              { name: "Aavind", role: "Customer Support" },
              { name: "Aavind", role: "Logistics Manager" },
            ].map((member, i) => (
              <div key={i} className="team-column">

                <video
                  className="team-img"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={ep3} type="video/mp4" />
                </video>

                <div className="play-button-overlay">
                  <div className="play-circle">
                    <div className="play-triangle"></div>
                  </div>
                </div>

                <div className="member-hover-info">
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-role">{member.role}</p>
                </div>

              </div>
            ))}
          </div>
        </section>
      </div>
      <Chatbot />
    </div>
  );
};

export default Home;
