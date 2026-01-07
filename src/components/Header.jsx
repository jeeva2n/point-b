import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaInfoCircle, FaUserTie, FaHome, FaShoppingCart } from "react-icons/fa";
import "./Header.css";
import daksLogo from '../assets/primary/daks.png';
import h4 from '../assets/primary/h4.png';
import h3 from '../assets/primary/h3.png';
import h2 from '../assets/primary/h2.png';
import h1 from '../assets/primary/h1.png';
import f from '../assets/secondary/flawed.png';
import r from '../assets/secondary/reference.png';
import v from '../assets/secondary/validation.png';
import o from '../assets/secondary/resources.png';
import c from '../assets/secondary/company.jpg';

function Header() {
  const [contactOpen, setContactOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(null);
  const [clickedMenu, setClickedMenu] = useState(null);
  const [openFlawedGroup, setOpenFlawedGroup] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const contactPanelRef = useRef(null);
  const backendUrl = localStorage.getItem("backend_url") || "http://192.168.1.9:5001";

  const closeAllMenus = () => {
    setMegaMenuOpen(null);
    setClickedMenu(null);
    setOpenFlawedGroup(null);
    setContactOpen(false);
  };


  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAdmin(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("admin_token");
      setIsAdmin(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check cart count on load and when localStorage changes
  useEffect(() => {
    checkCartCount();

    const handleStorageChange = (e) => {
      if (e.key === 'cartId') {
        checkCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get cart count from API
  const checkCartCount = async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/cart/${cartId}`);
      const data = await response.json();

      if (data.success && data.cart?.items) {
        const count = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error getting cart count:', error);
      setCartCount(0);
    }
  };

  // Close contact panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header')) {
        closeAllMenus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  useEffect(() => {
    // Close mobile sidebar when location changes
    setOpenSidebar(false);
  }, [location]);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleAdminClick = () => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleContactClick = (e) => {
    e.stopPropagation();

    setMegaMenuOpen(null);
    setClickedMenu(null);
    setOpenFlawedGroup(null);

    setContactOpen(prev => !prev);
  };


  const handleMenuClick = (menuName) => {
    if (megaMenuOpen === menuName) {
      closeAllMenus();
      return;
    }

    setContactOpen(false);
    setOpenFlawedGroup(null);
    setClickedMenu(menuName);
    setMegaMenuOpen(menuName);
  };

  const toggleFlawedGroup = (index) => {
    setOpenFlawedGroup(openFlawedGroup === index ? null : index);
  };

  const megaMenuData = {
    'reference-standards': {
      title: 'Reference Standards',
      description: 'High-quality calibration blocks for various NDT methods',
      image: r,
      items: [
        { name: 'UT Calibration blocks', link: '/calibration-blocks/ut' },
        { name: 'PAUT Calibration blocks', link: '/calibration-blocks/paut' },
        { name: 'ToFD Calibration blocks', link: '/calibration-blocks/tofd' },
        { name: 'MT / PT Calibration blocks', link: '/calibration-blocks/mt-pt' },
        { name: 'ET Calibration blocks', link: '/calibration-blocks/et' },
        { name: 'ECT/RFT/MFL Calibration blocks', link: '/calibration-blocks/ect-rft-mfl' },
        { name: 'APR Calibration blocks', link: '/calibration-blocks/apr' },
        { name: 'AUT-Z Calibration blocks', link: '/calibration-blocks/aut-z' }
      ]
    },

    'flawed-specimens': {
      title: 'Flawed Specimens',
      description: 'Precision-manufactured flawed specimens for training and testing',
      image: f,
      isGrouped: true,
      groups: [
        {
          title: "Training and Examination Flawed specimens",
          items: [
            { name: 'Ultrasonic Testing', link: '/flawed-specimens/ultrasonic' },
            { name: 'Dye Penetrant', link: '/flawed-specimens/dye-penetrant' },
            { name: 'Eddy Current', link: '/flawed-specimens/eddy-current' },
            { name: 'Radiography', link: '/flawed-specimens/radiography' },
            { name: 'Visual Testing', link: '/flawed-specimens/visual-testing' },
            { name: 'PAUT & ToFD', link: '/flawed-specimens/paut-tofd' },
            { name: 'Welded Specimens', link: '/flawed-specimens/welded' },
            { name: 'Base Material', link: '/flawed-specimens/base-material' },
            { name: 'Advanced Validation', link: '/flawed-specimens/advanced' },
            { name: 'POD & Training', link: '/flawed-specimens/pod-training' }
          ]
        },
        {
          title: "NDT Flawed Specimens Kit",
          items: [
            { name: 'UT Flawed Specimens Kit', link: '/flawed-specimens/ut-kit' },
            { name: 'NDT Standards Kit', link: '/flawed-specimens/standards-kit' },
            { name: 'MT Flawed Specimens Kit', link: '/flawed-specimens/mt-kit' },
            { name: 'PT Flawed Specimens Kit', link: '/flawed-specimens/pt-kit' },
            { name: 'RT Flawed Specimens Kit', link: '/flawed-specimens/rt-kit' },
            { name: 'ET Flawed Specimens Kit', link: '/flawed-specimens/et-kit' },
            { name: 'PAUT & ToFD Kit', link: '/flawed-specimens/paut-tofd-kit' }
          ]
        }
      ]
    },

    'validation-blocks': {
      title: 'Validation Blocks',
      description: 'Certified validation blocks for equipment calibration',
      image: v,
      items: [
        { name: 'UT Validation Blocks', link: '/validation-blocks/ut' },
        { name: 'PAUT / ToFD Validation Blocks', link: '/validation-blocks/paut-tofd' },
        { name: 'Boiler Tube PAUT Validation blocks', link: '/validation-blocks/boiler-tube' }
      ]
    },

    'resources': {
      title: 'Resources',
      description: 'Technical resources, certifications, and tools for NDT professionals',
      image: o,
      items: [
        { name: 'Gallery', link: '/resources/gallery' },
        { name: 'Certifications', link: '/resources/certifications' },
        { name: 'Downloads', link: '/resources/downloads' },
        { name: 'PAUT & ToFD Validation Blocks Calculator', link: '/resources/calculator' }
      ]
    },

    'company': {
      title: 'Company',
      description: 'Learn about DAKS NDT Services - Our team, facilities, and vision',
      image: c,
      items: [
        { name: 'About Us', link: '/company/about' },
        { name: 'Our Team', link: '/company/team' },
        { name: 'Our Clients', link: '/company/business-partners' }
      ]
    }
  };

  const handleSubcategoryClick = (link) => {
    setMegaMenuOpen(null);
    setClickedMenu(null);
    setOpenFlawedGroup(null);
    navigate(link);
  };

  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes('/calibration-blocks') || path.includes('/reference-standards')) return 'reference-standards';
    else if (path.includes('/flawed-specimens')) return 'flawed-specimens';
    else if (path.includes('/validation-blocks')) return 'validation-blocks';
    else if (path.includes('/resources')) return 'resources';
    else if (path.includes('/company')) return 'company';
    return null;
  };

  const activeMenu = getActiveMenu();

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo">
          <Link
            to="/"
            onClick={() => {
              setClickedMenu(null);
              setMegaMenuOpen(null);
              setOpenFlawedGroup(null);
            }}
          >
            <img src={daksLogo} alt="DAKS NDT Services Logo" className="logo-image" />
          </Link>
        </div>

        {/* Hamburger */}
        <div
          className="hamburger-menu"
          onClick={() => setOpenSidebar(true)}
          aria-label="Open menu"
          role="button"
          tabIndex={0}
        >
          ☰
        </div>

        {/* Desktop Nav */}
        <nav className="main-nav">
          <ul>
            <li className={`has-mega-menu ${activeMenu === 'reference-standards' ? 'active' : ''}`} onClick={() => handleMenuClick('reference-standards')}>
              <Link to="/reference-standards" onClick={(e) => e.preventDefault()}>Reference Standards</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'flawed-specimens' ? 'active' : ''}`} onClick={() => handleMenuClick('flawed-specimens')}>
              <Link to="/flawed-specimens" onClick={(e) => e.preventDefault()}>Flawed Specimens</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'validation-blocks' ? 'active' : ''}`} onClick={() => handleMenuClick('validation-blocks')}>
              <Link to="/validation-blocks" onClick={(e) => e.preventDefault()}>Validation Blocks</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'resources' ? 'active' : ''}`} onClick={() => handleMenuClick('resources')}>
              <Link to="/resources" onClick={(e) => e.preventDefault()}>Resources</Link>
            </li>

            <li className={`has-mega-menu ${activeMenu === 'company' ? 'active' : ''}`} onClick={() => handleMenuClick('company')}>
              <Link to="/company" onClick={(e) => e.preventDefault()}>Company</Link>
            </li>

            <li className="simple-menu-item">
              <Link to="/quickcontact" onClick={closeAllMenus}>Contact Us</Link>
            </li>
          </ul>
        </nav>

        {/* Header Actions - Simple Icon Buttons */}
        <div className="header-actions-container">
          {/* Home button - Direct navigation */}
          <div
            className="header-action-item"
            onClick={handleHomeClick}
            title="Go to Home"
          >
            <FaHome className="header-icon" />
          </div>

          {/* Cart button - Direct navigation */}
          <div
            className="header-action-item"
            onClick={handleCartClick}
            title="View Cart"
          >
            <FaShoppingCart className="header-icon" />
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </div>

          {/* Admin button - Direct navigation */}
          <div
            className="header-action-item"
            onClick={handleAdminClick}
            title={isAdmin ? "Admin Dashboard" : "Admin Login"}
          >
            <FaUserTie className="header-icon" />
          </div>

          {/* Info/Contact button - Toggle contact panel */}
          <div
            className="header-action-item contact-dropdown-trigger"
            onClick={handleContactClick}
            title="Contact Information"
          >
            <FaInfoCircle className={`header-icon ${contactOpen ? 'active' : ''}`} />
          </div>
        </div>

        {/* Contact Panel Dropdown */}
        <div
          className={`contact-panel-dropdown ${contactOpen ? 'show' : ''}`}
          ref={contactPanelRef}
        >
          {/* 1. DAKS NDT SERVICES PROFILE */}
          <div className="contact-company-info">
            <h3 className="company-title">DAKS NDT Services</h3>
            <p className="company-subtitle">Advanced Non-Destructive Testing Solutions • Inspection • Safety • Reliability</p>
            <p className="contact-label">Address</p>
            <p>Babu Garden, No.163,<br />Narasimman Street, 2nd St,<br />Sikkarayapuram, Tamil Nadu 600128<br />India</p>
            <p className="contact-label">Phone</p><p>087784 23621</p>
            <p className="contact-label">Email</p><p>sales@dakstools.com</p>
            <p className="contact-label">Hours</p><p>Open 24 Hours</p>
          </div>

          {/* 2. === SECOND COMPANY PROFILE (EDIT HERE) === */}
          <div className="contact-company-info">
            <h3 className="company-title">Alpha Sonix NDT Solutions</h3>
            <p className="company-subtitle">Smart NDT Solutions • Insight Beyond the Surface • Built on Reliability</p>
            <p className="contact-label">Address</p>
            <p>Babu Garden, No.163,<br />Narasimman Street, 2nd St,<br />Sikkarayapuram, Tamil Nadu 600128<br />India</p>
            <p className="contact-label">Phone</p><p>087784 23621</p>
            <p className="contact-label">Email</p><p>sales@dakstools.com</p>
            <p className="contact-label">Hours</p><p>Open 24 Hours</p>
          </div>

          {/* 3. GET IN TOUCH IMAGES */}
          <div className="contact-get-in-touch">
            <h3>Get in Touch With Us</h3>
            <div className="contact-panel-item">
              <img src={h1} alt="Support" className="contact-item-image" />
              <div><h4>NDT Inspection Support</h4><p>Fast and reliable service.</p></div>
            </div>
            <div className="contact-panel-item">
              <img src={h2} alt="Areas" className="contact-item-image" />
              <div><h4>Service Areas</h4><p>We provide on-site NDT services.</p></div>
            </div>
            <div className="contact-panel-item">
              <img src={h3} alt="Career" className="contact-item-image" />
              <div><h4>Careers</h4><p>Join our professional team.</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* MEGA MENU */}
      {megaMenuOpen && megaMenuData[megaMenuOpen] && (
        <div
          className="mega-menu-dropdown"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="mega-menu-container">
            <div className="mega-menu-content">

              <div className="mega-menu-left">
                <h2 className="mega-menu-title">{megaMenuData[megaMenuOpen].title}</h2>
                <p className="mega-menu-description">{megaMenuData[megaMenuOpen].description}</p>

                {/* GROUPED FLAWED SPECIMENS */}
                {megaMenuData[megaMenuOpen].isGrouped ? (
                  <div className="mega-menu-grouped-content">
                    {megaMenuData[megaMenuOpen].groups.map((group, gIndex) => (
                      <div key={gIndex} className="mega-menu-group">

                        {/* CLICKABLE GROUP TITLE */}
                        <h4
                          className="mega-menu-group-title"
                          onClick={() => toggleFlawedGroup(gIndex)}
                        >
                          {group.title} <span className="group-toggle-icon">{openFlawedGroup === gIndex ? "▲" : "▼"}</span>
                        </h4>

                        {/* ONLY OPEN SELECTED GROUP */}
                        {openFlawedGroup === gIndex && (
                          <div className="mega-menu-links">
                            {group.items.map((item, index) => (
                              <div
                                key={index}
                                className="mega-menu-link"
                                onClick={() => handleSubcategoryClick(item.link)}
                              >
                                <span className="link-arrow">→</span>{item.name}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                ) : (
                  /* OTHER MENUS NORMAL */
                  <div className="mega-menu-links">
                    {megaMenuData[megaMenuOpen].items.map((item, index) => (
                      <div key={index} className="mega-menu-link" onClick={() => handleSubcategoryClick(item.link)}>
                        <span className="link-arrow">→</span>{item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mega-menu-right">
                <img src={megaMenuData[megaMenuOpen].image} alt={megaMenuData[megaMenuOpen].title} className="mega-menu-image" />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MOBILE SIDEBAR */}
      <div className={`mobile-sidebar ${openSidebar ? "active" : ""}`}>
        {/* Header */}
        <div className="mobile-sidebar-header">
          <h3>DAKS NDT Services</h3>
          <button className="close-sidebar" onClick={() => setOpenSidebar(false)} aria-label="Close menu">×</button>
        </div>

        {/* Scrollable Content */}
        <div className="mobile-sidebar-content">
          {/* Cart link for mobile */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Your Cart</div>
            <Link to="/cart" onClick={() => setOpenSidebar(false)}>
              View Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>

          {/* Reference Standards */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Reference Standards</div>
            {megaMenuData['reference-standards'].items.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                onClick={() => setOpenSidebar(false)}
                className={location.pathname === item.link ? 'active' : ''}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Flawed Specimens */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Flawed Specimens</div>
            {megaMenuData['flawed-specimens'].groups.map((group, gIdx) => (
              <div key={gIdx} className="mobile-nav-group">
                <div
                  className="mobile-nav-group-title"
                  onClick={() => toggleFlawedGroup(gIdx)}
                >
                  {group.title}
                  <span className="group-toggle-icon-mobile">{openFlawedGroup === gIdx ? "▲" : "▼"}</span>
                </div>
                {openFlawedGroup === gIdx && group.items.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    onClick={() => setOpenSidebar(false)}
                    className={location.pathname === item.link ? 'active' : ''}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Validation Blocks */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Validation Blocks</div>
            {megaMenuData['validation-blocks'].items.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                onClick={() => setOpenSidebar(false)}
                className={location.pathname === item.link ? 'active' : ''}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Resources</div>
            {megaMenuData['resources'].items.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                onClick={() => setOpenSidebar(false)}
                className={location.pathname === item.link ? 'active' : ''}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Company</div>
            {megaMenuData['company'].items.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                onClick={() => setOpenSidebar(false)}
                className={location.pathname === item.link ? 'active' : ''}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Quick Links</div>
            <Link to="/contact" onClick={() => setOpenSidebar(false)}>
              Contact Us
            </Link>
            <Link to="/" onClick={closeAllMenus}>

              Home
            </Link>
            <Link
              to={isAdmin ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setOpenSidebar(false)}
            >
              {isAdmin ? "Admin Dashboard" : "Admin Login"}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mobile-sidebar-footer">
          <p>© 2024 DAKS NDT Services</p>
        </div>
      </div>

      <div
        className={`sidebar-overlay ${openSidebar ? "active" : ""}`}
        onClick={() => setOpenSidebar(false)}
        aria-hidden="true"
      />
    </header>
  );
}

export default Header;