import React from 'react';
import './css/AboutUs.css';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const aboutSeoData = {
    title: "About DAKS Tools | Leading NDT Equipment Manufacturer in Chennai, India",
    description: "DAKS Tools is a premier NDT equipment manufacturer in Chennai, India. ISO 17025 & ASME certified. 15+ years of excellence in ultrasonic calibration blocks, flawed specimens & NDT solutions.",
    keywords: "about DAKS Tools, NDT equipment manufacturer Chennai, ultrasonic calibration blocks India, NDT company Tamil Nadu, Alpha Sonix NDT Solutions, NDT testing instruments manufacturer, industrial inspection tools Chennai",
    canonicalUrl: "https://dakstools.com/company/about",
    ogImage: "https://dakstools.com/images/about-daks-tools.jpg"
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "name": "About DAKS Tools - NDT Equipment Manufacturer",
        "description": aboutSeoData.description,
        "url": aboutSeoData.canonicalUrl,
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
          "@type": "Organization",
          "name": "DAKS Tools",
          "alternateName": "Alpha Sonix NDT Solutions Pvt Ltd",
          "description": "Leading manufacturer of NDT calibration blocks, flawed specimens, and ultrasonic testing equipment in Chennai, India.",
          "foundingDate": "2020",
          "founder": {
            "@type": "Person",
            "name": "DAKS Tools Team"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Babu Garden, No.163, Narasimman Street, 2nd St, Sikkarayapuram",
            "addressLocality": "Chennai",
            "addressRegion": "Tamil Nadu",
            "postalCode": "600128",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-44-4501-5884",
            "contactType": "customer service",
            "email": "admin@dakstools.com",
            "areaServed": ["IN", "India"],
            "availableLanguage": ["English", "Tamil", "Hindi"]
          },
          "sameAs": [
            "https://in.linkedin.com/company/daks-tools",
            "https://www.alphasonix.in/"
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
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Company",
            "item": "https://dakstools.com/company"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "About Us",
            "item": "https://dakstools.com/company/about"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What does DAKS Tools specialize in?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools specializes in manufacturing high-precision NDT calibration blocks, flawed specimens, and ultrasonic testing equipment. We serve aerospace, oil & gas, automotive, and industrial sectors with ISO 17025 and ASME compliant products."
            }
          },
          {
            "@type": "Question",
            "name": "Where is DAKS Tools located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools is headquartered in Chennai, Tamil Nadu, India. Our manufacturing facility is located at Babu Garden, No.163, Narasimman Street, 2nd St, Sikkarayapuram, Chennai - 600128."
            }
          },
          {
            "@type": "Question",
            "name": "How many years of experience does DAKS Tools have?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools has over 15 years of combined industry experience in NDT technology. Our team brings decades of expertise in manufacturing precision calibration standards and inspection solutions."
            }
          },
          {
            "@type": "Question",
            "name": "What certifications does DAKS Tools hold?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools products comply with international standards including ISO 17025, ASME Section V, ASTM, and other relevant NDT certifications. We ensure full traceability and certification with every product."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* ==========================================
          SEO - REACT HELMET COMPONENT
      ========================================== */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{aboutSeoData.title}</title>
        <meta name="description" content={aboutSeoData.description} />
        <meta name="keywords" content={aboutSeoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={aboutSeoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={aboutSeoData.canonicalUrl} />
        <meta property="og:title" content="About DAKS Tools – Leading NDT Equipment Manufacturer in Chennai" />
        <meta property="og:description" content={aboutSeoData.description} />
        <meta property="og:image" content={aboutSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools - NDT Equipment Manufacturing Facility in Chennai" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:publisher" content="https://www.facebook.com/dakstools" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="About DAKS Tools – NDT Equipment Manufacturer India" />
        <meta name="twitter:description" content={aboutSeoData.description} />
        <meta name="twitter:image" content={aboutSeoData.ogImage} />
        <meta name="twitter:image:alt" content="DAKS Tools NDT Manufacturing Chennai" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(aboutSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="about-page">
        {/* 1. Page Container (Side Borders Effect) */}
        <div className="about-page-container">
          
          {/* 2. HERO HEADER */}
          <header className="about-header">
            <div className="about-header-overlay">
              <h1 className="about-header-title">About Us</h1>
              <div className="about-header-divider"></div>
              <p className="about-header-tagline">
                Discover the Future of Non-Destructive Testing with Us
              </p>
            </div>
          </header>

          {/* 3. MAIN CONTENT */}
          <main className="about-content-section">
            <div className="about-content-inner">
              
              {/* INTRO SECTION */}
              <div className="intro-section">
                <h2 className="section-title">Welcome to DAKS Tools</h2>
                <h3 className="section-subtitle">Leading Technologists in NDT and Manufacturer of Innovative Solutions</h3>
                <p className="section-text">
                  At DAKS Tools (a brand of Alpha Sonix NDT Solutions Pvt Ltd), we pride ourselves on being the premier technologist in the field of 
                  Non-Destructive Testing (NDT). With a strong commitment to excellence and a passion 
                  for innovation, we provide cutting-edge solutions that empower industries to ensure 
                  the highest quality and safety standards across India and global markets.
                </p>
              </div>

              {/* MISSION & VISION GRID */}
              <div className="mv-grid">
                
                {/* Mission Card */}
                <div className="mv-card">
                  <div className="mv-icon-wrapper">
                    {/* Target/Mission SVG Icon */}
                    <svg width="40" height="40" fill="none" stroke="#0066ff" strokeWidth="2" viewBox="0 0 24 24" aria-label="Mission Icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z" /> 
                    </svg>
                  </div>
                  <h3>Our Mission</h3>
                  <p>
                    To be a leading NDT technologist and provider of innovative solutions in Chennai and across India. 
                    We are driven by our passion for excellence and our commitment to delivering 
                    cutting-edge technology that revolutionizes the field of Non-Destructive Testing (NDT). 
                    Our goal is to empower industries with advanced solutions that ensure the highest 
                    quality standards, promote safety, and drive operational efficiency.
                  </p>
                </div>

                {/* Vision Card */}
                <div className="mv-card">
                  <div className="mv-icon-wrapper">
                    {/* Globe/Vision SVG Icon */}
                    <svg width="40" height="40" fill="none" stroke="#0066ff" strokeWidth="2" viewBox="0 0 24 24" aria-label="Vision Icon">
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                  </div>
                  <h3>Our Vision</h3>
                  <p>
                    To be a global leader in the field of Non-Destructive Testing (NDT) business. 
                    We aspire to shape the future of NDT by introducing groundbreaking technologies, 
                    driving innovation, and setting new industry standards. Our vision is centered 
                    around four key pillars that guide our path towards excellence and success.
                  </p>
                </div>

              </div>

              {/* WHY CHOOSE US SECTION */}
              <div className="why-choose-section">
                <h2 className="why-choose-title">Why Choose DAKS Tools for NDT Solutions</h2>
                
                <div className="why-choose-grid">
                  <div className="why-card">
                    <div className="why-card-number">01</div>
                    <h4>Industry Expertise</h4>
                    <p>
                      With decades of combined experience in NDT technology, our team possesses deep 
                      industry knowledge and technical proficiency to deliver superior solutions 
                      tailored to your specific needs in ultrasonic testing, calibration, and inspection.
                    </p>
                  </div>
                  
                  <div className="why-card">
                    <div className="why-card-number">02</div>
                    <h4>Cutting-Edge Innovation</h4>
                    <p>
                      We invest heavily in R&D to develop next-generation NDT solutions including 
                      advanced calibration blocks, flawed specimens, and validation standards that 
                      push the boundaries of quality assurance and structural integrity testing.
                    </p>
                  </div>
                  
                  <div className="why-card">
                    <div className="why-card-number">03</div>
                    <h4>Global Standards Compliance</h4>
                    <p>
                      All our products and services meet international quality standards 
                      including ISO 17025, ASME Section V, ASTM, and other NDT certifications, 
                      ensuring reliable performance across aerospace, oil & gas, and industrial sectors.
                    </p>
                  </div>
                  
                  <div className="why-card">
                    <div className="why-card-number">04</div>
                    <h4>Customized NDT Solutions</h4>
                    <p>
                      We understand that every inspection requirement is unique. Our team works 
                      closely with clients across India to develop customized NDT calibration 
                      standards and flawed specimens that address specific industry challenges.
                    </p>
                  </div>
                </div>

                {/* STATISTICS */}
                <div className="stats-section">
                  <h3 className="stats-title">Our Impact in Numbers</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">15+</div>
                      <div className="stat-label">Years of Excellence</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">500+</div>
                      <div className="stat-label">Projects Completed</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">30+</div>
                      <div className="stat-label">Countries Served</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">98%</div>
                      <div className="stat-label">Client Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMMITMENT SECTION */}
              <div className="commitment-section">
                <div className="commitment-content">
                  <h2>Our Commitment to Quality and Innovation</h2>
                  <div className="commitment-divider"></div>
                  <p>
                    Quality and innovation are the cornerstones of DAKS Tools. We adhere to stringent 
                    manufacturing processes, robust quality control measures, and continuous research 
                    and development at our Chennai facility. 
                  </p>
                  <p>
                    By embracing the latest advancements in NDT technology, we create products that not 
                    only meet but exceed industry standards. Our team of dedicated technologists and 
                    engineers relentlessly work towards delivering innovative solutions that drive 
                    exceptional performance and reliability for clients across India and international markets.
                  </p>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AboutUs;