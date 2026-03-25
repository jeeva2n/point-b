import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './css/Home.css';
import ep1 from '../assets/primary/ep1.jpg';
const ep3 = "https://dakstools.com/uploads/videos/blocks-camera.mp4";
const ep4 = "https://dakstools.com/uploads/videos/video2.mp4";
import ep2 from '../assets/primary/ep2.jpg';
import q1 from '../assets/primary/q1.jpg';
import q2 from '../assets/primary/q2.png';
import q4 from '../assets/primary/q4.jpg';
import Chatbot from '../components/Chatbot';
import { Link } from "react-router-dom";

/* ─── tiny hook: fires once an element scrolls into view ─── */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, isVisible]);

  return [ref, isVisible];
};

/* ─── magnetic tilt for value cards ─── */
const useTilt = (intensity = 8) => {
  const ref = useRef(null);
  const frameRef = useRef();

  const handleMove = useCallback((e) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * intensity;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -intensity;
      el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
    });
  }, [intensity]);

  const handleLeave = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  }, []);

  return { ref, handleMove, handleLeave };
};

// Memoized static data
const CARD_IMAGE_SETS = [
  [ep1, ep2, q1, q4, q2],
  [ep2, q1, q4, q2, ep1],
  [q1, q4, q2, ep1, ep2],
  [q4, q2, ep1, ep2, q1],
];

const CARD_LETTERS = ['D', 'A', 'K', 'S'];

const TESTIMONIALS = [
  {
    quote: "The precision of their ultrasonic reference blocks is exceptional. We've reduced our calibration uncertainty by 40% since switching to NDT Tools.",
    author: "Dr. Michael Chen",
    position: "NDT Manager • Global Aerospace Industries"
  },
  {
    quote: "Custom flaw specimens that exactly match our real-world inspection challenges. These standards have revolutionized our technician training programs.",
    author: "Sarah Williams",
    position: "Senior NDT Level III • Energy Sector"
  },
  {
    quote: "ISO 17025 accreditation means nothing without consistent quality. NDT Tools delivers both — every time, without exception.",
    author: "James Rodriguez",
    position: "Quality Assurance Director • Marine Engineering"
  }
];

const CARDS = [
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

const NEWS_ITEMS = [
  {
    date: "15. March 2026",
    title: "New ASME Section V compliant ultrasonic calibration blocks released",
    description: "Our latest series of ultrasonic reference blocks sets new standards for accuracy in weld inspection and thickness gauging applications.",
    image: ep1
  },
  {
    date: "28. February 2026",
    title: "Expanding NDT capabilities: New eddy current standards lab",
    description: "Dedicated facility for manufacturing custom eddy current reference standards now operational, supporting aerospace and automotive clients.",
    image: ep2
  },
  {
    date: "10. January 2026",
    title: "Advancing radiographic inspection with digital reference radiographs",
    description: "Collaborative research project with leading NDT institutes yields new digital reference libraries for weld discontinuity classification.",
    image: q1
  },
  {
    date: "05. December 2025",
    title: "Global NDT certification partnership announced",
    description: "Strategic alliance with major certification bodies streamlines access to ASNT and PCN Level III training materials and reference standards.",
    image: q4
  }
];

const VALUE_CARDS = [
  {
    header: 'NDT Excellence',
    logo: 'Q',
    title: <>Uncompromising<br />Quality</>,
    desc: 'Every reference standard undergoes rigorous multi-stage inspection, ensuring flawless performance in critical aerospace, energy, and infrastructure applications.'
  },
  {
    header: 'Precision Engineering',
    logo: 'M',
    title: <>Micron-Level<br />Accuracy</>,
    desc: 'Our advanced 5-axis CNC machining centers deliver flaw simulations with tolerances of ±0.01mm, creating the most realistic NDT reference standards in the industry.'
  },
  {
    header: 'Innovation Hub',
    logo: 'R&D',
    title: <>Continuous<br />Innovation</>,
    desc: 'Our dedicated R&D team pioneers next-generation ultrasonic, eddy current, and radiographic reference standards, keeping our clients ahead of industry requirements.'
  }
];

const TEAM_MEMBERS = [
  {
    name: "Dr. Chen & Santos",
    fullName: "Dr. James Chen & Maria Santos",
    role: "NDT Research & Development",
    quote: "Every flaw we engineer teaches inspectors what to look for. Our precision creates their expertise.",
    video: ep3,
    thumbnail: ep1
  },
  {
    name: "Robert Nakamura",
    fullName: "Robert Nakamura",
    role: "Senior NDT Engineer",
    quote: "A 0.1mm flaw can mean the difference between safety and catastrophe. We make sure you find it.",
    video: ep4,
    thumbnail: ep2
  },
  {
    name: "Dr. Anna Weber",
    fullName: "Dr. Anna Weber",
    role: "Ultrasonic Standards Specialist",
    quote: "The echoes don't lie — but only if your reference standards are true.",
    video: ep3,
    thumbnail: q1
  },
  {
    name: "Michael Thornton",
    fullName: "Michael Thornton",
    role: "Aerospace NDT Solutions",
    quote: "From turbine blades to landing gear, our standards ensure nothing goes unnoticed.",
    video: ep4,
    thumbnail: q4
  },
  {
    name: "Sarah & David",
    fullName: "Sarah & David Chen",
    role: "Radiographic Standards Team",
    quote: "Seeing through metal is our expertise. Creating the right shadows is our craft.",
    video: ep3,
    thumbnail: ep1
  },
  {
    name: "Elena Volkov",
    fullName: "Elena Volkov",
    role: "Eddy Current Specialist",
    quote: "Surface or subsurface, our standards reveal what others miss.",
    video: ep4,
    thumbnail: ep2
  },
  {
    name: "Dr. Raj Patel",
    fullName: "Dr. Raj Patel",
    role: "Quality Systems Director",
    quote: "ISO 17025 isn't just a certification — it's our promise to you.",
    video: ep3,
    thumbnail: q1
  }
];

const Home = () => {
  // Group related state
  const [cardStates, setCardStates] = useState({
    hoveredIndex: null,
    expandedIndex: null,
    activeTextIndex: null,
    cardImageIndices: [0, 0, 0, 0],
    isAnimating: [false, false, false, false],
    progressActive: [false, false, false, false],
    textCoversVisible: [true, true, true, true]
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  // New state to track if detail section is visible
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  
  const [selectedMember, setSelectedMember] = useState({
    fullName: "Dr. James Chen & Maria Santos",
    name: "Dr. Chen & Santos",
    role: "NDT Research & Development",
    quote: "Every flaw we engineer teaches inspectors what to look for. Our precision creates their expertise.",
    video: ep3,
    thumbnail: ep1
  });

  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const detailVideoRef = useRef(null);
  const teamVideoRefs = useRef([]);
  const isMounted = useRef(true);
  const animationTimeouts = useRef([]);
  const imageRotationIntervals = useRef([]);

  // Optimize scroll reveal
  const sectionRefs = {
    overview: useScrollReveal({ threshold: 0.2 }),
    values: useScrollReveal({ threshold: 0.15 }),
    expedition: useScrollReveal({ threshold: 0.2 }),
    heritage: useScrollReveal({ threshold: 0.2 }),
    quality: useScrollReveal({ threshold: 0.15 }),
    film: useScrollReveal({ threshold: 0.15 }),
    tour: useScrollReveal({ threshold: 0.2 }),
    intro1: useScrollReveal({ threshold: 0.2 }),
    team: useScrollReveal({ threshold: 0.1 }),
    intro2: useScrollReveal({ threshold: 0.2 }),
    news: useScrollReveal({ threshold: 0.1 }),
    intro3: useScrollReveal({ threshold: 0.2 }),
    testimonial: useScrollReveal({ threshold: 0.15 }),
    memberDetail: useScrollReveal({ threshold: 0.1 })
  };

  // Tilt hooks
  const tilt1 = useTilt(6);
  const tilt2 = useTilt(6);
  const tilt3 = useTilt(6);

  const updateCardState = useCallback((key, value) => {
    setCardStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePauseToggle = useCallback(() => {
    if (detailVideoRef.current) {
      if (isVideoPaused) {
        detailVideoRef.current.play();
      } else {
        detailVideoRef.current.pause();
      }
      setIsVideoPaused(!isVideoPaused);
    }
  }, [isVideoPaused]);

  // Modified handleMemberSelect to show detail section
  const handleMemberSelect = useCallback((member, index) => {
    setSelectedMember(member);
    setIsVideoPaused(false);
    setShowMemberDetail(true); // Show the detail section when a member is clicked

    teamVideoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, []);

  // Replace the fullTitle variable
  const fullTitle = 'Precision beyond measure, quality beyond compromise';
  useEffect(() => {
    if (!sectionRefs.overview[1]) return;

    let i = 0;
    setTypedText('');
    const interval = setInterval(() => {
      if (i < fullTitle.length) {
        setTypedText(fullTitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
     }, 45);

    return () => clearInterval(interval);
  }, [sectionRefs.overview[1]]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Mobile detection
  useEffect(() => {
    let timeout;
    const checkMobile = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeout);
    };
  }, []);

  // Initial setup
  useEffect(() => {
    document.body.classList.add('home-page');
    isMounted.current = true;

    const delays = [200, 400, 600, 800];
    const timers = delays.map((delay, i) =>
      setTimeout(() => {
        if (isMounted.current) {
          setCardStates(prev => {
            const newVisible = [...prev.textCoversVisible];
            newVisible[i] = false;
            return { ...prev, textCoversVisible: newVisible };
          });
        }
      }, delay)
    );

    return () => {
      document.body.classList.remove('home-page');
      isMounted.current = false;
      timers.forEach(clearTimeout);
      animationTimeouts.current.forEach(clearTimeout);
      imageRotationIntervals.current.forEach(clearInterval);
    };
  }, []);

  const animateCard = useCallback((cardIndex) => {
    if (!isMounted.current) return;

    setCardStates(prev => ({
      ...prev,
      progressActive: prev.progressActive.map((v, i) => i === cardIndex ? false : v),
      isAnimating: prev.isAnimating.map((v, i) => i === cardIndex ? true : v)
    }));

    const animationTimeout = setTimeout(() => {
      if (!isMounted.current) return;

      setCardStates(prev => ({
        ...prev,
        cardImageIndices: prev.cardImageIndices.map((val, i) =>
          i === cardIndex ? (val + 1) % CARD_IMAGE_SETS[cardIndex].length : val
        ),
        isAnimating: prev.isAnimating.map((v, i) => i === cardIndex ? false : v)
      }));

      const progressTimeout = setTimeout(() => {
        if (isMounted.current) {
          setCardStates(prev => ({
            ...prev,
            progressActive: prev.progressActive.map((v, i) => i === cardIndex ? true : v)
          }));
        }
      }, 100);

      animationTimeouts.current.push(progressTimeout);
    }, 600);

    animationTimeouts.current.push(animationTimeout);
  }, []);

  // Image rotation setup
  useEffect(() => {
    const initialDelays = [1000, 1500, 2000, 2500];
    const rotationInterval = 5000;

    for (let i = 0; i < 4; i++) {
      const timeout = setTimeout(() => {
        if (!isMounted.current) return;

        setCardStates(prev => ({
          ...prev,
          progressActive: prev.progressActive.map((v, idx) => idx === i ? true : v)
        }));

        animateCard(i);

        const interval = setInterval(() => animateCard(i), rotationInterval);
        imageRotationIntervals.current.push(interval);
      }, initialDelays[i]);

      animationTimeouts.current.push(timeout);
    }
  }, [animateCard]);

  const handleCardClick = useCallback((index) => {
    if (isMobile) {
      setCardStates(prev => ({
        ...prev,
        expandedIndex: prev.expandedIndex === index ? null : index
      }));
    }
  }, [isMobile]);

  const handleReadMoreClick = useCallback((index, e) => {
    e.stopPropagation();
    setCardStates(prev => ({
      ...prev,
      activeTextIndex: prev.activeTextIndex === index ? null : index
    }));
  }, []);

  const handleMouseEnter = useCallback((index) => {
    if (!isMobile) {
      setCardStates(prev => ({ ...prev, hoveredIndex: index }));
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setCardStates(prev => ({
        ...prev,
        hoveredIndex: null,
        activeTextIndex: null
      }));
      setMousePosition({ x: 0, y: 0 });
    }
  }, [isMobile]);

  const handleMouseMove = useCallback((e, index) => {
    if (!isMobile && cardStates.hoveredIndex === index) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
      });
    }
  }, [isMobile, cardStates.hoveredIndex]);

  const isCardExpanded = useCallback((index) =>
    isMobile ? cardStates.expandedIndex === index : cardStates.hoveredIndex === index,
    [isMobile, cardStates.expandedIndex, cardStates.hoveredIndex]
  );

  const isCardCollapsed = useCallback((index) =>
    isMobile
      ? cardStates.expandedIndex !== null && cardStates.expandedIndex !== index
      : cardStates.hoveredIndex !== null && cardStates.hoveredIndex !== index,
    [isMobile, cardStates.expandedIndex, cardStates.hoveredIndex]
  );

  const particles = useMemo(() =>
    [...Array(15)].map((_, i) => (
      <span key={i} className={`home-particle home-particle-${i}`} />
    )), []
  );

  return (
    <div className="home-container">
      <div className="home-floating-particles" aria-hidden="true">
        {particles}
      </div>

      <div className="home-wrapper">
        {/* Cards Section */}
        <div className="home-cards-wrapper">
          {CARDS.map((card, index) => (
            <div
              key={card.id}
              className={`home-card ${isCardExpanded(index) ? 'expanded' : ''} ${isCardCollapsed(index) ? 'collapsed' : ''}`}
              style={{
                '--mouse-x': `${mousePosition.x}px`,
                '--mouse-y': `${mousePosition.y}px`,
                '--card-index': index
              }}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              <div className="home-card-border-animation"></div>
              <div className="home-card-shimmer"></div>

              <div className={`home-card-text-cover ${!cardStates.textCoversVisible[index] ? 'slide-away' : ''}`}>
                <div className="home-card-letter-container">
                  <div className="home-card-letter">{CARD_LETTERS[index]}</div>
                  <div className="home-card-letter-glow"></div>
                </div>
              </div>

              <div className="home-progress-bar">
                <div
                  className={`home-progress-fill ${cardStates.progressActive[index] && !cardStates.isAnimating[index] ? 'active' : ''}`}
                ></div>
              </div>

              <div className="home-card-image-wrapper">
                <img
                  src={CARD_IMAGE_SETS[index][cardStates.cardImageIndices[index]]}
                  alt={card.title}
                  className={`home-card-image ${cardStates.isAnimating[index] ? 'changing' : ''}`}
                  loading="lazy"
                />
                <div className="home-card-overlay"></div>
              </div>

              <div className="home-card-content">
                <div className="home-card-text-background"></div>
                <h1 className={`home-card-title home-gradient-text ${index === 0 ? 'home-gradient-green' : index === 1 ? 'home-gradient-red' : index === 2 ? 'home-gradient-purple' : 'home-gradient-blue'}`}>
                  {card.title}
                </h1>
                <div className="home-card-subtitle-container">
                  <h2 className={`home-card-subtitle home-gradient-text ${index === 0 ? 'home-gradient-green' : index === 1 ? 'home-gradient-red' : index === 2 ? 'home-gradient-purple' : 'home-gradient-blue'}`}>
                    {card.subtitle}
                  </h2>
                  {card.subtitle2 && (
                    <h2 className={`home-card-subtitle2 home-gradient-text ${index === 0 ? 'home-gradient-green' : index === 1 ? 'home-gradient-red' : index === 2 ? 'home-gradient-purple' : 'home-gradient-blue'}`}>
                      {card.subtitle2}
                    </h2>
                  )}
                </div>

                <div className="home-card-details">
                  <p className="home-card-description">{card.description}</p>
                  <div className="home-feature-tags">
                    {card.features.map((feature, idx) => (
                      <span key={idx} className="home-feature-tag" style={{ '--tag-delay': `${idx * 0.1}s` }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="home-card-buttons">
                    <button className="home-card-button home-primary-btn" onClick={(e) => handleReadMoreClick(index, e)}>
                      <span>{cardStates.activeTextIndex === index ? "Read Less" : "Read More"}</span>
                    </button>
                  </div>
                  {cardStates.activeTextIndex === index && (
                    <div className="home-extra-content">
                      <p className="home-extra-text">Discover our comprehensive range of NDT solutions tailored to your needs.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company Overview */}
        <section className={`home-company-overview home-sr ${sectionRefs.overview[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.overview[0]}>
          <div className="home-overview-container">
            <h2 className="home-overview-title">
              {typedText}
              <span className={`home-typing-cursor ${cursorVisible ? '' : 'home-cursor-hidden'}`}>|</span>
            </h2>
            <p className={`home-overview-subtitle home-sr-child ${sectionRefs.overview[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.3s' }}>
              We give our all to deliver to you
            </p>
            <p className={`home-overview-description home-sr-child ${sectionRefs.overview[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.5s' }}>
              We are as diverse as our target groups. More than one hundred years ago, we revolutionized
              German brush production; today, we are a globally active technology company with a broad
              focus, offering the perfect solution for all your demands.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className={`home-values-section home-sr ${sectionRefs.values[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.values[0]}>
          <div className="home-values-container">
            {VALUE_CARDS.map((val, i) => {
              const tilt = i === 0 ? tilt1 : i === 1 ? tilt2 : tilt3;
              return (
                <div
                  key={i}
                  className={`home-value-card home-sr-child ${sectionRefs.values[1] ? 'home-sr-child-visible' : ''}`}
                  style={{ '--sr-delay': `${0.2 + i * 0.15}s` }}
                  ref={tilt.ref}
                  onMouseMove={tilt.handleMove}
                  onMouseLeave={tilt.handleLeave}
                >
                  <div className="home-value-header">{val.header}</div>
                  <div className="home-value-content">
                    <div className="home-value-logo">{val.logo}</div>
                    <h3 className="home-value-title">{val.title}</h3>
                    <div className="home-value-divider"></div>
                    <p className="home-value-description">{val.desc}</p>
                    <button className="home-value-button">Read more &gt;</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Expedition Section */}
        <section className={`home-expedition-section home-sr ${sectionRefs.expedition[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.expedition[0]}>
          <div className="home-expedition-container">
            <div className={`home-expedition-content home-sr-child ${sectionRefs.expedition[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.1s' }}>
              <h2 className="home-expedition-title">Explore NDT Excellence</h2>
              <h3 className="home-expedition-subtitle">Your journey into precision inspection begins here</h3>
              <p className="home-expedition-description">
                Step into the world of advanced non-destructive testing. From ultrasonic calibration blocks
                to custom-engineered flaw specimens, discover how our precision solutions ensure safety
                and reliability across global industries. Start your exploration today.
              </p>
              <button className="home-expedition-button"><span>&gt;&gt; begin your NDT journey</span></button>
            </div>
            <div className={`home-expedition-visual home-sr-child ${sectionRefs.expedition[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.3s' }}>
              <div className="home-visual-box">
                <span className="home-visual-text">D</span>
                <div className="home-visual-box-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className={`home-heritage-section home-sr ${sectionRefs.heritage[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.heritage[0]}>
          <div className="home-heritage-container">
            <h2 className="home-heritage-title">Engineering Legacy</h2>
            <h3 className="home-heritage-subtitle">Decades of precision, trusted by industry leaders worldwide</h3>
            <p className="home-heritage-description">
              For over three decades, NDT Tools has been the cornerstone of quality assurance for
              aerospace, oil & gas, and manufacturing sectors. Our reference standards are engineered
              with surgical precision, each flaw meticulously crafted to challenge and validate
              your inspection procedures. From humble beginnings to global recognition, our commitment
              to accuracy remains unwavering — because when safety depends on detection, compromise is not an option.
            </p>
          </div>
        </section>

        {/* Quality Section - FIXED */}
        <section className={`home-quality-section home-sr ${sectionRefs.quality[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.quality[0]}>
          <div className="home-quality-container">
            <div className={`home-quality-content home-sr-child ${sectionRefs.quality[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.1s' }}>
              <h2 className="home-quality-title">Zero-Defect Manufacturing</h2>
              <h3 className="home-quality-subtitle">ISO 17025 accredited • Trusted by 2,500+ facilities worldwide</h3>
              <p className="home-quality-description">
                Every NDT reference standard we produce undergoes triple-stage verification:
                precision machining, advanced metrology inspection, and independent certification.
                Our ultrasonic, radiographic, and eddy current blocks are engineered to
                ASME, ASTM, and ISO specifications, ensuring your inspection procedures meet
                the most stringent global standards. When you train with our flawed specimens,
                you're preparing for real-world challenges — not simulations.
              </p>
            </div>
            <div className={`home-quality-visual home-sr-child ${sectionRefs.quality[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.3s' }}>
              <div className="home-video-wrapper">
                <video className="home-quality-video-player" autoPlay muted loop playsInline preload="metadata" poster={ep1}>
                  <source src={ep3} type="video/mp4" />
                </video>
                <div className="home-video-overlay-text">
                  <span className="home-video-brand">DAKS</span>
                  <span className="home-video-tagline">Feel Different</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Film Section - FIXED */}
        <section className={`home-film-section home-sr ${sectionRefs.film[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.film[0]}>
          <div className="home-film-container">
            <div className={`home-film-video home-sr-child ${sectionRefs.film[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.1s' }}>
              <div className="home-video-wrapper">
                <video className="home-film-video-player" autoPlay muted loop playsInline preload="metadata" poster={ep2}>
                  <source src={ep4} type="video/mp4" />
                </video>
                <div className="home-video-overlay-text">
                  <span className="home-video-brand">DAKS</span>
                  <span className="home-video-tagline">Feel Different</span>
                </div>
              </div>
            </div>
            <div className={`home-film-content home-sr-child ${sectionRefs.film[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.3s' }}>
              <h2 className="home-film-title">The Science of Detection</h2>
              <h3 className="home-film-subtitle">Behind every flawless inspection</h3>
              <p className="home-film-description">
                Go behind the scenes of our precision manufacturing facility. Watch as master
                craftsmen and advanced CNC technology collaborate to create reference standards
                that detect the undetectable. From aerospace turbine blades to pipeline integrity,
                witness how our NDT solutions safeguard critical infrastructure across the globe.
                This is where engineering meets artistry — because in non-destructive testing,
                what you cannot see matters most.
              </p>
            </div>
          </div>
        </section>

        {/* Tour Section */}
        <section className={`home-tour-section home-sr ${sectionRefs.tour[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.tour[0]}>
          <div className="home-tour-container">
            <h2 className={`home-tour-title home-sr-child ${sectionRefs.tour[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.1s' }}>360 degree tour</h2>
            <p className={`home-tour-description home-sr-child ${sectionRefs.tour[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.3s' }}>
              DAKS not only offers 360° service, but also 360° tours. Go on safari and discover
              our state-of-the-art facilities and innovative solutions.
            </p>
          </div>
        </section>

        {/* Intro 1 */}
        <section className={`home-zahos-intro home-sr ${sectionRefs.intro1[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.intro1[0]}>
          <div className="home-intro-container">
            <h1 className="home-intro-main-title">Precision That Detects the Invisible</h1>
            <h2 className="home-intro-sub-title">Engineering confidence through accurate flaw simulation</h2>
            <p className="home-intro-body-text">
              We don't just manufacture NDT reference standards — we engineer confidence.
              Every calibration block, every flawed specimen tells a story of meticulous
              design and execution. Our clients don't just pass inspections; they set new
              benchmarks for quality assurance. Because in non-destructive testing, your
              standards define our success.
            </p>
          </div>
        </section>

        {/* Team Gallery Section - FIXED */}
        <section className={`home-team-gallery-section home-sr ${sectionRefs.team[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.team[0]}>
          <div className="home-team-grid">
            {TEAM_MEMBERS.map((member, i) => (
              <div
                key={i}
                className={`home-team-column ${selectedMember.name === member.name ? 'home-active-member' : ''} home-sr-child ${sectionRefs.team[1] ? 'home-sr-child-visible' : ''}`}
                style={{ '--sr-delay': `${i * 0.08}s` }}
                onClick={() => handleMemberSelect(member, i)}
              >
                <video
                  ref={el => teamVideoRefs.current[i] = el}
                  className="home-team-img"
                  muted
                  loop
                  playsInline
                  poster={member.thumbnail}
                  preload="metadata"
                >
                  <source src={member.video} type="video/mp4" />
                </video>
                <div className="home-play-button-overlay">
                  <div className="home-play-circle">
                    <div className="home-play-triangle"></div>
                  </div>
                </div>
                {selectedMember.name === member.name && (
                  <div className="home-active-label-overlay">
                    {member.name}<br />{member.role}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Member Detail Section - Only shown when a member is clicked */}
        {showMemberDetail && (
          <section className={`home-member-detail-display home-sr ${sectionRefs.memberDetail[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.memberDetail[0]}>
            <div className="home-detail-container">
              <div className="home-detail-text-side">
                <h2 className="home-detail-name">{selectedMember.fullName}</h2>
                <h3 className="home-detail-role">{selectedMember.role}</h3>
                <p className="home-detail-quote">{selectedMember.quote}</p>

                <div className="home-pause-control" onClick={handlePauseToggle}>
                  <span className="home-pause-icon">{isVideoPaused ? '▶' : '⏸'}</span>
                  {isVideoPaused ? 'Play video' : 'Pause video'}
                </div>
              </div>

              <div className="home-detail-video-side">
                <video
                  ref={detailVideoRef}
                  key={selectedMember.name}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="home-large-detail-video"
                  poster={selectedMember.thumbnail}
                  preload="metadata"
                >
                  <source src={selectedMember.video} type="video/mp4" />
                </video>
              </div>
            </div>
          </section>
        )}

        {/* Intro 2 */}
        <section className={`home-zahos-intro home-sr ${sectionRefs.intro2[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.intro2[0]}>
          <div className="home-intro-container">
            <h1 className="home-intro-main-title">NDT Innovation & Insights</h1>
            <h2 className="home-intro-sub-title">Stay current with industry standards and our latest advancements</h2>
            <p className="home-intro-body-text">
              The world of non-destructive testing evolves constantly. From updated ASME
              codes to breakthrough ultrasonic techniques, our news portal keeps you informed.
              Discover how industries from aerospace to renewable energy are raising their
              quality standards — and how our reference standards help them get there.
            </p>
          </div>
        </section>

        {/* News Section */}
        <section className={`home-news-testimonials-section home-sr ${sectionRefs.news[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.news[0]}>
          <div className="home-news-grid">
            {NEWS_ITEMS.map((item, i) => (
              <div key={i} className={`home-news-card home-sr-child ${sectionRefs.news[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': `${0.1 + i * 0.12}s` }}>
                <div className="home-news-card-image-wrapper">
                  <img src={item.image} alt={item.title} className="home-news-card-img" loading="lazy" />
                  <div className="home-news-card-date-overlay">{item.date}</div>
                </div>
                <div className="home-news-card-content">
                  <div className="home-news-divider-top"></div>
                  <h2 className="home-news-title">{item.title}</h2>
                  <div className="home-news-divider-small"></div>
                  <p className="home-news-description">{item.description}</p>
                  <Link to="/news">
                    <button className="home-news-read-more">
                      Read more &gt;
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Intro 3 */}
        <section className={`home-zahos-intro home-sr ${sectionRefs.intro3[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.intro3[0]}>
          <div className="home-intro-container">
            <h1 className="home-intro-main-title">Trusted by Industry Leaders</h1>
            <h2 className="home-intro-sub-title">Real feedback from NDT professionals worldwide</h2>
            <p className="home-intro-body-text">
              "NDT Tools' reference standards have become the benchmark for our global
              inspection network. Their precision flaw engineering allows us to train
              technicians with absolute confidence." — <strong>Global Aerospace Consortium</strong>
            </p>
            <p className="home-intro-body-text">
              "When certification bodies audit our facility, they don't question our
              reference standards. The NDT Tools brand carries that much weight in the
              industry." — <strong>Petrochem Inspection Services</strong>
            </p>
            <p className="home-intro-body-text">
              "The consistency across every block we order is remarkable. Whether it's
              our first or fiftieth purchase, the quality never varies." — <strong>Precision NDT Labs</strong>
            </p>
          </div>
        </section>

        {/* Premium Testimonial Section */}
        <section className={`home-premium-testimonial-wrapper home-sr ${sectionRefs.testimonial[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.testimonial[0]}>
          <div className="home-testimonial-blur-bg"></div>
          <div className="home-testimonial-inner">
            <div className="home-quote-icon">"</div>
            <div className="home-testimonial-slider-container">
              {TESTIMONIALS.map((item, index) => (
                <div key={index} className={`home-testimonial-slide ${index === activeTestimonial ? 'active' : ''}`}>
                  <blockquote className="home-main-quote">{item.quote}</blockquote>
                  <div className="home-testimonial-divider"></div>
                  <div className="home-testimonial-author-info">
                    <h4 className="home-author-name">{item.author}</h4>
                    <p className="home-author-position">{item.position}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="home-testimonial-dots">
              {TESTIMONIALS.map((_, index) => (
                <span key={index} className={`home-dot ${index === activeTestimonial ? 'active' : ''}`} onClick={() => setActiveTestimonial(index)}></span>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Chatbot />
    </div>
  );
};

export default Home;

