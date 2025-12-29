// AdminDashboard.js - PC View Enlarged Version
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define your product type categories
const productTypeCategories = {
  calibration_block: {
    navigation: "reference-standards",
    categories: [
      "UT Calibration Blocks",
      "PAUT Calibration Blocks", 
      "TOFD Calibration Blocks",
      "MT/PT Calibration Blocks",
      "ET Calibration Blocks",
      "ECT/RFT/MFL Calibration Tubes",
      "APR Reference Tubes",
      "AUT-Z Reference Blocks"
    ]
  },
  
  flawed_specimen: {
    navigation: "flawed-specimens",
    categories: [
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
    ]
  },
  
  validation_block: {
    navigation: "validation-blocks",
    categories: [
      "UT Validation Blocks",
      "PAUT and ToFD Validation Blocks",
      "Boiler Tube PAUT Validation Blocks"
    ]
  }
};

// Common materials for NDT products
const commonMaterials = [
  "Carbon Steel",
  "Stainless Steel 304",
  "Stainless Steel 316",
  "Aluminum 6061",
  "Aluminum 7075",
  "Titanium",
  "Inconel",
  "Copper",
  "Brass",
  "Steel 1018",
  "Steel 4340",
  "Duplex Steel",
  "Chrome Moly Steel",
  "Nickel Alloy",
  "Monel",
  "Hastelloy",
  "Zirconium",
  "Cast Iron",
  "Tool Steel",
  "Spring Steel"
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1440);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    type: "calibration_block",
    price: "",
    dimensions: "",
    tolerance: "",
    flaws: "",
    materials: [],
    customMaterial: "",
    images: [],
    mainImageIndex: 0,
    specifications: {}
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState("http://localhost:5000");
  const [imagePreview, setImagePreview] = useState([]);
  const [activeTab, setActiveTab] = useState("basic"); // basic, technical, images
  
  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      setIsLargeScreen(window.innerWidth > 1440);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get categories based on selected type
  const getCategoriesForType = (type) => {
    return productTypeCategories[type]?.categories || [];
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("Please login first");
      navigate("/admin/login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/products`);
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products || []);
        console.log("Products loaded:", data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    
    setFormData({ ...formData, images: files });
    
    // Create preview URLs
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImagePreview(previews);
  };

  // Remove image from selection
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newPreviews = [...imagePreview];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    
    // Adjust main image index if needed
    let newMainIndex = formData.mainImageIndex;
    if (index === formData.mainImageIndex) {
      newMainIndex = 0;
    } else if (index < formData.mainImageIndex) {
      newMainIndex = formData.mainImageIndex - 1;
    }
    
    setFormData({ ...formData, images: newImages, mainImageIndex: newMainIndex });
    setImagePreview(newPreviews);
  };

  // Set main image
  const setMainImage = (index) => {
    setFormData({ ...formData, mainImageIndex: index });
  };

  // Handle material selection
  const handleMaterialToggle = (material) => {
    const currentMaterials = [...formData.materials];
    const index = currentMaterials.indexOf(material);
    
    if (index === -1) {
      currentMaterials.push(material);
    } else {
      currentMaterials.splice(index, 1);
    }
    
    setFormData({ ...formData, materials: currentMaterials });
  };

  // Add custom material
  const addCustomMaterial = () => {
    if (formData.customMaterial.trim() && !formData.materials.includes(formData.customMaterial.trim())) {
      setFormData({
        ...formData,
        materials: [...formData.materials, formData.customMaterial.trim()],
        customMaterial: ""
      });
    }
  };

  // Remove material
  const removeMaterial = (material) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter(m => m !== material)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    console.log("📤 Submitting form data:", formData);
    
    if (!formData.name || !formData.category || !formData.type) {
      alert("Please fill all required fields!");
      setFormLoading(false);
      return;
    }
    
    const token = localStorage.getItem("admin_token");
    const data = new FormData();
    
    // Basic fields
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("type", formData.type);
    data.append("price", formData.price || 0);
    
    // New fields
    if (formData.dimensions) {
      data.append("dimensions", formData.dimensions);
    }
    if (formData.tolerance) {
      data.append("tolerance", formData.tolerance);
    }
    if (formData.flaws) {
      data.append("flaws", formData.flaws);
    }
    
    // Materials as JSON array
    data.append("materials", JSON.stringify(formData.materials));
    
    // Specifications as JSON
    if (Object.keys(formData.specifications).length > 0) {
      data.append("specifications", JSON.stringify(formData.specifications));
    }
    
    // Main image index
    data.append("mainImageIndex", formData.mainImageIndex);
    
    // Multiple images
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image) => {
        data.append("images", image);
      });
    }

    try {
      console.log("🚀 Sending request to:", `${backendUrl}/api/products`);
      const res = await fetch(`${backendUrl}/api/products`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      
      const result = await res.json();
      console.log("📥 Response:", result);

      if (result.success) {
        alert("✅ Product added successfully!");
        resetForm();
        fetchProducts();
      } else {
        alert(`❌ Error: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("❌ Failed to add product. Check console for details.");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      type: "calibration_block",
      price: "",
      dimensions: "",
      tolerance: "",
      flaws: "",
      materials: [],
      customMaterial: "",
      images: [],
      mainImageIndex: 0,
      specifications: {}
    });
    setImagePreview([]);
    setActiveTab("basic");
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  // Handle type change - reset category when type changes
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      category: ""
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await res.json();
      
      if (result.success) {
        alert("✅ Product deleted!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    navigate("/admin/login");
  };

  // View product details
  const viewProduct = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setEditingProduct(data.product);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Responsive styles with enlarged PC view
  const styles = {
    // Dashboard container - ENLARGED for PC
    dashboardContainer: {
      padding: isMobile ? "15px" : "30px",
      maxWidth: isLargeScreen ? "1800px" : "1400px",
      margin: "0 auto",
      background: "#f5f5f5",
      minHeight: "100vh",
      fontSize: isLargeScreen ? "1.05rem" : "1rem"
    },
    
    // Header - ENLARGED for PC
    header: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      marginBottom: "30px",
      alignItems: isMobile ? "flex-start" : "center",
      background: "white",
      padding: isMobile ? "15px" : "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      gap: isMobile ? "20px" : "0"
    },
    
    headerTitleContainer: {
      width: isMobile ? "100%" : "auto"
    },
    
    headerTitle: {
      margin: 0,
      color: "#333",
      fontSize: isMobile ? "1.3rem" : isLargeScreen ? "1.8rem" : "1.5rem"
    },
    
    headerSubtitle: {
      marginTop: "8px",
      color: "#666",
      fontSize: isMobile ? "12px" : isLargeScreen ? "1rem" : "14px"
    },
    
    headerActions: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "12px",
      width: isMobile ? "100%" : "auto",
      alignItems: isMobile ? "stretch" : "center"
    },
    
    backendUrlInput: {
      padding: isMobile ? "10px 12px" : "12px 15px",
      border: "1px solid #ced4da",
      borderRadius: "6px",
      width: isMobile ? "100%" : isLargeScreen ? "300px" : "250px",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "14px"
    },
    
    actionButton: {
      padding: isMobile ? "12px" : "12px 20px",
      background: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "14px",
      width: isMobile ? "100%" : "auto",
      textAlign: "center",
      fontWeight: "500",
      transition: "all 0.2s"
    },
    
    logoutButton: {
      padding: isMobile ? "12px" : "12px 20px",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "14px",
      width: isMobile ? "100%" : "auto",
      textAlign: "center",
      fontWeight: "500",
      transition: "all 0.2s"
    },
    
    // Grid layout - ENLARGED for PC
    gridContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isLargeScreen ? "550px 1fr" : "500px 1fr",
      gap: isMobile ? "20px" : "40px",
      alignItems: "start"
    },
    
    // Form container - ENLARGED for PC
    formContainer: {
      background: "white",
      padding: isMobile ? "20px" : isLargeScreen ? "35px" : "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      height: "fit-content",
      position: "sticky",
      top: "30px"
    },
    
    formTitle: {
      marginBottom: "25px",
      color: "#333",
      fontSize: isMobile ? "1.1rem" : isLargeScreen ? "1.5rem" : "1.3rem",
      fontWeight: "600"
    },
    
    // Tab navigation - ENLARGED for PC
    tabContainer: {
      display: "flex",
      gap: isMobile ? "3px" : "8px",
      marginBottom: "0",
      overflowX: isMobile ? "auto" : "visible",
      whiteSpace: "nowrap",
      paddingBottom: "8px"
    },
    
    tabButton: (isActive) => ({
      padding: isMobile ? "10px 15px" : isLargeScreen ? "15px 25px" : "12px 20px",
      background: isActive ? "#007bff" : "#f8f9fa",
      color: isActive ? "white" : "#495057",
      border: "none",
      cursor: "pointer",
      fontWeight: isActive ? "600" : "500",
      borderRadius: "8px 8px 0 0",
      fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px",
      minWidth: isMobile ? "90px" : "110px",
      flex: isMobile ? "1" : "none",
      borderBottom: isActive ? "3px solid #007bff" : "3px solid transparent",
      transition: "all 0.2s"
    }),
    
    // Form section - ENLARGED for PC
    formSection: {
      background: "#fff",
      padding: isMobile ? "15px" : isLargeScreen ? "30px" : "25px",
      borderRadius: "0 0 12px 12px",
      border: "1px solid #dee2e6",
      borderTop: "none"
    },
    
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#333",
      fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px"
    },
    
    input: {
      width: "100%",
      padding: isMobile ? "10px 12px" : isLargeScreen ? "14px 16px" : "12px 14px",
      border: "1px solid #ced4da",
      borderRadius: "8px",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
      transition: "border-color 0.2s, box-shadow 0.2s"
    },
    
    select: {
      width: "100%",
      padding: isMobile ? "10px 12px" : isLargeScreen ? "14px 16px" : "12px 14px",
      border: "1px solid #ced4da",
      borderRadius: "8px",
      background: "white",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
      transition: "border-color 0.2s, box-shadow 0.2s"
    },
    
    textarea: {
      width: "100%",
      padding: isMobile ? "10px 12px" : isLargeScreen ? "14px 16px" : "12px 14px",
      border: "1px solid #ced4da",
      borderRadius: "8px",
      resize: "vertical",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
      transition: "border-color 0.2s, box-shadow 0.2s"
    },
    
    formRow: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "12px" : "20px",
      marginBottom: isMobile ? "18px" : "25px"
    },
    
    // Material tags - ENLARGED for PC
    materialTag: (isSelected) => ({
      display: "inline-block",
      padding: isMobile ? "6px 10px" : isLargeScreen ? "8px 14px" : "7px 12px",
      margin: "4px",
      background: isSelected ? "#007bff" : "#e9ecef",
      color: isSelected ? "white" : "#333",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: isMobile ? "12px" : isLargeScreen ? "0.95rem" : "13px",
      border: isSelected ? "2px solid #0056b3" : "2px solid transparent",
      transition: "all 0.2s",
      fontWeight: isSelected ? "500" : "400"
    }),
    
    selectedMaterialTag: {
      display: "inline-flex",
      alignItems: "center",
      padding: isMobile ? "6px 10px" : isLargeScreen ? "8px 14px" : "7px 12px",
      margin: "4px",
      background: "#28a745",
      color: "white",
      borderRadius: "20px",
      fontSize: isMobile ? "12px" : isLargeScreen ? "0.95rem" : "13px",
      fontWeight: "500"
    },
    
    // Image preview - ENLARGED for PC
    imagePreviewContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(80px, 1fr))" 
                         : isLargeScreen ? "repeat(auto-fill, minmax(130px, 1fr))" 
                         : "repeat(auto-fill, minmax(110px, 1fr))",
      gap: isMobile ? "10px" : "15px",
      marginTop: "15px"
    },
    
    imagePreview: (isMain) => ({
      position: "relative",
      border: isMain ? "3px solid #28a745" : "1px solid #dee2e6",
      borderRadius: "10px",
      overflow: "hidden",
      aspectRatio: "1",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s"
    }),
    
    // Summary section - ENLARGED for PC
    summarySection: {
      marginTop: "25px",
      padding: isMobile ? "15px" : isLargeScreen ? "25px" : "20px",
      background: "#f8f9fa",
      borderRadius: "10px",
      border: "1px solid #dee2e6",
      fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px"
    },
    
    summaryTitle: {
      margin: "0 0 15px 0",
      color: "#333",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1.2rem" : "16px",
      fontWeight: "600"
    },
    
    // Action buttons - ENLARGED for PC
    formActions: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "10px" : "15px",
      marginTop: "25px"
    },
    
    resetButton: {
      flex: isMobile ? "none" : 1,
      padding: isMobile ? "12px" : isLargeScreen ? "16px" : "14px",
      background: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
      width: isMobile ? "100%" : "auto",
      fontWeight: "500",
      transition: "all 0.2s"
    },
    
    submitButton: (loading) => ({
      background: loading ? "#6c757d" : "#28a745",
      color: "white",
      padding: isMobile ? "12px" : isLargeScreen ? "16px" : "14px",
      border: "none",
      borderRadius: "8px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "16px",
      fontWeight: "600",
      flex: isMobile ? "none" : 2,
      width: isMobile ? "100%" : "auto",
      transition: "all 0.2s"
    }),
    
    // Products header - ENLARGED for PC
    productsHeader: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      marginBottom: "25px",
      background: "white",
      padding: isMobile ? "15px" : isLargeScreen ? "25px" : "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      gap: isMobile ? "15px" : "0"
    },
    
    productsTitle: {
      margin: 0,
      fontSize: isMobile ? "1.1rem" : isLargeScreen ? "1.5rem" : "1.3rem",
      fontWeight: "600"
    },
    
    statsContainer: {
      display: "flex",
      gap: isMobile ? "8px" : "12px",
      width: isMobile ? "100%" : "auto",
      justifyContent: isMobile ? "space-between" : "flex-end"
    },
    
    statBadge: {
      padding: isMobile ? "6px 10px" : isLargeScreen ? "10px 16px" : "8px 14px",
      borderRadius: "8px",
      fontSize: isMobile ? "12px" : isLargeScreen ? "1rem" : "14px",
      textAlign: "center",
      flex: isMobile ? "1" : "none",
      fontWeight: "500"
    },
    
    // Products grid - ENLARGED for PC
    productsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" 
                         : isLargeScreen ? "repeat(auto-fill, minmax(350px, 1fr))" 
                         : "repeat(auto-fill, minmax(320px, 1fr))",
      gap: isMobile ? "15px" : "25px"
    },
    
    // Product card - ENLARGED for PC
    productCard: {
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.3s, box-shadow 0.3s",
      border: "1px solid #e9ecef"
    },
    
    productImageContainer: {
      height: isMobile ? "160px" : isLargeScreen ? "220px" : "200px",
      background: "#f8f9fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative"
    },
    
    productInfo: {
      padding: isMobile ? "15px" : isLargeScreen ? "25px" : "20px"
    },
    
    productName: {
      margin: "0 0 12px 0",
      fontSize: isMobile ? "15px" : isLargeScreen ? "1.3rem" : "18px",
      color: "#333",
      fontWeight: "600",
      lineHeight: "1.3"
    },
    
    productCategory: {
      fontSize: isMobile ? "12px" : isLargeScreen ? "1rem" : "14px",
      color: "#0066cc",
      marginBottom: "12px",
      padding: "6px 12px",
      background: "#e7f5ff",
      borderRadius: "6px",
      display: "inline-block",
      fontWeight: "500"
    },
    
    productDescription: {
      fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "15px",
      color: "#666",
      margin: "0 0 15px 0",
      lineHeight: "1.5"
    },
    
    productPrice: {
      fontWeight: "bold",
      fontSize: isMobile ? "18px" : isLargeScreen ? "1.5rem" : "20px",
      color: "#28a745"
    },
    
    productActions: {
      display: "flex",
      gap: "10px"
    },
    
    viewButton: {
      background: "#007bff",
      color: "white",
      border: "none",
      padding: isMobile ? "8px 12px" : isLargeScreen ? "12px 18px" : "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px",
      fontWeight: "500",
      transition: "all 0.2s"
    },
    
    deleteButton: {
      background: "#dc3545",
      color: "white",
      border: "none",
      padding: isMobile ? "8px 12px" : isLargeScreen ? "12px 18px" : "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px",
      fontWeight: "500",
      transition: "all 0.2s"
    },
    
    // Modal styles - ENLARGED for PC
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: isMobile ? "15px" : "30px"
    },
    
    modalContent: {
      background: "white",
      borderRadius: "16px",
      maxWidth: isLargeScreen ? "1000px" : "800px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
    },
    
    modalHeader: {
      padding: isMobile ? "20px" : "25px",
      borderBottom: "1px solid #dee2e6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      background: "white",
      zIndex: 1
    },
    
    modalTitle: {
      margin: 0,
      fontSize: isMobile ? "1.2rem" : isLargeScreen ? "1.6rem" : "1.4rem",
      fontWeight: "600"
    },
    
    modalBody: {
      padding: isMobile ? "20px" : "30px"
    },
    
    modalFooter: {
      padding: isMobile ? "20px" : "25px",
      borderTop: "1px solid #dee2e6",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "12px",
      justifyContent: "flex-end"
    },
    
    modalButton: {
      padding: isMobile ? "12px 18px" : "14px 24px",
      background: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
      fontWeight: "500",
      width: isMobile ? "100%" : "auto",
      transition: "all 0.2s"
    },
    
    modalDeleteButton: {
      padding: isMobile ? "12px 18px" : "14px 24px",
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
      fontWeight: "500",
      width: isMobile ? "100%" : "auto",
      transition: "all 0.2s"
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Header - ENLARGED */}
      <header style={styles.header}>
        <div style={styles.headerTitleContainer}>
          <h1 style={styles.headerTitle}>
            🛠️ Admin Dashboard
          </h1>
          <p style={styles.headerSubtitle}>
            Manage your NDT products with enhanced features
          </p>
        </div>
        <div style={styles.headerActions}>
          <input 
            type="text" 
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            style={styles.backendUrlInput}
            placeholder="Backend URL"
          />
          <button 
            onClick={fetchProducts} 
            style={styles.actionButton}
          >
            🔄 Refresh Products
          </button>
          <button 
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={styles.gridContainer}>
        {/* Add Product Form - ENLARGED */}
        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>
            ➕ Add New Product
          </h3>
          
          {/* Tab Navigation */}
          <div style={styles.tabContainer}>
            <button 
              style={styles.tabButton(activeTab === "basic")}
              onClick={() => setActiveTab("basic")}
            >
              📝 Basic Info
            </button>
            <button 
              style={styles.tabButton(activeTab === "technical")}
              onClick={() => setActiveTab("technical")}
            >
              🔧 Technical
            </button>
            <button 
              style={styles.tabButton(activeTab === "images")}
              onClick={() => setActiveTab("images")}
            >
              🖼️ Images ({formData.images.length})
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formSection}>
              {/* BASIC INFO TAB */}
              {activeTab === "basic" && (
                <>
                  {/* Product Name */}
                  <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>Product Name *</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="e.g., ASME Calibration Block IIW Type"
                      style={styles.input}
                    />
                  </div>
                  
                  {/* Description */}
                  <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      placeholder="Detailed description of the product..."
                      style={{ ...styles.textarea, height: isMobile ? "100px" : "120px" }}
                    />
                  </div>
                  
                  {/* Type and Category */}
                  <div style={styles.formRow}>
                    <div>
                      <label style={styles.label}>Product Type *</label>
                      <select
                        value={formData.type}
                        onChange={handleTypeChange}
                        style={styles.select}
                      >
                        <option value="calibration_block">Calibration Block</option>
                        <option value="flawed_specimen">Flawed Specimen</option>
                        <option value="validation_block">Validation Block</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={styles.label}>Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        style={styles.select}
                      >
                        <option value="">Select category</option>
                        {getCategoriesForType(formData.type).map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Price */}
                  {/* <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      style={styles.input}
                    />
                  </div> */}
                </>
              )}

              {/* TECHNICAL TAB */}
              {activeTab === "technical" && (
                <>
                  {/* Dimensions */}
                  <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>Dimensions</label>
                    <input
                      value={formData.dimensions}
                      onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                      placeholder="e.g., 100mm x 50mm x 25mm"
                      style={styles.input}
                    />
                    <small style={{ 
                      color: "#666", 
                      fontSize: isMobile ? "12px" : isLargeScreen ? "0.9rem" : "13px",
                      marginTop: "5px",
                      display: "block"
                    }}>
                      Enter product dimensions (Length x Width x Height)
                    </small>
                  </div>
                  
                  {/* Tolerance (Optional) */}
                  <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>
                      Tolerance <span style={{ color: "#666", fontWeight: "normal" }}>(Optional)</span>
                    </label>
                    <input
                      value={formData.tolerance}
                      onChange={(e) => setFormData({...formData, tolerance: e.target.value})}
                      placeholder="e.g., ±0.02mm or ±0.001 inch"
                      style={styles.input}
                    />
                    <small style={{ 
                      color: "#666", 
                      fontSize: isMobile ? "12px" : isLargeScreen ? "0.9rem" : "13px",
                      marginTop: "5px",
                      display: "block"
                    }}>
                      Manufacturing tolerance specification
                    </small>
                  </div>
                  
                  {/* Flaws (Optional) */}
                  <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>
                      Flaws/Defects <span style={{ color: "#666", fontWeight: "normal" }}>(Optional)</span>
                    </label>
                    <textarea
                      value={formData.flaws}
                      onChange={(e) => setFormData({...formData, flaws: e.target.value})}
                      placeholder="e.g., Side drilled holes: 1.5mm, 3mm, 6mm diameter&#10;Notches: 2mm x 1mm at 0°, 45°, 90°"
                      style={{ ...styles.textarea, height: isMobile ? "80px" : "100px" }}
                    />
                    <small style={{ 
                      color: "#666", 
                      fontSize: isMobile ? "12px" : isLargeScreen ? "0.9rem" : "13px",
                      marginTop: "5px",
                      display: "block"
                    }}>
                      Describe intentional flaws/defects for testing purposes
                    </small>
                  </div>
                  
                  {/* Materials Selection */}
                  <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>Materials</label>
                    
                    {/* Selected Materials */}
                    {formData.materials.length > 0 && (
                      <div style={{ 
                        marginBottom: "15px", 
                        padding: "15px", 
                        background: "#e8f5e9", 
                        borderRadius: "8px",
                        border: "1px solid #c3e6cb"
                      }}>
                        <div style={{ 
                          color: "#2e7d32", 
                          fontWeight: "600",
                          fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px",
                          marginBottom: "8px"
                        }}>
                          Selected Materials ({formData.materials.length}):
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          {formData.materials.map((mat, idx) => (
                            <span key={idx} style={styles.selectedMaterialTag}>
                              {mat}
                              <button
                                type="button"
                                onClick={() => removeMaterial(mat)}
                                style={{
                                  marginLeft: "8px",
                                  background: "none",
                                  border: "none",
                                  color: "white",
                                  cursor: "pointer",
                                  fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "16px",
                                  fontWeight: "bold"
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Common Materials */}
                    <div style={{ 
                      maxHeight: "150px", 
                      overflowY: "auto", 
                      border: "1px solid #dee2e6", 
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      background: "#f8f9fa"
                    }}>
                      {commonMaterials.map((mat, idx) => (
                        <span
                          key={idx}
                          onClick={() => handleMaterialToggle(mat)}
                          style={styles.materialTag(formData.materials.includes(mat))}
                          onMouseEnter={(e) => {
                            if (!formData.materials.includes(mat)) {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!formData.materials.includes(mat)) {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }
                          }}
                        >
                          {formData.materials.includes(mat) ? "✓ " : ""}{mat}
                        </span>
                      ))}
                    </div>
                    
                    {/* Custom Material Input */}
                    <div style={{ 
                      display: "flex", 
                      gap: "12px", 
                      flexDirection: isMobile ? "column" : "row" 
                    }}>
                      <input
                        value={formData.customMaterial}
                        onChange={(e) => setFormData({...formData, customMaterial: e.target.value})}
                        placeholder="Add custom material..."
                        style={{ ...styles.input, flex: 1 }}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMaterial())}
                      />
                      <button
                        type="button"
                        onClick={addCustomMaterial}
                        style={{
                          padding: isMobile ? "12px" : isLargeScreen ? "16px 24px" : "14px 20px",
                          background: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
                          fontWeight: "500",
                          whiteSpace: "nowrap"
                        }}
                      >
                        Add Material
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* IMAGES TAB */}
              {activeTab === "images" && (
                <>
                  <div style={{ marginBottom: isMobile ? "18px" : "25px" }}>
                    <label style={styles.label}>Product Images (Max 10)</label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      multiple
                      accept="image/*"
                      style={{
                        width: "100%",
                        padding: isMobile ? "15px" : "20px",
                        border: "2px dashed #ced4da",
                        borderRadius: "8px",
                        background: "#f8f9fa",
                        cursor: "pointer",
                        fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "15px",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#007bff";
                        e.currentTarget.style.background = "#f0f8ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ced4da";
                        e.currentTarget.style.background = "#f8f9fa";
                      }}
                    />
                    <small style={{ 
                      color: "#666", 
                      fontSize: isMobile ? "12px" : isLargeScreen ? "0.9rem" : "13px", 
                      marginTop: "8px", 
                      display: "block" 
                    }}>
                      Select multiple images. First image will be the main image by default.
                    </small>
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreview.length > 0 && (
                    <div>
                      <label style={styles.label}>
                        Preview (Click to set as main image)
                      </label>
                      <div style={styles.imagePreviewContainer}>
                        {imagePreview.map((img, idx) => (
                          <div 
                            key={idx} 
                            style={styles.imagePreview(idx === formData.mainImageIndex)}
                            onClick={() => setMainImage(idx)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-5px)";
                              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <img 
                              src={img.url} 
                              alt={img.name}
                              style={{ 
                                width: "100%", 
                                height: "100%", 
                                objectFit: "cover" 
                              }}
                            />
                            {idx === formData.mainImageIndex && (
                              <div style={{
                                position: "absolute",
                                top: "8px",
                                left: "8px",
                                background: "#28a745",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: isMobile ? "10px" : "12px",
                                fontWeight: "bold",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                              }}>
                                MAIN
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(idx);
                              }}
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                background: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: isMobile ? "20px" : "24px",
                                height: isMobile ? "20px" : "24px",
                                cursor: "pointer",
                                fontSize: isMobile ? "12px" : "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              ×
                            </button>
                            <div style={{
                              position: "absolute",
                              bottom: "0",
                              left: "0",
                              right: "0",
                              background: "rgba(0,0,0,0.7)",
                              color: "white",
                              padding: "6px",
                              fontSize: isMobile ? "10px" : "11px",
                              textAlign: "center",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}>
                              {img.name.length > 20 ? img.name.substring(0, 17) + "..." : img.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {imagePreview.length === 0 && (
                    <div style={{
                      padding: isMobile ? "40px" : "60px",
                      textAlign: "center",
                      background: "#f8f9fa",
                      borderRadius: "12px",
                      color: "#666",
                      border: "2px dashed #dee2e6"
                    }}>
                      <div style={{ 
                        fontSize: isMobile ? "48px" : "64px", 
                        marginBottom: "15px",
                        opacity: 0.5
                      }}>
                        🖼️
                      </div>
                      <p style={{ 
                        fontSize: isMobile ? "16px" : isLargeScreen ? "1.2rem" : "18px",
                        marginBottom: "10px"
                      }}>
                        No images selected
                      </p>
                      <p style={{ 
                        fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px",
                        opacity: 0.7
                      }}>
                        Click above to add product images
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Form Summary & Submit */}
            <div style={styles.summarySection}>
              <h4 style={styles.summaryTitle}>
                📋 Product Summary
              </h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                gap: "15px",
                fontSize: isMobile ? "13px" : isLargeScreen ? "1rem" : "14px" 
              }}>
                <div><strong>Name:</strong> {formData.name || "Not set"}</div>
                <div><strong>Type:</strong> {formData.type.replace('_', ' ')}</div>
                <div><strong>Category:</strong> {formData.category || "Not selected"}</div>
                {/* <div><strong>Price:</strong> ₹{formData.price || "0.00"}</div> */}
                <div><strong>Dimensions:</strong> {formData.dimensions || "Not set"}</div>
                <div><strong>Materials:</strong> {formData.materials.length > 0 ? formData.materials.join(", ") : "None"}</div>
                <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}>
                  <strong>Images:</strong> {formData.images.length} selected
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={styles.formActions}>
              <button 
                type="button"
                onClick={resetForm}
                style={styles.resetButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5a6268";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#6c757d";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🔄 Reset Form
              </button>
              <button 
                type="submit"
                disabled={formLoading}
                style={styles.submitButton(formLoading)}
                onMouseEnter={(e) => {
                  if (!formLoading) {
                    e.currentTarget.style.background = "#218838";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!formLoading) {
                    e.currentTarget.style.background = "#28a745";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {formLoading 
                  ? "⏳ Adding Product..." 
                  : "✅ Add Product"
                }
              </button>
            </div>
          </form>
        </div>

        {/* Products List - ENLARGED */}
        <div>
          <div style={styles.productsHeader}>
            <h3 style={styles.productsTitle}>
              📦 Products ({products.length})
            </h3>
            <div style={styles.statsContainer}>
              <span style={{ 
                ...styles.statBadge,
                background: "#e3f2fd",
                color: "#1565c0"
              }}>
                CB: {products.filter(p => p.type === 'calibration_block').length}
              </span>
              <span style={{ 
                ...styles.statBadge,
                background: "#f3e5f5",
                color: "#7b1fa2"
              }}>
                FS: {products.filter(p => p.type === 'flawed_specimen').length}
              </span>
              <span style={{ 
                ...styles.statBadge,
                background: "#e8f5e9",
                color: "#2e7d32"
              }}>
                VB: {products.filter(p => p.type === 'validation_block').length}
              </span>
            </div>
          </div>
          
          {loading ? (
            <div style={{ 
              textAlign: "center", 
              padding: "80px", 
              background: "white", 
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
              <div style={{ 
                fontSize: "64px", 
                marginBottom: "20px",
                animation: "spin 1s linear infinite"
              }}>⏳</div>
              <p style={{ 
                fontSize: isMobile ? "16px" : isLargeScreen ? "1.2rem" : "18px",
                color: "#666"
              }}>
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ 
              background: "white", 
              padding: "80px", 
              textAlign: "center", 
              borderRadius: "12px",
              border: "3px dashed #dee2e6",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
              <div style={{ 
                fontSize: "64px", 
                marginBottom: "20px",
                opacity: 0.5
              }}>📦</div>
              <p style={{ 
                color: "#6c757d", 
                fontSize: isMobile ? "16px" : isLargeScreen ? "1.2rem" : "18px",
                marginBottom: "10px"
              }}>
                No products found
              </p>
              <p style={{ 
                color: "#adb5bd", 
                fontSize: isMobile ? "14px" : isLargeScreen ? "1rem" : "16px" 
              }}>
                Add your first product using the form on the left!
              </p>
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {products.map((p) => (
                <div 
                  key={p.id}
                  style={styles.productCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Product Image */}
                  <div style={styles.productImageContainer}>
                    {p.mainImage || p.image_url ? (
                      <img 
                        src={`${backendUrl}${p.mainImage || p.image_url}`}
                        alt={p.name}
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover",
                          transition: "transform 0.3s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ 
                      display: p.mainImage || p.image_url ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#adb5bd'
                    }}>
                      <span style={{ fontSize: "48px" }}>📷</span>
                      <span style={{ fontSize: "14px", marginTop: "10px" }}>No image</span>
                    </div>
                    
                    {/* Image count badge */}
                    {p.images && p.images.length > 1 && (
                      <div style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        background: "rgba(0,0,0,0.8)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: isMobile ? "12px" : "14px",
                        fontWeight: "500",
                        backdropFilter: "blur(4px)"
                      }}>
                        📷 {p.images.length} images
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "6px 12px",
                      background: 
                        p.type === 'calibration_block' ? '#1565c0' : 
                        p.type === 'flawed_specimen' ? '#7b1fa2' : '#2e7d32',
                      color: 'white',
                      borderRadius: "6px",
                      fontSize: isMobile ? "12px" : "14px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }}>
                      {p.type.replace('_', ' ')}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div style={styles.productInfo}>
                    <h4 style={styles.productName}>
                      {p.name}
                    </h4>
                    
                    <div style={styles.productCategory}>
                      {p.category}
                    </div>
                    
                    <p style={styles.productDescription}>
                      {p.description.length > 120 
                        ? p.description.substring(0, 120) + "..." 
                        : p.description}
                    </p>
                    
                    {/* Technical Info */}
                    {(p.dimensions || p.materials?.length > 0 || p.tolerance) && (
                      <div style={{ 
                        fontSize: isMobile ? "12px" : isLargeScreen ? "0.95rem" : "14px", 
                        color: "#666",
                        marginBottom: "20px",
                        padding: "15px",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef"
                      }}>
                        {p.dimensions && (
                          <div style={{ marginBottom: "8px" }}>
                            <span style={{ fontWeight: "500", marginRight: "8px" }}>📐 Dimensions:</span>
                            {p.dimensions}
                          </div>
                        )}
                        {p.materials && p.materials.length > 0 && (
                          <div style={{ marginBottom: "8px" }}>
                            <span style={{ fontWeight: "500", marginRight: "8px" }}>🔧 Materials:</span>
                            {Array.isArray(p.materials) ? p.materials.slice(0, 2).join(", ") : p.materials}
                            {Array.isArray(p.materials) && p.materials.length > 2 && 
                              <span style={{ color: "#6c757d", marginLeft: "5px" }}>
                                +{p.materials.length - 2} more
                              </span>
                            }
                          </div>
                        )}
                        {p.tolerance && (
                          <div>
                            <span style={{ fontWeight: "500", marginRight: "8px" }}>📏 Tolerance:</span>
                            {p.tolerance}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      paddingTop: "20px",
                      borderTop: "1px solid #e9ecef"
                    }}>
                      {/* <span style={styles.productPrice}>
                        ₹{parseFloat(p.price || 0).toFixed(2)}
                      </span> */}
                      <div style={styles.productActions}>
                        <button 
                          onClick={() => viewProduct(p.id)}
                          style={styles.viewButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#0056b3";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#007bff";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          👁️ View Details
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          style={styles.deleteButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#c82333";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#dc3545";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal - ENLARGED */}
      {showEditModal && editingProduct && (
        <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>📦 Product Details</h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#666",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8f9fa";
                  e.currentTarget.style.color = "#333";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#666";
                }}
              >
                ×
              </button>
            </div>
            
            {/* Modal Content */}
            <div style={styles.modalBody}>
              {/* Image Gallery */}
              {editingProduct.images && editingProduct.images.length > 0 ? (
                <div style={{ marginBottom: "30px" }}>
                  <div style={{
                    height: isMobile ? "250px" : isLargeScreen ? "400px" : "350px",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <img 
                      src={`${backendUrl}${editingProduct.mainImage || editingProduct.images[0]?.url}`}
                      alt={editingProduct.name}
                      style={{ 
                        maxWidth: "100%", 
                        maxHeight: "100%", 
                        objectFit: "contain" 
                      }}
                    />
                  </div>
                  {editingProduct.images.length > 1 && (
                    <div style={{ 
                      display: "flex", 
                      gap: "12px", 
                      overflowX: "auto", 
                      paddingBottom: "10px",
                      padding: "10px 0"
                    }}>
                      {editingProduct.images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={`${backendUrl}${img.url}`}
                          alt={`${editingProduct.name} ${idx + 1}`}
                          style={{
                            width: isMobile ? "80px" : "100px",
                            height: isMobile ? "80px" : "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: img.isMain ? "3px solid #28a745" : "1px solid #dee2e6",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  height: isMobile ? "200px" : isLargeScreen ? "300px" : "250px",
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "30px"
                }}>
                  <span style={{ 
                    fontSize: isMobile ? "64px" : "96px", 
                    color: "#adb5bd",
                    opacity: 0.5
                  }}>
                    📷
                  </span>
                </div>
              )}
              
              {/* Product Info */}
              <h2 style={{ 
                margin: "0 0 15px 0",
                fontSize: isMobile ? "1.4rem" : isLargeScreen ? "1.8rem" : "1.6rem",
                color: "#333",
                fontWeight: "600"
              }}>
                {editingProduct.name}
              </h2>
              
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap",
                gap: "10px", 
                marginBottom: "20px" 
              }}>
                <span style={{
                  padding: "8px 16px",
                  background: "#e7f5ff",
                  color: "#0066cc",
                  borderRadius: "20px",
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "500"
                }}>
                  {editingProduct.category}
                </span>
                <span style={{
                  padding: "8px 16px",
                  background: 
                    editingProduct.type === 'calibration_block' ? '#e3f2fd' : 
                    editingProduct.type === 'flawed_specimen' ? '#f3e5f5' : '#e8f5e8',
                  color: 
                    editingProduct.type === 'calibration_block' ? '#1565c0' : 
                    editingProduct.type === 'flawed_specimen' ? '#7b1fa2' : '#2e7d32',
                  borderRadius: "20px",
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: "500"
                }}>
                  {editingProduct.type.replace('_', ' ')}
                </span>
              </div>
              
              <p style={{ 
                color: "#666", 
                lineHeight: "1.6",
                fontSize: isMobile ? "15px" : isLargeScreen ? "1.1rem" : "17px",
                marginBottom: "30px"
              }}>
                {editingProduct.description}
              </p>
              
              <div style={{ 
                fontSize: isMobile ? "28px" : isLargeScreen ? "2rem" : "32px", 
                fontWeight: "bold", 
                color: "#28a745",
                margin: "30px 0",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                {/* ₹{parseFloat(editingProduct.price || 0).toFixed(2)} */}
              </div>
              
              {/* Technical Details */}
              <div style={{
                background: "#f8f9fa",
                padding: isMobile ? "20px" : "30px",
                borderRadius: "12px",
                border: "1px solid #e9ecef"
              }}>
                <h4 style={{ 
                  margin: "0 0 20px 0",
                  fontSize: isMobile ? "1.1rem" : isLargeScreen ? "1.3rem" : "1.2rem",
                  fontWeight: "600",
                  color: "#333"
                }}>
                  🔧 Technical Specifications
                </h4>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                  gap: isMobile ? "20px" : "30px" 
                }}>
                  {editingProduct.dimensions && (
                    <div style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #dee2e6"
                    }}>
                      <strong style={{ 
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#495057",
                        display: "block",
                        marginBottom: "10px"
                      }}>
                        📐 Dimensions
                      </strong>
                      <span style={{ 
                        color: "#666", 
                        fontSize: isMobile ? "14px" : "16px" 
                      }}>
                        {editingProduct.dimensions}
                      </span>
                    </div>
                  )}
                  {editingProduct.tolerance && (
                    <div style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #dee2e6"
                    }}>
                      <strong style={{ 
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#495057",
                        display: "block",
                        marginBottom: "10px"
                      }}>
                        📏 Tolerance
                      </strong>
                      <span style={{ 
                        color: "#666", 
                        fontSize: isMobile ? "14px" : "16px" 
                      }}>
                        {editingProduct.tolerance}
                      </span>
                    </div>
                  )}
                  {editingProduct.materials && editingProduct.materials.length > 0 && (
                    <div style={{ 
                      gridColumn: isMobile ? "auto" : "1 / -1",
                      background: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #dee2e6"
                    }}>
                      <strong style={{ 
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#495057",
                        display: "block",
                        marginBottom: "15px"
                      }}>
                        🔧 Materials
                      </strong>
                      <div style={{ marginTop: "5px" }}>
                        {(Array.isArray(editingProduct.materials) ? editingProduct.materials : [editingProduct.materials]).map((mat, idx) => (
                          <span key={idx} style={{
                            display: "inline-block",
                            padding: "8px 16px",
                            background: "#e8f5e9",
                            color: "#2e7d32",
                            borderRadius: "20px",
                            fontSize: isMobile ? "13px" : "15px",
                            margin: "5px",
                            fontWeight: "500"
                          }}>
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {editingProduct.flaws && (
                    <div style={{ 
                      gridColumn: isMobile ? "auto" : "1 / -1",
                      background: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      border: "1px solid #dee2e6"
                    }}>
                      <strong style={{ 
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#495057",
                        display: "block",
                        marginBottom: "10px"
                      }}>
                        ⚠️ Flaws/Defects
                      </strong>
                      <span style={{ 
                        color: "#666", 
                        whiteSpace: "pre-line",
                        fontSize: isMobile ? "14px" : "16px",
                        lineHeight: "1.5"
                      }}>
                        {editingProduct.flaws}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowEditModal(false)}
                style={styles.modalButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5a6268";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#6c757d";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this product?")) {
                    handleDelete(editingProduct.id);
                    setShowEditModal(false);
                  }
                }}
                style={styles.modalDeleteButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#c82333";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#dc3545";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🗑️ Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;