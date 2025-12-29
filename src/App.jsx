import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';
import './App.css';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const CalibrationBlocks = lazy(() => import('./pages/CalibrationBlocks'));
const ProductCatalogue = lazy(() => import('./pages/ProductCatalogue'));
const Company = lazy(() => import('./pages/Company'));
const Career = lazy(() => import('./pages/Career'));
const Blog = lazy(() => import('./pages/Blog'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const DownloadsDocs = lazy(() => import('./pages/DownloadsDocs'));
const ReachOut = lazy(() => import('./pages/ReachOut'));
const ReferenceStandards = lazy(() => import('./pages/ReferenceStandards'));
const FlawedSpecimens = lazy(() => import('./pages/FlawedSpecimens'));
const ValidationBlocks = lazy(() => import('./pages/ValidationBlocks'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));

// Commented out: Component not yet created
// import ContactUs from './pages/ContactUs';

// Commented out: Resource pages not yet created
// import Gallery from './pages/resources/Gallery';
// import Certifications from './pages/resources/Certifications';
// import Downloads from './pages/resources/Downloads';
// import Calculator from './pages/resources/Calculator';

// Commented out: Company pages not yet created
// import AboutUs from './pages/company/AboutUs';
// import OurTeam from './pages/company/OurTeam';
// import Facilities from './pages/company/Facilities';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Loading component (optional - you can customize this)
function LoadingFallback() {
  return <div className="loading">Loading...</div>;
}

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* ==========================================
                PUBLIC ROUTES - HOME
            ========================================== */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Product Detail Route - This handles all product types */}
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* ==========================================
                REFERENCE STANDARDS ROUTES
            ========================================== */}
            <Route path="/reference-standards" element={<ReferenceStandards />} />
            <Route path="/calibration-blocks/:category" element={<ReferenceStandards />} />
            <Route path="/calibration-blocks" element={<ReferenceStandards />} />
            <Route path="/calibration-blocks/ut" element={<ReferenceStandards category="UT Calibration Blocks" />} />
            <Route path="/calibration-blocks/paut" element={<ReferenceStandards category="PAUT Calibration Blocks" />} />
            <Route path="/calibration-blocks/tofd" element={<ReferenceStandards category="TOFD Calibration Blocks" />} />
            <Route path="/calibration-blocks/mt-pt" element={<ReferenceStandards category="MT/PT Calibration Blocks" />} />
            <Route path="/calibration-blocks/et" element={<ReferenceStandards category="ET Calibration Blocks" />} />
            <Route path="/calibration-blocks/ect-rft-mfl" element={<ReferenceStandards category="ECT/RFT/MFL Calibration Tubes" />} />
            <Route path="/calibration-blocks/apr" element={<ReferenceStandards category="APR Reference Tubes" />} />
            <Route path="/calibration-blocks/aut-z" element={<ReferenceStandards category="AUT-Z Reference Blocks" />} />

            {/* ==========================================
                FLAWED SPECIMENS ROUTES
            ========================================== */}
            <Route path="/flawed-specimens" element={<FlawedSpecimens />} />
            <Route path="/flawed-specimens/training-examination" element={<FlawedSpecimens category="Training and Examination Flawed specimens" />} />
            <Route path="/flawed-specimens/ultrasonic" element={<FlawedSpecimens category="Ultrasonic Testing Flawed specimens" />} />
            <Route path="/flawed-specimens/dye-penetrant" element={<FlawedSpecimens category="Dye Penetrant Flawed specimens" />} />
            <Route path="/flawed-specimens/eddy-current" element={<FlawedSpecimens category="Eddy Current Flawed specimens" />} />
            <Route path="/flawed-specimens/radiography" element={<FlawedSpecimens category="Radiography Flawed specimens" />} />
            <Route path="/flawed-specimens/visual-testing" element={<FlawedSpecimens category="Visual testing Flawed specimens" />} />
            <Route path="/flawed-specimens/paut-tofd" element={<FlawedSpecimens category="Paut and ToFD Flawed specimens" />} />
            <Route path="/flawed-specimens/ndt-kit" element={<FlawedSpecimens category="NDT Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/ut-kit" element={<FlawedSpecimens category="UT Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/standards-kit" element={<FlawedSpecimens category="NDT Standards Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/mt-kit" element={<FlawedSpecimens category="MT Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/pt-kit" element={<FlawedSpecimens category="PT Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/rt-kit" element={<FlawedSpecimens category="RT Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/et-kit" element={<FlawedSpecimens category="ET Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/paut-tofd-kit" element={<FlawedSpecimens category="PAUT and ToFD Flawed Specimens Kit" />} />
            <Route path="/flawed-specimens/welded" element={<FlawedSpecimens category="Welded Specimens" />} />
            <Route path="/flawed-specimens/base-material" element={<FlawedSpecimens category="Base Material Flawed Specimens" />} />
            <Route path="/flawed-specimens/advanced" element={<FlawedSpecimens category="Advanced NDT Validation Specimens" />} />
            <Route path="/flawed-specimens/pod-training" element={<FlawedSpecimens category="POD & Training Specimens" />} />

            {/* ==========================================
                VALIDATION BLOCKS ROUTES
            ========================================== */}
            <Route path="/validation-blocks" element={<ValidationBlocks />} />
            <Route path="/validation-blocks/ut" element={<ValidationBlocks category="UT Validation Blocks" />} />
            <Route path="/validation-blocks/paut-tofd" element={<ValidationBlocks category="PAUT and ToFD Validation Blocks" />} />
            <Route path="/validation-blocks/boiler-tube" element={<ValidationBlocks category="Boiler Tube PAUT Validation Blocks" />} />

            {/* ==========================================
                RESOURCES ROUTES - Commented out
            ========================================== */}
            {/* <Route path="/resources" element={<Gallery />} /> */}
            {/* <Route path="/resources/gallery" element={<Gallery />} /> */}
            {/* <Route path="/resources/certifications" element={<Certifications />} /> */}
            {/* <Route path="/resources/downloads" element={<Downloads />} /> */}
            {/* <Route path="/resources/calculator" element={<Calculator />} /> */}

            {/* ==========================================
                COMPANY ROUTES - Commented out
            ========================================== */}
            <Route path="/company" element={<Company />} />
            {/* <Route path="/company/about" element={<AboutUs />} /> */}
            {/* <Route path="/company/team" element={<OurTeam />} /> */}
            {/* <Route path="/company/facilities" element={<Facilities />} /> */}

            {/* ==========================================
                OTHER PAGES
            ========================================== */}
            {/* <Route path="/contact-us" element={<ContactUs />} /> */}
            <Route path="/product-catalogue" element={<ProductCatalogue />} />
            <Route path="/career" element={<Career />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/downloads-docs" element={<DownloadsDocs />} />
            <Route path="/reach-out" element={<ReachOut />} />

            {/* ==========================================
                ADMIN ROUTES
            ========================================== */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;