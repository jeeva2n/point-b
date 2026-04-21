// Home.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './css/Home.css';
import ep1 from '../assets/primary/ep1.jpg';
import ep2 from '../assets/primary/ep2.jpg';
import q1 from '../assets/primary/q1.png';
import q4 from '../assets/primary/q4.jpg';
import logo from '../assets/primary/daks.png';
// import Chatbot from '../components/Chatbot';
import { Link } from "react-router-dom";
import { API_URL } from '../config/api';
import { Helmet } from 'react-helmet-async';

const ep3 = "https://dakstools.com/uploads/videos/blocks-camera.mp4";
const ep4 = "https://dakstools.com/uploads/videos/video2.mp4";

/* ─── hook: fires once an element scrolls into view ─── */
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

const CARD_LETTERS = ['D', 'A', 'K', 'S'];

/* ─── FALLBACK DATA (used when API is unreachable) ─── */
const FALLBACK_TESTIMONIALS = [
  {
    id: 'f1',
    quote: "The precision of their ultrasonic reference blocks is exceptional. We've reduced our calibration uncertainty by 40% since switching to NDT Tools.",
    author: "Dr. Michael Chen",
    position: "NDT Manager • Global Aerospace Industries"
  },
  {
    id: 'f2',
    quote: "Custom flaw specimens that exactly match our real-world inspection challenges. These standards have revolutionized our technician training programs.",
    author: "Sarah Williams",
    position: "Senior NDT Level III • Energy Sector"
  },
  {
    id: 'f3',
    quote: "ISO 17025 accreditation means nothing without consistent quality. NDT Tools delivers both — every time, without exception.",
    author: "James Rodriguez",
    position: "Quality Assurance Director • Marine Engineering"
  }
];

const FALLBACK_NEWS = [
  {
    id: 'fn1',
    date: "15. March 2026",
    title: "New ASME Section V compliant ultrasonic calibration blocks released",
    description: "Our latest series of ultrasonic reference blocks sets new standards for accuracy in weld inspection and thickness gauging applications.",
    image: ep1
  },
  {
    id: 'fn2',
    date: "28. February 2026",
    title: "Expanding NDT capabilities: New eddy current standards lab",
    description: "Dedicated facility for manufacturing custom eddy current reference standards now operational, supporting aerospace and automotive clients.",
    image: ep2
  },
  {
    id: 'fn3',
    date: "10. January 2026",
    title: "Advancing radiographic inspection with digital reference radiographs",
    description: "Collaborative research project with leading NDT institutes yields new digital reference libraries for weld discontinuity classification.",
    image: q1
  },
  {
    id: 'fn4',
    date: "05. December 2025",
    title: "Global NDT certification partnership announced",
    description: "Strategic alliance with major certification bodies streamlines access to ASNT and PCN Level III training materials and reference standards.",
    image: q4
  }
];

const FALLBACK_TEAM = [
  {
    id: 'ft1',
    name: "Dr. Chen & Santos",
    full_name: "Dr. James Chen & Maria Santos",
    fullName: "Dr. James Chen & Maria Santos",
    role: "NDT Research & Development",
    quote: "Every flaw we engineer teaches inspectors what to look for. Our precision creates their expertise.",
    video: ep3,
    thumbnail: ep1
  },
  {
    id: 'ft2',
    name: "Robert Nakamura",
    full_name: "Robert Nakamura",
    fullName: "Robert Nakamura",
    role: "Senior NDT Engineer",
    quote: "A 0.1mm flaw can mean the difference between safety and catastrophe. We make sure you find it.",
    video: ep4,
    thumbnail: ep2
  },
  {
    id: 'ft3',
    name: "Dr. Anna Weber",
    full_name: "Dr. Anna Weber",
    fullName: "Dr. Anna Weber",
    role: "Ultrasonic Standards Specialist",
    quote: "The echoes don't lie — but only if your reference standards are true.",
    video: ep3,
    thumbnail: q1
  },
  {
    id: 'ft4',
    name: "Michael Thornton",
    full_name: "Michael Thornton",
    fullName: "Michael Thornton",
    role: "Aerospace NDT Solutions",
    quote: "From turbine blades to landing gear, our standards ensure nothing goes unnoticed.",
    video: ep4,
    thumbnail: q4
  },
  {
    id: 'ft5',
    name: "Sarah & David",
    full_name: "Sarah & David Chen",
    fullName: "Sarah & David Chen",
    role: "Radiographic Standards Team",
    quote: "Seeing through metal is our expertise. Creating the right shadows is our craft.",
    video: ep3,
    thumbnail: ep1
  },
  {
    id: 'ft6',
    name: "Elena Volkov",
    full_name: "Elena Volkov",
    fullName: "Elena Volkov",
    role: "Eddy Current Specialist",
    quote: "Surface or subsurface, our standards reveal what others miss.",
    video: ep4,
    thumbnail: ep2
  },
  {
    id: 'ft7',
    name: "Dr. Raj Patel",
    full_name: "Dr. Raj Patel",
    fullName: "Dr. Raj Patel",
    role: "Quality Systems Director",
    quote: "ISO 17025 isn't just a certification — it's our promise to you.",
    video: ep3,
    thumbnail: q1
  }
];

const CARDS = [
  {
    id: 1,
    title: "Our",
    subtitle: "precision ",
    subtitle2: "manufacture",
    description: "Engineered with accuracy and built to international standards, our NDT products deliver unmatched reliability, consistency, and performance for critical inspection applications.",
    features: ["ISO Certified", "Quality Assured", "Fast Delivery"],
    image: q1
  },
  {
    id: 2,
    title: "We",
    subtitle: "analyze",
    subtitle2: "the quality ",
    description: "Rigorous testing and validation ensure every product meets the highest standards of accuracy and reliability.",
    features: ["Custom Blocks", "Traceability", "Certification"],
    image: ep2
  },
  {
    id: 3,
    title: "Specific",
    subtitle: "Applications",
    subtitle2: "customs",
    description: "We design and develop application-specific NDT solutions tailored to meet unique inspection challenges across industries.",
    features: ["Precision Cut", "Advanced Testing", "Documentation"],
    image: ep1
  },
  {
    id: 4,
    title: "Who",
    subtitle: "We",
    subtitle2: "are",
    description: "Driven by expertise and innovation, we provide reliable NDT products that ensure quality, safety, and performance across industries.",
    features: ["Expert Team", "Innovation", "Support"],
    image: q4
  },
];

const VALUE_CARDS = [
  {
    header: 'NDT Quality',
    logo: 'Q',
    title: <>Weld Overlay <br />Cladding</>,
    desc: 'Precision-engineered weld overlay cladding for corrosion protection and wear resistance, ensuring superior metallurgical bonding and long-term performance in critical applications.'
  },
  {
    header: 'Precision Machining',
    logo: 'M',
    title: <>EDM <br />Machining</>,
    desc: 'High-precision EDM machining for creating accurate flaw simulations, intricate geometries, and tight-tolerance components essential for advanced NDT calibration and validation'
  },
  {
    header: 'Innovation Hub',
    logo: 'R&D',
    title: <>Research<br />Development</>,
    desc: 'Our dedicated R&D team continuously develops innovative NDT solutions, advanced flaw simulation techniques, and customized products to meet evolving industry requirements.'
  }
];

const Home = () => {
  /* ═══ DYNAMIC DATA FROM BACKEND ═══ */
  const [newsItems, setNewsItems] = useState(FALLBACK_NEWS);
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [teamMembers, setTeamMembers] = useState(FALLBACK_TEAM);

  const [cardStates, setCardStates] = useState({
    hoveredIndex: null,
    expandedIndex: null,
    activeTextIndex: null,
    textCoversVisible: [true, true, true, true],
    progressActive: [false, false, false, false]
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState(FALLBACK_TEAM[0]);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const detailVideoRef = useRef(null);
  const teamVideoRefs = useRef([]);
  const isMounted = useRef(true);
  const animationTimeouts = useRef([]);

  const sectionRefs = {
    overview: useScrollReveal({ threshold: 0.2 }),
    values: useScrollReveal({ threshold: 0.15 }),
    quality: useScrollReveal({ threshold: 0.15 }),
    film: useScrollReveal({ threshold: 0.15 }),
    intro1: useScrollReveal({ threshold: 0.2 }),
    team: useScrollReveal({ threshold: 0.1 }),
    intro2: useScrollReveal({ threshold: 0.2 }),
    news: useScrollReveal({ threshold: 0.1 }),
    intro3: useScrollReveal({ threshold: 0.2 }),
    testimonial: useScrollReveal({ threshold: 0.15 }),
    memberDetail: useScrollReveal({ threshold: 0.1 })
  };

  const tilt1 = useTilt(6);
  const tilt2 = useTilt(6);
  const tilt3 = useTilt(6);

  /* ═══════════════════════════════════
     SCHEMA.ORG JSON-LD FOR HOMEPAGE SEO
  ═══════════════════════════════════ */
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://dakstools.com/#organization",
        "name": "DAKS Tools",
        "url": "https://dakstools.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dakstools.com/daks.png",
          "width": "161",
          "height": "70"
        },
        "sameAs": [
          "https://www.linkedin.com/company/dakstools",
          "https://www.facebook.com/dakstools"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-44-4501-5884",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Tamil", "Hindi"]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://dakstools.com/#localbusiness",
        "name": "DAKS Tools",
        "image": "https://dakstools.com/daks.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No.10/98, Narasimman Street, Babu Garden Phase II, Sikarayapuram",
          "addressLocality": "Chennai",
          "addressRegion": "Tamil Nadu",
          "postalCode": "600069",
          "addressCountry": {
            "@type": "Country",
            "name": "India"
          }
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 13.0093796,
          "longitude": 80.1052081
        },
        "telephone": "+91-44-4501-5884",
        "url": "https://dakstools.com",
        "priceRange": "₹₹",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "Service",
        "name": "NDT Equipment Supply & Calibration Services",
        "provider": {
          "@type": "Organization",
          "name": "DAKS Tools"
        },
        "serviceType": "Non-Destructive Testing Equipment",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "description": "Precision NDT calibration blocks, flawed specimens, ultrasonic testing equipment, and on-site inspection services.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "NDT Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Ultrasonic Testing Calibration Blocks"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Flawed Specimens Manufacturing"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Weld Overlay Cladding"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "EDM Precision Machining"
              }
            }
          ]
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
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://dakstools.com/#website",
        "url": "https://dakstools.com",
        "name": "DAKS Tools - NDT Equipment & Calibration Standards",
        "description": "Precision NDT calibration blocks, flawed specimens, and ultrasonic testing equipment supplier in Chennai, India.",
        "publisher": {
          "@id": "https://dakstools.com/#organization"
        },
        "inLanguage": "en-IN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://dakstools.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What NDT services does DAKS Tools provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools provides precision NDT calibration blocks, flawed specimens for training and validation, ultrasonic testing equipment, weld overlay cladding, and EDM machining services for critical inspection applications."
            }
          },
          {
            "@type": "Question",
            "name": "Where is DAKS Tools located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools is located at No.10/98, Narasimman Street, Babu Garden Phase II, Sikarayapuram, Chennai – 600069, Tamil Nadu, India."
            }
          },
          {
            "@type": "Question",
            "name": "Are DAKS Tools products ISO certified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, DAKS Tools manufactures NDT products to international standards with full traceability and certification, ensuring compliance with ISO 17025 and ASME Section V requirements."
            }
          }
        ]
      }
    ]
  };

  /* ═══════════════════════════════════
     FETCH DATA FROM BACKEND
  ═══════════════════════════════════ */
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newsRes, testRes, teamRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/news`).then(r => r.json()),
          fetch(`${API_URL}/api/testimonials`).then(r => r.json()),
          fetch(`${API_URL}/api/team`).then(r => r.json())
        ]);

        // Process News
        if (newsRes.status === 'fulfilled' && newsRes.value.success && newsRes.value.data?.length > 0) {
          const processed = newsRes.value.data.map(item => ({
            ...item,
            image: item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`
          }));
          setNewsItems(processed);
        }

        // Process Testimonials
        if (testRes.status === 'fulfilled' && testRes.value.success && testRes.value.data?.length > 0) {
          setTestimonials(testRes.value.data);
        }

        // Process Team
        if (teamRes.status === 'fulfilled' && teamRes.value.success && teamRes.value.data?.length > 0) {
          const processed = teamRes.value.data.map(item => ({
            ...item,
            fullName: item.full_name,
            video: item.video.startsWith('http') ? item.video : `${API_URL}${item.video}`,
            thumbnail: item.thumbnail.startsWith('http') ? item.thumbnail : `${API_URL}${item.thumbnail}`
          }));
          setTeamMembers(processed);
          setSelectedMember(processed[0]);
        }
      } catch (err) {
        console.error('Failed to fetch home data, using fallbacks:', err);
      }
    };

    fetchHomeData();
  }, []);

  /* ═══ HANDLERS ═══ */
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

  const handleMemberSelect = useCallback((member, index) => {
    setSelectedMember(member);
    setIsVideoPaused(false);
    setShowMemberDetail(true);

    teamVideoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, []);

  /* ═══ TYPING ANIMATION ═══ */
  const fullTitle = 'Precision Beyond Measure, Quality Without Compromise';

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

  /* ═══ CURSOR BLINK ═══ */
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  /* ═══ TESTIMONIAL AUTO ROTATE ═══ */
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  /* ═══ MOBILE CHECK ═══ */
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

  /* ═══ CARD COVERS ANIMATION ═══ */
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
    };
  }, []);

  /* ═══ PROGRESS BAR CYCLE ═══ */
  useEffect(() => {
    const PROGRESS_DURATION = 5000;
    const runProgressCycle = () => {
      if (!isMounted.current) return;
      setCardStates(prev => ({ ...prev, progressActive: [false, false, false, false] }));
      const activateTimeout = setTimeout(() => {
        if (!isMounted.current) return;
        setCardStates(prev => ({ ...prev, progressActive: [true, true, true, true] }));
      }, 50);
      animationTimeouts.current.push(activateTimeout);
      const nextCycleTimeout = setTimeout(() => runProgressCycle(), PROGRESS_DURATION + 100);
      animationTimeouts.current.push(nextCycleTimeout);
    };
    const initialTimeout = setTimeout(runProgressCycle, 1000);
    animationTimeouts.current.push(initialTimeout);
    return () => {
      animationTimeouts.current.forEach(clearTimeout);
      animationTimeouts.current = [];
    };
  }, []);

  /* ═══ CARD INTERACTION HANDLERS ═══ */
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
    [...Array(15)].map((_, i) => <span key={i} className={`home-particle home-particle-${i}`} />), []
  );

  /* ═══════════════════════════════════
     RENDER
  ═══════════════════════════════════ */
  return (

    <div className="home-container">
      {/* ═══════════════════════════════════
           SEO - REACT HELMET COMPONENT
      ═══════════════════════════════════ */}
      <Helmet>
        {/* Primary Meta Tags */}
    <title>DAKS NDT – Top NDT Products & Calibration Blocks in Chennai | Best NDT Supplier Near Me</title>
        <meta name="description" content="DAKS Tools Chennai: Ultrasonic calibration blocks, flawed specimens & NDT solutions. ISO-certified manufacturer serving India. Get a quote." />
        <meta name="keywords" content="NDT equipment Chennai, ultrasonic testing blocks, calibration blocks India, flawed specimens, NDT inspection services, EDM machining Chennai, weld overlay cladding, DAKS Tools, non-destructive testing equipment, NDT calibration standards" />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://dakstools.com/" />

        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dakstools.com/" />
        <meta property="og:title" content="DAKS Tools – Precision NDT Equipment & Calibration Standards" />
        <meta property="og:description" content="Manufacturer of ultrasonic calibration blocks, flawed specimens, and NDT reference standards. Trusted by aerospace, oil & gas, and manufacturing industries across India." />
        <meta property="og:image" content="https://dakstools.com/daks.png" />
        <meta property="og:image:alt" content="DAKS Tools - NDT Calibration Blocks and Equipment" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:publisher" content="https://www.facebook.com/dakstools" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="DAKS Tools – NDT Equipment & Calibration Standards" />
        <meta name="twitter:description" content="Precision NDT calibration blocks, flawed specimens, and ultrasonic testing equipment. Serving aerospace, oil & gas, and manufacturing sectors across India." />
        <meta name="twitter:image" content="https://dakstools.com/daks.png" />
        <meta name="twitter:image:alt" content="DAKS Tools NDT Equipment" />

        {/* Mobile Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DAKS Tools" />

        {/* Additional SEO */}
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="target" content="all" />
        <meta name="classification" content="NDT Equipment, Calibration Blocks, Industrial Testing" />
        <meta name="category" content="Industrial Equipment" />

        {/* Preconnect and DNS Prefetch */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(homeSchema)}
        </script>
      </Helmet>

      <div className="home-floating-particles" aria-hidden="true">
        {particles}
      </div>

      <div className="home-wrapper">
        {/* ═══ HERO SECTION - Semantic HTML for SEO ═══ */}
        <header className="home-hero-header">
          <h1 className="home-seo-title">
            DAKS Tools – Precision NDT Equipment & Calibration Standards
          </h1>
          <p className="home-seo-subtitle">
            Manufacturer of ultrasonic calibration blocks, flawed specimens,
            and NDT reference standards in Chennai, India
          </p>
        </header>

        {/* ═══ HERO CARDS ═══ */}
        <section className="home-cards-wrapper" aria-label="Our Services">
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
                  className={`home-progress-fill ${cardStates.progressActive[index] ? 'active' : ''}`}
                ></div>
              </div>

              <div className="home-card-image-wrapper">
                <img
                  src={card.image}
                  alt={card.title}
                  className="home-card-image"
                  loading="lazy"
                />
                <div className="home-card-overlay"></div>
              </div>

              <div className="home-card-content">
                <div className="home-card-text-background"></div>
                <h2 className={`home-card-title home-gradient-text ${index === 0 ? 'home-gradient-green' : index === 1 ? 'home-gradient-red' : index === 2 ? 'home-gradient-purple' : 'home-gradient-blue'}`}>
                  {card.title}
                </h2>
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
        </section>

        {/* ═══ COMPANY OVERVIEW ═══ */}
        <section
          className={`home-company-overview home-sr ${sectionRefs.overview[1] ? 'home-sr-visible' : ''}`}
          ref={sectionRefs.overview[0]}
          aria-labelledby="overview-heading"
        >
          <div className="home-overview-container">
            <h2 id="overview-heading" className="home-overview-title">
              {typedText}
              <span className={`home-typing-cursor ${cursorVisible ? '' : 'home-cursor-hidden'}`}>|</span>
            </h2>
            <p className={`home-overview-subtitle home-sr-child ${sectionRefs.overview[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.3s' }}>
              Engineered to Deliver Excellence in Every Inspection
            </p>
            <p className={`home-overview-description home-sr-child ${sectionRefs.overview[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.5s' }}>
              At DAKS TOOLS, we manufacture high-precision NDT calibration blocks, flawed specimens, and advanced inspection solutions designed to meet global industry standards. With strong expertise in engineering and quality control, we deliver reliable, application-specific products that ensure accurate inspection results and long-term performance.
            </p>
          </div>
        </section>

        {/* ═══ VALUES ═══ */}
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

        {/* ═══ QUALITY SECTION ═══ */}
        <section className={`home-quality-section home-sr ${sectionRefs.quality[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.quality[0]}>
          <div className="home-quality-container">
            <div className={`home-quality-content home-sr-child ${sectionRefs.quality[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': '0.1s' }}>
              <h2 className="home-quality-title">Advanced Welding Technology for Precision & Performance</h2>
              <h3 className="home-quality-subtitle">Delivering precision through advanced welding and flaw simulation technologies</h3>
              <p className="home-quality-description">
                Our advanced welding technology combines precision flaw implantation and high-performance weld overlay cladding to meet critical inspection and industrial requirements. We specialize in manufacturing realistic flawed specimens for NDT validation and calibration, along with corrosion-resistant weld overlays for demanding oil & gas applications—ensuring accuracy, reliability, and long-term performance.
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

        {/* ═══ FILM SECTION ═══ */}
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
              <h2 className="home-film-title">Precision Machining for Advanced NDT Applications</h2>
              <h3 className="home-film-subtitle">High-accuracy CNC and EDM machining for precise flaw creation in calibration blocks and flawed specimens</h3>
              <p className="home-film-description">
                Our advanced machining capabilities include CNC and EDM processes designed to achieve micron-level precision in manufacturing NDT calibration blocks and flawed specimens. We specialize in creating flat bottom holes (FBH), side-drilled holes, and miniature notches with exceptional accuracy, ensuring reliable flaw simulation for critical inspection and validation applications.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ INTRO 3 ═══ */}
        <section className={`home-zahos-intro home-sr ${sectionRefs.intro3[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.intro3[0]}>
          <div className="home-intro-container">
            <h2 className="home-intro-main-title">We are #TheDAKSTOOLS</h2>
            <h2 className="home-intro-sub-title">Strong customer and partner relationships built on mutual trust and transparency</h2>
            <p className="home-intro-body-text">
              "We know we are not perfect—but we are <span style={{ color: '#0d57a6', fontWeight: 'bold' }}> <b>PERFECTLY DIFFERENT</b> </span>. That difference drives us to go beyond conventional support, delivering reliable solutions that truly meet critical inspection requirements. We don't just assist—we collaborate, ensuring accuracy, confidence, and " — <strong>long-term value in every inspection.</strong>
            </p>
          </div>
        </section>

        {/* ═══ TEAM GALLERY (DYNAMIC) ═══ */}
        <section className={`home-team-gallery-section home-sr ${sectionRefs.team[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.team[0]}>
          <div className="home-team-grid">
            {teamMembers.map((member, i) => (
              <div
                key={member.id || i}
                className={`home-team-column ${selectedMember?.name === member.name ? 'home-active-member' : ''} home-sr-child ${sectionRefs.team[1] ? 'home-sr-child-visible' : ''}`}
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
                {selectedMember?.name === member.name && (
                  <div className="home-active-label-overlay">
                    {member.name}<br />{member.role}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ═══ MEMBER DETAIL ═══ */}
        {showMemberDetail && selectedMember && (
          <section className={`home-member-detail-display home-sr ${sectionRefs.memberDetail[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.memberDetail[0]}>
            <div className="home-detail-container">
              <div className="home-detail-text-side">
                <h2 className="home-detail-name">{selectedMember.fullName || selectedMember.full_name}</h2>
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

        <br />

        {/* ═══ TESTIMONIALS (DYNAMIC) ═══ */}
        <section className={`home-premium-testimonial-wrapper home-sr ${sectionRefs.testimonial[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.testimonial[0]}>
          <div className="home-testimonial-blur-bg"></div>
          <div className="home-testimonial-inner">
            <div className="home-quote-icon">"</div>
            <div className="home-testimonial-slider-container">
              {testimonials.map((item, index) => (
                <div key={item.id || index} className={`home-testimonial-slide ${index === activeTestimonial ? 'active' : ''}`}>
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
              {testimonials.map((_, index) => (
                <span
                  key={index}
                  className={`home-dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                ></span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ INTRO 2 ═══ */}
        <section className={`home-zahos-intro home-sr ${sectionRefs.intro2[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.intro2[0]}>
          <div className="home-intro-container">
            <h2 className="home-intro-main-title">NDT Innovation & Insights</h2>
            <h2 className="home-intro-sub-title">Stay current with industry standards and our latest advancements</h2>
            <p className="home-intro-body-text">
              The world of non-destructive testing evolves constantly. From updated ASME
              codes to breakthrough ultrasonic techniques, our news portal keeps you informed.
              Discover how industries from aerospace to renewable energy are raising their
              quality standards — and how our reference standards help them get there.
            </p>
          </div>
        </section>

        {/* ═══ NEWS (DYNAMIC) ═══ */}
        <section className={`home-news-testimonials-section home-sr ${sectionRefs.news[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.news[0]}>
          <div className="home-news-grid">
            {newsItems.map((item, i) => (
              <div key={item.id || i} className={`home-news-card home-sr-child ${sectionRefs.news[1] ? 'home-sr-child-visible' : ''}`} style={{ '--sr-delay': `${0.1 + i * 0.12}s` }}>
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

        {/* ═══ INTRO 1 ═══ */}
        <section className={`home-zahos-intro home-sr ${sectionRefs.intro1[1] ? 'home-sr-visible' : ''}`} ref={sectionRefs.intro1[0]}>
          <div className="home-intro-container">
            <h2 className="home-intro-main-title">Precision That Detects the Invisible</h2>
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

        {/* ═══ FOOTER WITH SCHEMA.ORG ADDRESS ═══ */}
        <footer className="home-footer" itemScope itemType="https://schema.org/LocalBusiness">
          <meta itemProp="name" content="DAKS Tools" />
          <meta itemProp="url" content="https://dakstools.com" />
          <meta itemProp="image" content="https://dakstools.com/daks.png" />
          <meta itemProp="priceRange" content="₹₹" />

          <div className="home-footer-map-bg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7071754285444!2d80.10263841482158!3d13.009379590828807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52614b63771a23%3A0xac38a71e657c8397!2sALPHA%20SONIX%20NDT%20SOLUTIONS%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DAKS Tools Location - NDT Equipment Manufacturer in Chennai"
            ></iframe>
          </div>

          <div className="home-footer-overlay"></div>

          <div className="home-footer-inner">
            <div className="home-footer-top">
              <div className="home-footer-logo-container">
                <img
                  src={logo}
                  width="161"
                  height="70"
                  alt="DAKS TOOLS - NDT Equipment Manufacturer in Chennai"
                  className="home-footer-logo"
                  itemProp="logo"
                />
                <div className="home-footer-tagline">PERFECTLY DIFFERENT</div>
              </div>
            </div>

            <div className="home-footer-contact-grid">
              <div className="home-footer-contact-item">
                <div className="home-footer-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <span className="home-footer-label">E-MAIL</span>
                <a href="mailto:info@dakstools.com" className="home-footer-link" itemProp="email">info@dakstools.com</a>
              </div>

              <div className="home-footer-contact-item">
                <div className="home-footer-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.1 15.1 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                </div>
                <span className="home-footer-label">CONTACT</span>
                <a href="tel:+914445015884" className="home-footer-link" itemProp="telephone">+91 44 4501 5884</a>
              </div>

              <div
                className="home-footer-contact-item"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <div className="home-footer-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                </div>
                <span className="home-footer-label">VISIT THE DAKS</span>
                <a
                  href="https://www.google.com/maps/place/ALPHA+SONIX+NDT+SOLUTIONS+PVT+LTD/@13.0093796,80.1052081,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-footer-link"
                >
                  <p className="home-footer-address">
                    <span itemProp="streetAddress">No.10/98, Narasimman Street, Babu Garden Phase II, Sikarayapuram</span><br />
                    <span itemProp="addressLocality">Chennai</span> – <span itemProp="postalCode">600069</span>, <span itemProp="addressRegion">Tamil Nadu</span>, <span itemProp="addressCountry">India</span>
                  </p>
                </a>
                <meta itemProp="addressCountry" content="IN" />
              </div>
            </div>
          </div>
        </footer>

        <div className="home-footer-bottom">
          <p className="home-footer-copyright">
            © 2026 DAKS TOOLS. All rights reserved. Designed & Marketed by{" "}
            <a
              href="https://dakstools.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "orange", textDecoration: "none" }}
            >
              DAKS TOOLS
            </a>.
          </p>
        </div>
      </div>
      {/* <Chatbot /> */}
    </div>
  );
};

export default Home;