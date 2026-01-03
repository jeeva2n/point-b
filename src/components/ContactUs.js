import { useNavigate } from "react-router-dom";
import "./ContactUs.css";

function Contact() {
  const navigate = useNavigate();

  return (
    <section className="contact-wrapper">
      <div className="contact-container">

        {/* Go Back Button */}
        <button className="go-back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>

        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          We are a trusted Non-Destructive Testing (NDT) service provider offering
          reliable inspection solutions across multiple industries.  
          Reach out to us for inspections, technical support, or business enquiries.
        </p>

        {/* Main Contact Grid */}
        <div className="contact-grid">
          <div className="contact-card">
            <h3>📍 Office Address</h3>
            <p>
              DAKS Tools & Services<br />
              Chennai, Tamil Nadu<br />
              India
            </p>
          </div>

          <div className="contact-card">
            <h3>📧 Email Communication</h3>
            <p><strong>General:</strong> support@dakstools.com</p>
            <p><strong>Sales:</strong> sales@dakstools.com</p>
            <p><strong>Technical:</strong> ndt@dakstools.com</p>
          </div>

          <div className="contact-card">
            <h3>📞 Phone Support</h3>
            <p>+91 87784 23621</p>
            <p>Mon – Sat | 9:00 AM – 6:00 PM</p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="contact-extra">
          <div className="extra-card">
            <h4>Industries We Serve</h4>
            <p>
              Oil & Gas, Power Plants, Refineries, Construction, Pipelines,
              Manufacturing, Aerospace, Heavy Engineering.
            </p>
          </div>

          <div className="extra-card">
            <h4>Our NDT Services</h4>
            <p>
              Ultrasonic Testing (UT), Radiographic Testing (RT),
              Magnetic Particle Testing (MPT), Liquid Penetrant Testing (LPT),
              Visual Testing (VT), Eddy Current Testing (ECT).
            </p>
          </div>

          <div className="extra-card">
            <h4>Why Choose Us</h4>
            <p>
              Certified inspectors, modern equipment, compliance with
              ASME / ASTM / ISO standards, and fast turnaround times.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="contact-cta">
          <p>
            Looking for inspection services or a technical consultation?
          </p>
          <button className="quote-btn">
            Request a Quote
          </button>
        </div>

      </div>
    </section>
  );
}

export default Contact;
