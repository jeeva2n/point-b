// pages/components/ReferenceStandards.jsx
import { BaseProductList } from "./BaseProductList";
import { Helmet } from 'react-helmet-async';

function ReferenceStandards({ category: initialCategory = "All" }) {
  const categories = [
    "All",
    "UT Calibration Blocks",
    "PAUT Calibration Blocks",
    "TOFD Calibration Blocks",
    "MT/PT Calibration Blocks",
    "ET Calibration Blocks",
    "ECT/RFT/MFL Calibration Tubes",
    "APR Reference Tubes",
    "AUT-Z Reference Blocks"
  ];

  const categoryUrlMap = {
    "All": "/reference-standards",
    "UT Calibration Blocks": "/calibration-blocks/ut",
    "PAUT Calibration Blocks": "/calibration-blocks/paut",
    "TOFD Calibration Blocks": "/calibration-blocks/tofd",
    "MT/PT Calibration Blocks": "/calibration-blocks/mt-pt",
    "ET Calibration Blocks": "/calibration-blocks/et",
    "ECT/RFT/MFL Calibration Tubes": "/calibration-blocks/ect-rft-mfl",
    "APR Reference Tubes": "/calibration-blocks/apr",
    "AUT-Z Reference Blocks": "/calibration-blocks/aut-z"
  };

  const pageDescriptions = {
    "All": "Industry-certified reference standards and calibration blocks for accurate NDT calibration and validation. ISO 17025 & ASME compliant. Manufactured by DAKS Tools in Chennai, India.",
    "UT Calibration Blocks": "Precision ultrasonic testing calibration blocks for thickness measurement and flaw detection. FBH, SDH, step blocks, and custom UT standards with full certification.",
    "PAUT Calibration Blocks": "Phased Array Ultrasonic Testing calibration blocks for advanced inspections. Type A, Type B, and custom PAUT blocks for aerospace and oil & gas applications.",
    "TOFD Calibration Blocks": "Time-of-Flight Diffraction calibration blocks for weld inspection. ASME compliant blocks with precision EDM notches and side-drilled holes.",
    "MT/PT Calibration Blocks": "Magnetic Particle and Penetrant Testing reference standards. Crack sensitivity panels, TAM panels, and field indicators for MT/PT calibration.",
    "ET Calibration Blocks": "Eddy Current Testing calibration standards for surface and sub-surface inspections. Conductivity standards, coating thickness standards, and flaw reference blocks.",
    "ECT/RFT/MFL Calibration Tubes": "Tube inspection calibration standards for heat exchangers, boilers, and condensers. ASME standard tubes with artificial defects.",
    "APR Reference Tubes": "Acoustic Pulse Reflectometry reference tubes for pipeline inspection and tube testing calibration. Precision manufactured in Chennai.",
    "AUT-Z Reference Blocks": "Automated Ultrasonic Testing reference blocks for pipeline girth weld inspection. AUT-Z calibration standards for onshore and offshore applications."
  };

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const getSeoData = (cat) => {
    const baseTitle = "Reference Standards & Calibration Blocks";
    const baseDesc = pageDescriptions[cat] || pageDescriptions["All"];
    const catPath = cat === "All" ? "" : cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const seoKeywords = {
      "All": "NDT calibration blocks, reference standards India, ultrasonic test blocks, NDT calibration Chennai, ISO 17025 calibration, ASME calibration blocks",
      "UT Calibration Blocks": "UT calibration blocks, ultrasonic testing standards, FBH blocks, SDH blocks, step wedge blocks, ultrasonic reference blocks Chennai",
      "PAUT Calibration Blocks": "PAUT calibration blocks, phased array standards, Type A PAUT block, phased array ultrasonic testing calibration India",
      "TOFD Calibration Blocks": "TOFD calibration blocks, time of flight diffraction standards, ASME TOFD blocks, weld inspection calibration",
      "MT/PT Calibration Blocks": "MT calibration blocks, PT test panels, magnetic particle standards, dye penetrant calibration, TAM panels India",
      "ET Calibration Blocks": "eddy current calibration blocks, ET standards, conductivity reference blocks, coating thickness standards Chennai",
      "ECT/RFT/MFL Calibration Tubes": "ECT calibration tubes, RFT standards, MFL calibration tubes, heat exchanger tube standards, boiler tube calibration India",
      "APR Reference Tubes": "APR reference tubes, acoustic pulse reflectometry calibration, tube testing standards Chennai",
      "AUT-Z Reference Blocks": "AUT-Z calibration blocks, automated UT standards, pipeline inspection calibration, girth weld reference blocks"
    };
    
    return {
      title: `${cat === "All" ? baseTitle : cat} | NDT Calibration – DAKS Tools Chennai`,
      description: baseDesc,
      keywords: seoKeywords[cat] || seoKeywords["All"],
      canonicalUrl: `https://dakstools.com/reference-standards${catPath ? `/${catPath}` : ''}`,
      ogImage: "https://dakstools.com/images/reference-standards-daks-tools.jpg"
    };
  };

  const seoData = getSeoData(initialCategory || "All");

  const categorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": `${initialCategory || "Reference Standards"} - DAKS Tools`,
        "description": seoData.description,
        "url": seoData.canonicalUrl,
        "provider": {
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
            "name": "Reference Standards",
            "item": "https://dakstools.com/reference-standards"
          }
        ].concat(initialCategory && initialCategory !== "All" ? [{
          "@type": "ListItem",
          "position": 3,
          "name": initialCategory,
          "item": seoData.canonicalUrl
        }] : [])
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are NDT calibration blocks used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NDT calibration blocks are precision reference standards used to calibrate and verify the accuracy of ultrasonic, eddy current, and other NDT inspection equipment. They ensure reliable flaw detection and thickness measurements in critical applications."
            }
          },
          {
            "@type": "Question",
            "name": "What types of calibration blocks does DAKS Tools manufacture?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools manufactures UT calibration blocks (FBH, SDH, step blocks), PAUT blocks (Type A, Type B), TOFD blocks, MT/PT reference panels, ET conductivity standards, ECT/RFT/MFL calibration tubes, APR reference tubes, and AUT-Z reference blocks."
            }
          },
          {
            "@type": "Question",
            "name": "Are DAKS Tools calibration blocks ISO 17025 certified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all DAKS Tools calibration blocks and reference standards are manufactured to ISO 17025 and ASME Section V requirements with full traceability, material certification, and dimensional inspection reports from our Chennai facility."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={seoData.canonicalUrl} />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
        <meta name="geo.position" content="13.00938;80.10521" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:site_name" content="DAKS Tools" />
        <meta property="og:locale" content="en_IN" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />
        
        <script type="application/ld+json">
          {JSON.stringify(categorySchema)}
        </script>
      </Helmet>

      <BaseProductList
        productType="calibration_block"
        categories={categories}
        categoryUrlMap={categoryUrlMap}
        pageTitle="Reference Standards"
        pageDescriptions={pageDescriptions}
        badgeText="NDT Excellence"
        initialCategory={initialCategory}
      />
    </>
  );
}

export default ReferenceStandards;