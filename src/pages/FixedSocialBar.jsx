import React from "react";
import { FaLinkedin, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import "./FixedSocialBar.css";

function FixedSocialBar() {
  return (
    <div className="fixed-social-bar">
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
  );
}

export default FixedSocialBar;