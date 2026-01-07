// pages/ReferenceStandards.js
import { BaseProductList } from "./BaseProductList";

function ReferenceStandards({ category: initialCategory }) {
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
    "All": "Industry-certified reference standards for accurate NDT calibration and validation",
    "UT Calibration Blocks": "Precision ultrasonic testing calibration blocks for thickness and flaw detection",
    "PAUT Calibration Blocks": "Phased Array Ultrasonic Testing calibration blocks for advanced inspections",
    "TOFD Calibration Blocks": "Time-of-Flight Diffraction calibration blocks for weld inspection",
    "MT/PT Calibration Blocks": "Magnetic Particle and Penetrant Testing reference standards",
    "ET Calibration Blocks": "Eddy Current Testing calibration standards for surface inspections",
    "ECT/RFT/MFL Calibration Tubes": "Tube inspection calibration standards for heat exchangers",
    "APR Reference Tubes": "Acoustic Pulse Reflectometry reference tubes for pipeline inspection",
    "AUT-Z Reference Blocks": "Automated Ultrasonic Testing reference blocks for pipeline girth welds"
  };

  return (
    <BaseProductList
      productType="calibration_block"
      categories={categories}
      categoryUrlMap={categoryUrlMap}
      pageTitle="Reference Standards"
      pageDescriptions={pageDescriptions}
      badgeText="NDT Excellence"
      initialCategory={initialCategory}
      config={{ BACKEND_URL: "http://192.168.1.9:5001" }}
    />
  );
}

export default ReferenceStandards;