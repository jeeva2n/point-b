// pages/ValidationBlocks.js
import { BaseProductList } from "./BaseProductList";

function ValidationBlocks({ category: initialCategory }) {
  const categories = [
    "All",
    "UT Validation Blocks",
    "PAUT and ToFD Validation Blocks",
    "Boiler Tube PAUT Validation Blocks"
  ];

  const categoryUrlMap = {
    "All": "/validation-blocks",
    "UT Validation Blocks": "/validation-blocks/ut",
    "PAUT and ToFD Validation Blocks": "/validation-blocks/paut-tofd",
    "Boiler Tube PAUT Validation Blocks": "/validation-blocks/boiler-tube"
  };

  const pageDescriptions = {
    "All": "Precision-engineered validation blocks for equipment calibration and NDT accuracy verification",
    "UT Validation Blocks": "Ultrasonic testing validation blocks for thickness, sensitivity, and velocity checks",
    "PAUT and ToFD Validation Blocks": "Advanced validation blocks for phased array and TOFD inspections",
    "Boiler Tube PAUT Validation Blocks": "Specialized PAUT validation blocks for boiler and heat exchanger tube inspection"
  };

  return (
    <BaseProductList
      productType="validation_block"
      categories={categories}
      categoryUrlMap={categoryUrlMap}
      pageTitle="Validation Blocks"
      pageDescriptions={pageDescriptions}
      badgeText="EQUIPMENT VALIDATION"
      initialCategory={initialCategory}
      // No need to pass config - it will use API_URL from environment
    />
  );
}

export default ValidationBlocks;