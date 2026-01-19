// pages/FlawedSpecimens.js
import { BaseProductList } from "./BaseProductList";

function FlawedSpecimens({ category: initialCategory }) {
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
    "All": "Certified flawed specimens for NDT training, qualification, and probability of detection studies",
    "Ultrasonic Testing Flawed specimens": "UT flawed specimens for sensitivity, resolution, and defect characterization",
    "Dye Penetrant Flawed specimens": "Surface-breaking flaw specimens for PT training and certification",
    "Eddy Current Flawed specimens": "Conductive material specimens with artificial and natural flaws",
    "Radiography Flawed specimens": "Radiographic specimens for image interpretation and flaw sizing",
    "Visual testing Flawed specimens": "VT specimens for visual inspection training and evaluation",
    "Paut and ToFD Flawed specimens": "Advanced PAUT & TOFD flawed specimens for weld inspection",
    "Welded Specimens": "Welded flawed specimens with realistic fabrication defects",
    "Advanced NDT Validation Specimens": "High-precision specimens for POD and method validation"
  };

  return (
    <BaseProductList
      productType="flawed_specimen"
      categories={categories}
      categoryUrlMap={categoryUrlMap}
      pageTitle="Flawed Specimens"
      pageDescriptions={pageDescriptions}
      badgeText="NDT TRAINING & VALIDATION"
      initialCategory={initialCategory}
      // No need to pass config - it will use API_URL from environment
    />
  );
}

export default FlawedSpecimens;