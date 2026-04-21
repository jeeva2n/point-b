import React from 'react';
import './css/BusinessPartners.css';
import { Helmet } from 'react-helmet-async';

// Webpack context to find images in src/assets/Gallary
const imageContext = require.context('../assets/Gallary', false, /\.(png|jpe?g|svg|PNG|JPG)$/);

const BusinessPartners = () => {
  const partners = [
    { name: "TechnipFMC", logo: "technipfmc.png" },
    { name: "Petrofac", logo: "petrofac.png" },
    { name: "Petronas", logo: "petronas.png" },
    { name: "Olympus", logo: "olympus.png" },
    { name: "Rutledge Omni Services", logo: "rutledge.png" },
    { name: "Shell", logo: "shell.png" },
    { name: "SAS", logo: "sas.png" },
    { name: "TechCorr", logo: "techcorr.png" },
    { name: "Titagarh", logo: "titagarh.png" },
    { name: "Total", logo: "total.png" },
    { name: "MMH", logo: "mmh.png" },
    { name: "Applus+ Velosi", logo: "applus-velosi.png" },
    { name: "VTV", logo: "vtv.png" },
    { name: "BGR Energy", logo: "bgr-energy.png" },
    { name: "Bharat Petroleum", logo: "bpcl.png" },
    { name: "Inspectors Union Co.", logo: "inspectors-union.png" },
    { name: "IndianOil", logo: "indianoil.png" },
    { name: "CHART", logo: "chart.png" },
    { name: "MISTRAS", logo: "mistras.png" },
    { name: "FIREMA", logo: "firema.png" },
    { name: "Nayara Energy", logo: "nayara.png" },
    { name: "KPC", logo: "kpc.png" },
    { name: "Larsen & Toubro", logo: "lt.png" },
    { name: "Madina Group", logo: "madina.png" },
    { name: "N-KOM", logo: "nkom.png" },
    { name: "NPCIL", logo: "npcil.png" },
    { name: "FOMAS Group", logo: "fomas.png" },
    { name: "Bureau Veritas", logo: "bureau-veritas.png" },
    { name: "HUDSON Products", logo: "hudson.png" },
    { name: "ISNT", logo: "isnt.png" },
    { name: "SGS", logo: "sgs.png" },
    { name: "North Oil Company", logo: "north-oil.png" },
  ];

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const partnersSeoData = {
    title: "Our Clients & Business Partners | DAKS Tools – Trusted by Global Industry Leaders",
    description: "DAKS Tools partners with 30+ global industry leaders including Shell, TechnipFMC, Petronas, L&T, IndianOil, and Bureau Veritas. Trusted NDT equipment supplier in Chennai with 4.9★ ratings.",
    keywords: "DAKS Tools clients, NDT business partners Chennai, Shell NDT supplier, TechnipFMC calibration blocks, Petronas NDT equipment, IndianOil inspection tools, L&T NDT partners, Bureau Veritas calibration standards, global NDT clients India",
    canonicalUrl: "https://dakstools.com/company/business-partners",
    ogImage: "https://dakstools.com/images/business-partners-daks-tools.jpg"
  };

  const partnersSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "name": "DAKS Tools Business Partners & Clients",
        "description": partnersSeoData.description,
        "url": partnersSeoData.canonicalUrl,
        "publisher": {
          "@type": "Organization",
          "name": "DAKS Tools",
          "url": "https://dakstools.com"
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
            "name": "Business Partners",
            "item": "https://dakstools.com/company/business-partners"
          }
        ]
      },
      {
        "@type": "Organization",
        "name": "DAKS Tools",
        "url": "https://dakstools.com",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "474",
          "reviewCount": "1095"
        },
        "review": [
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Organization",
              "name": "Facebook Reviews"
            },
            "reviewBody": "474+ verified customer reviews on Facebook with 4.9 star rating."
          },
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Organization",
              "name": "IndiaMart"
            },
            "reviewBody": "221+ verified business reviews on IndiaMart with 4.9 star rating."
          }
        ],
        "brand": {
          "@type": "Brand",
          "name": "DAKS Tools",
          "slogan": "Perfectly Different"
        },
        "knowsAbout": [
          "NDT Calibration Blocks",
          "Ultrasonic Testing Equipment",
          "Flawed Specimens",
          "Industrial Inspection Solutions"
        ],
        "areaServed": {
          "@type": "Country",
          "name": "India"
        }
      },
      {
        "@type": "ItemList",
        "name": "Trusted Business Partners & Clients",
        "description": "Global industry leaders partnering with DAKS Tools for NDT equipment and calibration solutions.",
        "numberOfItems": partners.length,
        "itemListElement": partners.map((partner, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Organization",
            "name": partner.name
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who are DAKS Tools' major business partners?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools partners with 30+ global industry leaders including Shell, TechnipFMC, Petronas, Larsen & Toubro, IndianOil, Bharat Petroleum, Bureau Veritas, SGS, NPCIL, and many other Fortune 500 companies in oil & gas, aerospace, and manufacturing sectors."
            }
          },
          {
            "@type": "Question",
            "name": "What industries do DAKS Tools' clients represent?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our clients span oil & gas (Shell, Petronas, Total, BPCL, Nayara Energy), aerospace (FOMAS Group), engineering & construction (L&T, TechnipFMC, Petrofac), nuclear power (NPCIL), and inspection services (Bureau Veritas, SGS, MISTRAS, Applus+ Velosi)."
            }
          },
          {
            "@type": "Question",
            "name": "What is DAKS Tools' customer rating?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools maintains exceptional customer satisfaction with 4.9★ rating on Facebook (474+ reviews), 4.9★ on IndiaMart (221+ reviews), and 4.5★ from 400+ direct customers. Our 98% client satisfaction rate reflects our commitment to quality NDT solutions."
            }
          }
        ]
      }
    ]
  };

  // Helper to get image source safely
  const getLogoSrc = (filename, partnerName) => {
    try {
      return imageContext(`./${filename}`);
    } catch (err) {
      return `https://via.placeholder.com/200x100?text=${partnerName}`;
    }
  };

  return (
    <>
      {/* ==========================================
          SEO - REACT HELMET COMPONENT
      ========================================== */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{partnersSeoData.title}</title>
        <meta name="description" content={partnersSeoData.description} />
        <meta name="keywords" content={partnersSeoData.keywords} />
        <meta name="author" content="DAKS Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={partnersSeoData.canonicalUrl} />
        
        {/* Language and Geo Tags */}
        <meta httpEquiv="content-language" content="en-IN" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        <meta name="ICBM" content="13.00938,80.10521" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={partnersSeoData.canonicalUrl} />
        <meta property="og:title" content="DAKS Tools Clients – Trusted by Global Industry Leaders" />
        <meta property="og:description" content={partnersSeoData.description} />
        <meta property="og:image" content={partnersSeoData.ogImage} />
        <meta property="og:image:alt" content="DAKS Tools Business Partners - Shell, TechnipFMC, Petronas, L&T, IndianOil" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@DAKSTools" />
        <meta name="twitter:creator" content="@DAKSTools" />
        <meta name="twitter:title" content="DAKS Tools Clients – Global NDT Business Partners" />
        <meta name="twitter:description" content={partnersSeoData.description} />
        <meta name="twitter:image" content={partnersSeoData.ogImage} />
        <meta name="twitter:image:alt" content="DAKS Tools Global Business Partners" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(partnersSchema)}
        </script>
      </Helmet>

      {/* ==========================================
          EXISTING UI - COMPLETELY UNCHANGED
      ========================================== */}
      <div className="bp-page">
        {/* 1. Main Container (Creates the side borders/shadow effect) */}
        <div className="bp-page-container">
          
          {/* 2. HERO HEADER */}
          <header className="bp-header">
            <div className="bp-header-overlay">
              <h1 className="bp-header-title">Our Clients & Global Partners</h1>
              <div className="bp-header-divider"></div>
              <p className="bp-header-tagline">
                Trusted by 30+ Industry Leaders Across Oil & Gas, Aerospace, and Manufacturing
              </p>
            </div>
          </header>

          {/* 3. MAIN CONTENT */}
          <main className="bp-content-section">
            <div className="bp-content-inner">
              
              {/* --- TRUST & RATINGS SECTION --- */}
              <div className="trust-section">
                <div className="trust-grid">
                  
                  {/* Text Block */}
                  <div className="trust-text-block">
                    <h2>Our NDT solutions are trusted by Fortune 500 companies, engineering leaders, and inspection professionals across 30+ countries.</h2>
                    <div className="trust-divider"></div>
                  </div>

                  {/* Rating Cards */}
                  <div className="trust-cards-container">
                    
                    {/* Facebook Card */}
                    <div className="rating-card">
                      <div className="rating-header">
                        <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24" aria-label="Facebook"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span className="platform-name">Facebook</span>
                      </div>
                      <div className="rating-score">
                        <span className="score">4.9</span>
                        <div className="stars">★★★★★</div>
                      </div>
                      <div className="rating-count">474+ verified reviews</div>
                    </div>

                    {/* IndiaMart Card */}
                    <div className="rating-card">
                      <div className="rating-header">
                        <svg width="20" height="20" fill="#2e7d32" viewBox="0 0 24 24" aria-label="IndiaMart"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                        <span className="platform-name">IndiaMart</span>
                      </div>
                      <div className="rating-score">
                        <span className="score">4.9</span>
                        <div className="stars">★★★★★</div>
                      </div>
                      <div className="rating-count">221+ business reviews</div>
                    </div>

                    {/* Customer Card */}
                    <div className="rating-card">
                      <div className="rating-header">
                        <svg width="20" height="20" fill="#f57f17" viewBox="0 0 24 24" aria-label="Customer Satisfaction"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                        <span className="platform-name">Direct Clients</span>
                      </div>
                      <div className="rating-score">
                        <span className="score">4.5</span>
                        <div className="stars">★★★★<span className="half-star">★</span></div>
                      </div>
                      <div className="rating-count">400+ client ratings</div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Intro Text */}
              <div className="bp-intro">
                <p>
                  We are proud to collaborate with industry leaders in energy, manufacturing, 
                  aerospace, and engineering sectors. Our shared commitment to quality NDT solutions 
                  and innovation drives critical inspection projects forward across India and global markets.
                </p>
              </div>

              {/* Logo Grid */}
              <div className="bp-grid">
                {partners.map((partner, index) => (
                  <div key={index} className="bp-card">
                    <div className="bp-logo-wrapper">
                      <img
                        src={getLogoSrc(partner.logo, partner.name)}
                        alt={`${partner.name} - Official NDT Business Partner of DAKS Tools`}
                        className="bp-logo"
                        loading="lazy"
                        title={`${partner.name} - Trusted Client of DAKS Tools`}
                      />
                    </div>
                    <div className="bp-tooltip">{partner.name}</div>
                  </div>
                ))}
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default BusinessPartners;