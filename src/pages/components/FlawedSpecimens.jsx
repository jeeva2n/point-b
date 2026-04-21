// pages/components/FlawedSpecimens.jsx
import { BaseProductList } from "./BaseProductList";
import { Helmet } from 'react-helmet-async';

function FlawedSpecimens({ category: initialCategory = "All" }) {
  const categories = [
    "All",
    "Training and Examination Flawed specimens",
    "Ultrasonic Testing Flawed specimens",
    "Dye Penetrant Flawed specimens",
    "Eddy Current Flawed specimens",
    "Radiography Flawed specimens",
    "Visual testing Flawed specimens",
    "Paut and ToFD Flawed specimens",
    "NDT Flawed Specimens Kit",
    "UT Flawed Specimens Kit",
    "NDT Standards Flawed Specimens Kit",
    "MT Flawed Specimens Kit",
    "PT Flawed Specimens Kit",
    "RT Flawed Specimens Kit",
    "ET Flawed Specimens Kit",
    "PAUT and ToFD Flawed Specimens Kit",
    "Welded Specimens",
    "Base Material Flawed Specimens",
    "Advanced NDT Validation Specimens",
    "POD & Training Specimens"
  ];

  const categoryUrlMap = {
    "All": "/flawed-specimens",
    "Training and Examination Flawed specimens": "/flawed-specimens/training-examination",
    "Ultrasonic Testing Flawed specimens": "/flawed-specimens/ultrasonic",
    "Dye Penetrant Flawed specimens": "/flawed-specimens/dye-penetrant",
    "Eddy Current Flawed specimens": "/flawed-specimens/eddy-current",
    "Radiography Flawed specimens": "/flawed-specimens/radiography",
    "Visual testing Flawed specimens": "/flawed-specimens/visual-testing",
    "Paut and ToFD Flawed specimens": "/flawed-specimens/paut-tofd",
    "NDT Flawed Specimens Kit": "/flawed-specimens/ndt-kit",
    "UT Flawed Specimens Kit": "/flawed-specimens/ut-kit",
    "NDT Standards Flawed Specimens Kit": "/flawed-specimens/standards-kit",
    "MT Flawed Specimens Kit": "/flawed-specimens/mt-kit",
    "PT Flawed Specimens Kit": "/flawed-specimens/pt-kit",
    "RT Flawed Specimens Kit": "/flawed-specimens/rt-kit",
    "ET Flawed Specimens Kit": "/flawed-specimens/et-kit",
    "PAUT and ToFD Flawed Specimens Kit": "/flawed-specimens/paut-tofd-kit",
    "Welded Specimens": "/flawed-specimens/welded",
    "Base Material Flawed Specimens": "/flawed-specimens/base-material",
    "Advanced NDT Validation Specimens": "/flawed-specimens/advanced",
    "POD & Training Specimens": "/flawed-specimens/pod-training"
  };

  const pageDescriptions = {
    "All": "Certified flawed specimens for NDT training, qualification, and probability of detection studies. ISO 17025 & ASME compliant. Manufactured by DAKS Tools in Chennai, India.",
    "Training and Examination Flawed specimens": "Comprehensive NDT training specimens with realistic flaws for certification and qualification programs. Used by ASNT Level III training centers.",
    "Ultrasonic Testing Flawed specimens": "UT flawed specimens for sensitivity, resolution, and defect characterization. Flat bottom holes, side-drilled holes, and natural flaws for ultrasonic calibration.",
    "Dye Penetrant Flawed specimens": "Surface-breaking flaw specimens for PT training and certification. Crack sensitivity panels and TAM panels for liquid penetrant testing.",
    "Eddy Current Flawed specimens": "Conductive material specimens with artificial and natural flaws for ET calibration and training. Surface and subsurface defect standards.",
    "Radiography Flawed specimens": "Radiographic specimens for image interpretation and flaw sizing. ASTM and ASME standard image quality indicators included.",
    "Visual testing Flawed specimens": "VT specimens for visual inspection training and evaluation. Weld discontinuities, surface conditions, and dimensional variations.",
    "Paut and ToFD Flawed specimens": "Advanced PAUT & TOFD flawed specimens for weld inspection. EDM notches and realistic weld defects for phased array training.",
    "NDT Flawed Specimens Kit": "Complete NDT training kit with specimens for UT, MT, PT, RT, and VT methods. Ideal for NDT schools and certification centers.",
    "Welded Specimens": "Welded flawed specimens with realistic fabrication defects including lack of fusion, porosity, slag inclusions, and cracks.",
    "Base Material Flawed Specimens": "Base material specimens with inherent and artificial flaws for material characterization and NDT method validation.",
    "Advanced NDT Validation Specimens": "High-precision specimens for POD studies and NDT method validation. Traceable to international standards.",
    "POD & Training Specimens": "Probability of Detection specimens with documented flaw sizes and locations for reliable POD curve development."
  };

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const getSeoData = (cat) => {
    const baseTitle = "Flawed Specimens";
    const baseDesc = pageDescriptions[cat] || pageDescriptions["All"];
    const catPath = cat === "All" ? "" : cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return {
      title: `${cat === "All" ? baseTitle : cat} | NDT Training & Certification – DAKS Tools Chennai`,
      description: baseDesc,
      keywords: `flawed specimens NDT, ${cat.toLowerCase()} specimens, NDT training specimens India, calibration blocks Chennai, DAKS Tools flawed specimens, ASME NDT specimens, ISO 17025 training blocks`,
      canonicalUrl: `https://dakstools.com/flawed-specimens${catPath ? `/${catPath}` : ''}`,
      ogImage: "https://dakstools.com/images/flawed-specimens-daks-tools.jpg"
    };
  };

  const seoData = getSeoData(initialCategory || "All");

  const categorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": `${initialCategory || "Flawed Specimens"} - DAKS Tools`,
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
            "name": "Flawed Specimens",
            "item": "https://dakstools.com/flawed-specimens"
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
            "name": "What are NDT flawed specimens used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NDT flawed specimens are used for technician training, certification examinations, method validation, and Probability of Detection (POD) studies. DAKS Tools manufactures ASME and ISO 17025 compliant specimens with realistic flaws for UT, MT, PT, RT, ET, and PAUT methods."
            }
          },
          {
            "@type": "Question",
            "name": "What types of flawed specimens does DAKS Tools offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools offers 19+ categories of flawed specimens including ultrasonic testing specimens, dye penetrant specimens, eddy current specimens, radiography specimens, welded specimens with realistic defects, and complete NDT training kits for certification programs."
            }
          },
          {
            "@type": "Question",
            "name": "Are DAKS Tools flawed specimens certified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all DAKS Tools flawed specimens are manufactured to ISO 17025 and ASME standards with full traceability and certification documentation. Our Chennai facility produces specimens trusted by NDT training centers and certification bodies worldwide."
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
        productType="flawed_specimen"
        categories={categories}
        categoryUrlMap={categoryUrlMap}
        pageTitle="Flawed Specimens"
        pageDescriptions={pageDescriptions}
        badgeText="NDT TRAINING & VALIDATION"
        initialCategory={initialCategory}
      />
    </>
  );
}

export default FlawedSpecimens;