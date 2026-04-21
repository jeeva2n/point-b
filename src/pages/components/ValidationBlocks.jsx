// pages/components/ValidationBlocks.jsx
import { BaseProductList } from "./BaseProductList";
import { Helmet } from 'react-helmet-async';

function ValidationBlocks({ category: initialCategory = "All" }) {
// In ValidationBlocks.jsx, update categories and related maps:

const categories = [
  "All",
  "UT Validation Blocks",
  "PAUT and ToFD Validation Blocks",
  "Boiler Tube PAUT Validation Blocks",
  "UT Custom Blocks"  // ← ADD THIS
];

const categoryUrlMap = {
  "All": "/validation-blocks",
  "UT Validation Blocks": "/validation-blocks/ut",
  "PAUT and ToFD Validation Blocks": "/validation-blocks/paut-tofd",
  "Boiler Tube PAUT Validation Blocks": "/validation-blocks/boiler-tube",
  "UT Custom Blocks": "/validation-blocks/ut-custom"  // ← ADD THIS
};

const pageDescriptions = {
  "All": "Precision-engineered validation blocks for NDT equipment calibration and accuracy verification. ISO 17025 certified. Manufactured by DAKS Tools in Chennai, India.",
  "UT Validation Blocks": "Ultrasonic testing validation blocks for thickness calibration, sensitivity verification, and velocity checks. Essential for UT equipment performance validation.",
  "PAUT and ToFD Validation Blocks": "Advanced validation blocks for phased array and TOFD inspection systems. Verify focal laws, beam steering, and sizing accuracy.",
  "Boiler Tube PAUT Validation Blocks": "Specialized PAUT validation blocks for boiler and heat exchanger tube inspection. Simulate real-world tube geometries and defect scenarios.",
  "UT Custom Blocks": "Custom-designed UT validation blocks tailored to your specific inspection requirements. Perfect for unique geometries, special materials, or non-standard calibration needs."  // ← ADD THIS
};

  // ==========================================
  // SEO METADATA & SCHEMA.ORG JSON-LD
  // ==========================================
  const getSeoData = (cat) => {
    const baseTitle = "Validation Blocks";
    const baseDesc = pageDescriptions[cat] || pageDescriptions["All"];
    const catPath = cat === "All" ? "" : cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const seoKeywords = {
      "All": "NDT validation blocks, equipment calibration blocks, NDT accuracy verification, UT validation standards, PAUT validation blocks Chennai",
      "UT Validation Blocks": "UT validation blocks, ultrasonic testing calibration, thickness validation blocks, sensitivity verification standards",
      "PAUT and ToFD Validation Blocks": "PAUT validation blocks, phased array calibration, TOFD validation standards, focal law verification blocks",
      "Boiler Tube PAUT Validation Blocks": "boiler tube PAUT validation, heat exchanger tube calibration, tube inspection validation blocks"
    };
    
    return {
      title: `${cat === "All" ? baseTitle : cat} | NDT Equipment Validation – DAKS Tools Chennai`,
      description: baseDesc,
      keywords: seoKeywords[cat] || seoKeywords["All"],
      canonicalUrl: `https://dakstools.com/validation-blocks${catPath ? `/${catPath}` : ''}`,
      ogImage: "https://dakstools.com/images/validation-blocks-daks-tools.jpg"
    };
  };

  const seoData = getSeoData(initialCategory || "All");

  const categorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": `${initialCategory || "Validation Blocks"} - DAKS Tools`,
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
            "name": "Validation Blocks",
            "item": "https://dakstools.com/validation-blocks"
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
            "name": "What are NDT validation blocks used for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NDT validation blocks are used to verify and validate the performance of NDT equipment, ensuring accurate calibration and reliable inspection results. They confirm that ultrasonic, phased array, and TOFD systems are functioning within specified parameters."
            }
          },
          {
            "@type": "Question",
            "name": "What types of validation blocks does DAKS Tools offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DAKS Tools offers UT validation blocks for thickness and sensitivity checks, PAUT and TOFD validation blocks for advanced system verification, and specialized Boiler Tube PAUT validation blocks for tube inspection applications."
            }
          },
          {
            "@type": "Question",
            "name": "How often should validation blocks be used?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Validation blocks should be used daily before inspections, after equipment changes, or whenever accuracy verification is required. DAKS Tools validation blocks are manufactured to ISO 17025 standards for reliable, repeatable results."
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
        productType="validation_block"
        categories={categories}
        categoryUrlMap={categoryUrlMap}
        pageTitle="Validation Blocks"
        pageDescriptions={pageDescriptions}
        badgeText="EQUIPMENT VALIDATION"
        initialCategory={initialCategory}
      />
    </>
  );
}

export default ValidationBlocks;