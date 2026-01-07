// Footer.jsx
import { FaLinkedin, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Navigation Links */}
        <nav className="footer-nav">
          <ul>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/blog">Blogs</Link></li>
            <li><Link to="/cvalues">Corporate Values</Link></li>
            <li><Link to="/csra">CSR Activity</Link></li>
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className="social-links">
          <a
            href="https://in.linkedin.com/company/daks-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon linkedin"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a 
            href="https://wa.me/8778423621" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-icon whatsapp"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-icon facebook"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.alphasonix.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon alpha-sonix"
            aria-label="Alpha Sonix"
          >
            <span className="as-icon">AS</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;