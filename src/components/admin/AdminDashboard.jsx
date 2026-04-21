// AdminDashboard.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, ENDPOINTS, getImageUrl, apiCall } from '../../config/api';
import './AdminDashboard.css';

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
    "Boiler Tube PAUT Validation Blocks",
    "UT Custom Blocks"  // ← ADD THIS LINE
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

  // ═══════════════════════════════════════
  // MAIN SECTION SWITCHER
  // ═══════════════════════════════════════
  const [mainSection, setMainSection] = useState("products");

  // ═══════════════════════════════════════
  // EXISTING PRODUCT STATES
  // ═══════════════════════════════════════
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [currentModalImage, setCurrentModalImage] = useState(0);

  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form data for adding new product
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    category: "",
    subcategory: "",
    type: "calibration_block",
    price: "",
    compare_price: "",
    cost_price: "",
    stock_quantity: "10",
    sku: "",
    dimensions: "",
    tolerance: "",
    flaws: "",
    weight: "",
    standards: "",
    materials: [],
    customMaterial: "",
    specifications: {},
    features: {},
    images: [],
    mainImageIndex: 0,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    is_featured: false
  });

  // Form data for editing product
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: "",
    description: "",
    short_description: "",
    category: "",
    subcategory: "",
    type: "calibration_block",
    price: "",
    compare_price: "",
    cost_price: "",
    stock_quantity: "10",
    sku: "",
    dimensions: "",
    tolerance: "",
    flaws: "",
    weight: "",
    standards: "",
    materials: [],
    customMaterial: "",
    specifications: {},
    features: {},
    existingImages: [],
    deleteImages: [],
    newImages: [],
    mainImageIndex: null,
    mainImageId: null,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    is_featured: false
  });

  // Specification fields management
  const [specFields, setSpecFields] = useState([
    { key: "", value: "" }
  ]);

  // Edit specification fields
  const [editSpecFields, setEditSpecFields] = useState([
    { key: "", value: "" }
  ]);

  // Feature fields management
  const [featureFields, setFeatureFields] = useState([
    { key: "", value: "" }
  ]);

  // Edit feature fields
  const [editFeatureFields, setEditFeatureFields] = useState([
    { key: "", value: "" }
  ]);

  const [formLoading, setFormLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [editImagePreview, setEditImagePreview] = useState({
    existing: [],
    new: []
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [editActiveTab, setEditActiveTab] = useState("basic");

  // ═══════════════════════════════════════
  // NEWS STATES
  // ═══════════════════════════════════════
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsFormLoading, setNewsFormLoading] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    date: '', title: '', description: '', display_order: 0
  });
  const [newsImage, setNewsImage] = useState(null);
  const [newsImagePreview, setNewsImagePreview] = useState('');

  // ═══════════════════════════════════════
  // TESTIMONIALS STATES
  // ═══════════════════════════════════════
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialFormLoading, setTestimonialFormLoading] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    quote: '', author: '', position: '', display_order: 0
  });

  // ═══════════════════════════════════════
  // TEAM STATES
  // ═══════════════════════════════════════
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamFormLoading, setTeamFormLoading] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '', full_name: '', role: '', quote: '', display_order: 0
  });
  const [teamVideo, setTeamVideo] = useState(null);
  const [teamThumbnail, setTeamThumbnail] = useState(null);
  const [teamVideoPreview, setTeamVideoPreview] = useState('');
  const [teamThumbPreview, setTeamThumbPreview] = useState('');

  // ═══════════════════════════════════════
  // AUTH HEADER HELPER - FIXED
  // ═══════════════════════════════════════
  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
    if (!token) {
      return {};
    }
    return { 'Authorization': `Bearer ${token}` };
  };

  // Check if token is expired
  const isTokenExpired = () => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime;
    } catch (error) {
      return true;
    }
  };

  // Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    
    if (isTokenExpired()) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_data");
      alert("Your session has expired. Please login again.");
      navigate("/admin/login");
    }
  }, [navigate]);

  // ═══════════════════════════════════════
  // EXISTING PRODUCT FUNCTIONS
  // ═══════════════════════════════════════

  // Modal image navigation functions
  const nextModalImage = () => {
    if (editingProduct && editingProduct.images && editingProduct.images.length > 1) {
      setCurrentModalImage((prev) => (prev + 1) % editingProduct.images.length);
    }
  };

  const prevModalImage = () => {
    if (editingProduct && editingProduct.images && editingProduct.images.length > 1) {
      setCurrentModalImage((prev) => (prev - 1 + editingProduct.images.length) % editingProduct.images.length);
    }
  };

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(prev => prev !== mobile ? mobile : prev);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all products
  const fetchProducts = useCallback(async (showFullLoading = false) => {
    try {
      if (showFullLoading) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/products?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        localStorage.removeItem("admin_data");
        navigate("/admin/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate]);

  // Initial data loading
  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Derived State for stats
  const dashboardStats = useMemo(() => {
    return {
      total: products.length,
      calibrationBlocks: products.filter(p => p.type === 'calibration_block').length,
      flawedSpecimens: products.filter(p => p.type === 'flawed_specimen').length,
      validationBlocks: products.filter(p => p.type === 'validation_block').length
    };
  }, [products]);

  // Get categories based on selected type
  const getCategoriesForType = (type) => {
    return productTypeCategories[type]?.categories || [];
  };

  // Handle image selection for new product
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

  // Handle image selection for editing product
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + editFormData.existingImages.length - editFormData.deleteImages.length > 10) {
      alert(`Maximum 10 images allowed. You can add ${10 - (editFormData.existingImages.length - editFormData.deleteImages.length)} more.`);
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: file
    }));

    setEditImagePreview({
      ...editImagePreview,
      new: [...editImagePreview.new, ...newPreviews]
    });

    setEditFormData({
      ...editFormData,
      newImages: [...editFormData.newImages, ...files]
    });
  };

  // Remove image from selection for new product
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

  // Remove existing image in edit mode
  const removeExistingImage = (imageId) => {
    const targetImage = editFormData.existingImages.find(img => img.id === imageId);
    if (!targetImage) return;

    const updatedDeleteImages = [...editFormData.deleteImages, imageId];
    const updatedExistingImages = editFormData.existingImages.filter(img => img.id !== imageId);

    let newMainImageId = editFormData.mainImageId;
    if (editFormData.mainImageId === imageId) {
      newMainImageId = updatedExistingImages.length > 0
        ? updatedExistingImages[0].id
        : null;
    }

    setEditFormData({
      ...editFormData,
      existingImages: updatedExistingImages,
      deleteImages: updatedDeleteImages,
      mainImageId: newMainImageId
    });

    setEditImagePreview({
      ...editImagePreview,
      existing: editImagePreview.existing.filter(img => img.id !== imageId)
    });
  };

  // Remove new image in edit mode
  const removeNewImage = (index) => {
    const newImages = [...editFormData.newImages];
    newImages.splice(index, 1);

    const newPreviews = [...editImagePreview.new];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);

    let newMainImageIndex = editFormData.mainImageIndex;
    if (editFormData.mainImageId === null && editFormData.mainImageIndex !== null) {
      if (index === editFormData.mainImageIndex) {
        newMainImageIndex = null;
      } else if (index < editFormData.mainImageIndex) {
        newMainImageIndex = editFormData.mainImageIndex - 1;
      }
    }

    setEditFormData({
      ...editFormData,
      newImages: newImages,
      mainImageIndex: newMainImageIndex
    });

    setEditImagePreview({
      ...editImagePreview,
      new: newPreviews
    });
  };

  // Set main image for new product
  const setMainImage = (index) => {
    setFormData({ ...formData, mainImageIndex: index });
  };

  // Set main image in edit mode
  const setMainImageEdit = (id, isNew = false, newIndex = null) => {
    if (isNew) {
      setEditFormData({
        ...editFormData,
        mainImageId: null,
        mainImageIndex: newIndex
      });
    } else {
      setEditFormData({
        ...editFormData,
        mainImageId: id,
        mainImageIndex: null
      });
    }
  };

  // Handle material selection for new product
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

  // Handle material selection for edit mode
  const handleEditMaterialToggle = (material) => {
    const currentMaterials = [...editFormData.materials];
    const index = currentMaterials.indexOf(material);

    if (index === -1) {
      currentMaterials.push(material);
    } else {
      currentMaterials.splice(index, 1);
    }

    setEditFormData({ ...editFormData, materials: currentMaterials });
  };

  // Add custom material for new product
  const addCustomMaterial = () => {
    if (formData.customMaterial.trim() && !formData.materials.includes(formData.customMaterial.trim())) {
      setFormData({
        ...formData,
        materials: [...formData.materials, formData.customMaterial.trim()],
        customMaterial: ""
      });
    }
  };

  // Add custom material in edit mode
  const addCustomMaterialEdit = () => {
    if (editFormData.customMaterial.trim() && !editFormData.materials.includes(editFormData.customMaterial.trim())) {
      setEditFormData({
        ...editFormData,
        materials: [...editFormData.materials, editFormData.customMaterial.trim()],
        customMaterial: ""
      });
    }
  };

  // Remove material for new product
  const removeMaterial = (material) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter(m => m !== material)
    });
  };

  // Remove material in edit mode
  const removeMaterialEdit = (material) => {
    setEditFormData({
      ...editFormData,
      materials: editFormData.materials.filter(m => m !== material)
    });
  };

  // Handle specification field changes for new product
  const handleSpecFieldChange = (index, field, value) => {
    const newFields = [...specFields];
    newFields[index][field] = value;
    setSpecFields(newFields);

    const specs = {};
    newFields.forEach(spec => {
      if (spec.key && spec.value) {
        specs[spec.key] = spec.value;
      }
    });
    setFormData({ ...formData, specifications: specs });
  };

  // Add a new specification field
  const addSpecField = () => {
    setSpecFields([...specFields, { key: "", value: "" }]);
  };

  // Remove a specification field
  const removeSpecField = (index) => {
    const newFields = [...specFields];
    newFields.splice(index, 1);
    setSpecFields(newFields);

    const specs = {};
    newFields.forEach(spec => {
      if (spec.key && spec.value) {
        specs[spec.key] = spec.value;
      }
    });
    setFormData({ ...formData, specifications: specs });
  };

  // Handle specification field changes for edit product
  const handleEditSpecFieldChange = (index, field, value) => {
    const newFields = [...editSpecFields];
    newFields[index][field] = value;
    setEditSpecFields(newFields);

    const specs = {};
    newFields.forEach(spec => {
      if (spec.key && spec.value) {
        specs[spec.key] = spec.value;
      }
    });
    setEditFormData({ ...editFormData, specifications: specs });
  };

  // Add a new specification field for edit mode
  const addEditSpecField = () => {
    setEditSpecFields([...editSpecFields, { key: "", value: "" }]);
  };

  // Remove a specification field for edit mode
  const removeEditSpecField = (index) => {
    const newFields = [...editSpecFields];
    newFields.splice(index, 1);
    setEditSpecFields(newFields);

    const specs = {};
    newFields.forEach(spec => {
      if (spec.key && spec.value) {
        specs[spec.key] = spec.value;
      }
    });
    setEditFormData({ ...editFormData, specifications: specs });
  };

  // Handle feature field changes for new product
  const handleFeatureFieldChange = (index, field, value) => {
    const newFields = [...featureFields];
    newFields[index][field] = value;
    setFeatureFields(newFields);

    const features = {};
    newFields.forEach(feature => {
      if (feature.key && feature.value) {
        features[feature.key] = feature.value;
      }
    });
    setFormData({ ...formData, features: features });
  };

  // Add a new feature field
  const addFeatureField = () => {
    setFeatureFields([...featureFields, { key: "", value: "" }]);
  };

  // Remove a feature field
  const removeFeatureField = (index) => {
    const newFields = [...featureFields];
    newFields.splice(index, 1);
    setFeatureFields(newFields);

    const features = {};
    newFields.forEach(feature => {
      if (feature.key && feature.value) {
        features[feature.key] = feature.value;
      }
    });
    setFormData({ ...formData, features: features });
  };

  // Handle feature field changes for edit product
  const handleEditFeatureFieldChange = (index, field, value) => {
    const newFields = [...editFeatureFields];
    newFields[index][field] = value;
    setEditFeatureFields(newFields);

    const features = {};
    newFields.forEach(feature => {
      if (feature.key && feature.value) {
        features[feature.key] = feature.value;
      }
    });
    setEditFormData({ ...editFormData, features: features });
  };

  // Add a new feature field for edit mode
  const addEditFeatureField = () => {
    setEditFeatureFields([...editFeatureFields, { key: "", value: "" }]);
  };

  // Remove a feature field for edit mode
  const removeEditFeatureField = (index) => {
    const newFields = [...editFeatureFields];
    newFields.splice(index, 1);
    setEditFeatureFields(newFields);

    const features = {};
    newFields.forEach(feature => {
      if (feature.key && feature.value) {
        features[feature.key] = feature.value;
      }
    });
    setEditFormData({ ...editFormData, features: features });
  };

  // Initialize/reset spec and feature fields when formData changes
  useEffect(() => {
    if (formData.specifications && Object.keys(formData.specifications).length > 0) {
      const newSpecFields = Object.entries(formData.specifications).map(
        ([key, value]) => ({ key, value })
      );
      if (newSpecFields.length > 0) {
        setSpecFields(newSpecFields);
      }
    }

    if (formData.features && Object.keys(formData.features).length > 0) {
      const newFeatureFields = Object.entries(formData.features).map(
        ([key, value]) => ({ key, value })
      );
      if (newFeatureFields.length > 0) {
        setFeatureFields(newFeatureFields);
      }
    }
  }, []);

  // Initialize/reset spec and feature fields when editFormData changes
  useEffect(() => {
    if (!editFormData.id) return;

    if (editFormData.specifications && Object.keys(editFormData.specifications).length > 0) {
      const newSpecFields = Object.entries(editFormData.specifications).map(
        ([key, value]) => ({ key, value })
      );
      setEditSpecFields(newSpecFields);
    } else {
      setEditSpecFields([{ key: "", value: "" }]);
    }

    if (editFormData.features && Object.keys(editFormData.features).length > 0) {
      const newFeatureFields = Object.entries(editFormData.features).map(
        ([key, value]) => ({ key, value })
      );
      setEditFeatureFields(newFeatureFields);
    } else {
      setEditFeatureFields([{ key: "", value: "" }]);
    }
  }, [editFormData.id, editFormData.specifications, editFormData.features]);

  // Handle form submission for new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.name || !formData.category || !formData.type) {
      alert("Please fill all required fields (name, category, and type)!");
      setFormLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/admin/login");
        setFormLoading(false);
        return;
      }
      
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description || "");
      data.append("short_description", formData.short_description || "");
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory || "");
      data.append("type", formData.type);
      data.append("price", formData.price || "0");
      data.append("compare_price", formData.compare_price || "");
      data.append("cost_price", formData.cost_price || "");
      data.append("stock_quantity", formData.stock_quantity || "10");
      data.append("sku", formData.sku || "");
      data.append("dimensions", formData.dimensions || "");
      data.append("tolerance", formData.tolerance || "");
      data.append("flaws", formData.flaws || "");
      data.append("weight", formData.weight || "");
      data.append("standards", formData.standards || "");
      data.append("meta_title", formData.meta_title || "");
      data.append("meta_description", formData.meta_description || "");
      data.append("meta_keywords", formData.meta_keywords || "");
      data.append("is_featured", formData.is_featured);

      data.append("materials", JSON.stringify(formData.materials || []));
      data.append("specifications", JSON.stringify(formData.specifications || {}));
      data.append("features", JSON.stringify(formData.features || {}));

      data.append("mainImageIndex", formData.mainImageIndex);

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          data.append("images", image);
        });
      }

      console.log("📤 Sending product data to backend...");

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        setFormLoading(false);
        return;
      }

      const result = await res.json();
      console.log("📥 Backend response:", result);

      if (result.success) {
        alert("Product added successfully!");
        resetForm();
        fetchProducts(false);
      } else {
        alert(`Error: ${result.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to add product. Check your connection and try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form submission for editing product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    if (!editFormData.name || !editFormData.category || !editFormData.type) {
      alert("Please fill all required fields (name, category, and type)!");
      setEditLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/admin/login");
        setEditLoading(false);
        return;
      }
      
      const data = new FormData();

      Object.entries(editFormData).forEach(([key, value]) => {
        if (key !== 'newImages' && key !== 'existingImages' && key !== 'customMaterial' &&
          key !== 'deleteImages' && key !== 'mainImageIndex' && key !== 'mainImageId' &&
          key !== 'specifications' && key !== 'features' && key !== 'materials') {
          data.append(key, value);
        }
      });

      data.append("specifications", JSON.stringify(editFormData.specifications || {}));
      data.append("features", JSON.stringify(editFormData.features || {}));
      data.append("materials", JSON.stringify(editFormData.materials || []));

      if (editFormData.deleteImages.length > 0) {
        data.append("deleteImages", JSON.stringify(editFormData.deleteImages));
      }

      if (editFormData.mainImageId !== null) {
        data.append("mainImageId", editFormData.mainImageId);
      } else if (editFormData.mainImageIndex !== null) {
        data.append("mainImageIndex", editFormData.mainImageIndex);
      }

      if (editFormData.newImages && editFormData.newImages.length > 0) {
        editFormData.newImages.forEach((image) => {
          data.append("images", image);
        });
      }

      console.log(`Updating product ${editFormData.id}`);
      const res = await fetch(`${API_URL}/api/products/${editFormData.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        setEditLoading(false);
        return;
      }

      const result = await res.json();

      if (result.success) {
        alert("Product updated successfully!");
        setShowEditModal(false);
        setIsEditMode(false);
        fetchProducts(false);
      } else {
        alert(`Error: ${result.message || "Failed to update product"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to update product. Check your connection and try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // Reset form for new product
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      short_description: "",
      category: "",
      subcategory: "",
      type: "calibration_block",
      price: "",
      compare_price: "",
      cost_price: "",
      stock_quantity: "10",
      sku: "",
      dimensions: "",
      tolerance: "",
      flaws: "",
      weight: "",
      standards: "",
      materials: [],
      customMaterial: "",
      specifications: {},
      features: {},
      images: [],
      mainImageIndex: 0,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      is_featured: false
    });
    setImagePreview([]);
    setSpecFields([{ key: "", value: "" }]);
    setFeatureFields([{ key: "", value: "" }]);
    setActiveTab("basic");

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  // Handle type change for new product
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type: newType,
      category: ""
    });
  };

  // Handle type change in edit mode
  const handleEditTypeChange = (e) => {
    const newType = e.target.value;
    setEditFormData({
      ...editFormData,
      type: newType,
      category: ""
    });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/admin/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }

      const result = await res.json();

      if (result.success) {
        alert("Product deleted successfully!");
        setShowEditModal(false);
        fetchProducts(false);
      } else {
        alert(`Error: ${result.message || "Failed to delete product"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_data");
      navigate("/admin/login");
    }
  };

  // View product details
  const viewProduct = async (id) => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/admin/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setCurrentModalImage(0);
        const product = data.product;
        setEditingProduct(product);

        const mainImage = product.images.find(img => img.isMain);
        const mainImageId = mainImage ? mainImage.id : (product.images.length > 0 ? product.images[0].id : null);

        setEditFormData({
          id: product.id,
          name: product.name || "",
          description: product.description || "",
          short_description: product.short_description || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          type: product.type || "calibration_block",
          price: product.price || "",
          compare_price: product.compare_price || "",
          cost_price: product.cost_price || "",
          stock_quantity: product.stock_quantity || "0",
          sku: product.sku || "",
          dimensions: product.dimensions || "",
          tolerance: product.tolerance || "",
          flaws: product.flaws || "",
          weight: product.weight || "",
          standards: product.standards || "",
          materials: Array.isArray(product.materials) ? product.materials : [],
          customMaterial: "",
          specifications: product.specifications || {},
          features: product.features || {},
          existingImages: product.images || [],
          deleteImages: [],
          newImages: [],
          mainImageId: mainImageId,
          mainImageIndex: null,
          meta_title: product.meta_title || "",
          meta_description: product.meta_description || "",
          meta_keywords: product.meta_keywords || "",
          is_featured: product.is_featured || false
        });

        const specs = product.specifications || {};
        if (Object.keys(specs).length > 0) {
          setEditSpecFields(Object.entries(specs).map(([key, value]) => ({ key, value })));
        } else {
          setEditSpecFields([{ key: "", value: "" }]);
        }

        const features = product.features || {};
        if (Object.keys(features).length > 0) {
          setEditFeatureFields(Object.entries(features).map(([key, value]) => ({ key, value })));
        } else {
          setEditFeatureFields([{ key: "", value: "" }]);
        }

        setEditImagePreview({
          existing: product.images || [],
          new: []
        });

        setShowEditModal(true);
        setIsEditMode(false);
        setEditActiveTab("basic");
      } else {
        alert("Failed to load product details.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product details. Please try again.");
    }
  };

  // Switch to edit mode
  const enterEditMode = () => {
    setIsEditMode(true);
  };

  // Cancel edit mode
  const cancelEditMode = () => {
    if (editFormData.newImages.length > 0 || editFormData.deleteImages.length > 0) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
    }

    editImagePreview.new.forEach(img => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });

    setIsEditMode(false);
    viewProduct(editFormData.id);
  };

  const filteredProductList = useMemo(() => {
    if (!searchTerm && filterType === 'all') return products;

    return products.filter(product => {
      if (filterType !== 'all' && product.type !== filterType) {
        return false;
      }

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [products, searchTerm, filterType]);

  // Format price with rupee symbol
  const formatPrice = (price) => {
    if (!price) return "₹0.00";
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Safe image error handler
  const handleImageError = (e) => {
    if (e.target.src.includes('placeholder-image.png')) return;
    e.target.src = '/placeholder-image.png';
  };

  // ═══════════════════════════════════════
  // NEWS FUNCTIONS - FIXED
  // ═══════════════════════════════════════
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        navigate("/admin/login");
        return;
      }
      
      const res = await fetch(`${API_URL}/api/news/admin/all`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      const data = await res.json();
      if (data.success) setNewsItems(data.data || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setNewsLoading(false);
    }
  };

  const resetNewsForm = () => {
    setNewsForm({ date: '', title: '', description: '', display_order: 0 });
    setNewsImage(null);
    setNewsImagePreview('');
    setEditingNews(null);
    setShowNewsForm(false);
  };

  const handleNewsEdit = (item) => {
    setEditingNews(item);
    setNewsForm({
      date: item.date,
      title: item.title,
      description: item.description,
      display_order: item.display_order
    });
    setNewsImagePreview(item.image ? `${API_URL}${item.image}` : '');
    setShowNewsForm(true);
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setNewsFormLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/admin/login");
        setNewsFormLoading(false);
        return;
      }
      
      const fd = new FormData();
      fd.append('date', newsForm.date);
      fd.append('title', newsForm.title);
      fd.append('description', newsForm.description);
      fd.append('display_order', newsForm.display_order);
      if (newsImage) fd.append('image', newsImage);

      let res;
      if (editingNews) {
        res = await fetch(`${API_URL}/api/news/${editingNews.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      } else {
        if (!newsImage) {
          alert('Image is required for new news item!');
          setNewsFormLoading(false);
          return;
        }
        res = await fetch(`${API_URL}/api/news`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      }
      
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        setNewsFormLoading(false);
        return;
      }
      
      const result = await res.json();
      if (result.success) {
        alert(editingNews ? 'News updated successfully!' : 'News created successfully!');
        resetNewsForm();
        fetchNews();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert('Failed to save news.');
    } finally {
      setNewsFormLoading(false);
    }
  };

  const handleNewsDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      const result = await res.json();
      if (result.success) {
        alert('News deleted!');
        fetchNews();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert('Failed to delete news.');
    }
  };

  const toggleNewsActive = async (item) => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      const fd = new FormData();
      fd.append('is_active', item.is_active ? 0 : 1);
      await fetch(`${API_URL}/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      fetchNews();
    } catch (err) {
      alert('Failed to toggle status.');
    }
  };

  // ═══════════════════════════════════════
  // TESTIMONIALS FUNCTIONS - FIXED
  // ═══════════════════════════════════════
  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        navigate("/admin/login");
        return;
      }
      
      const res = await fetch(`${API_URL}/api/testimonials/admin/all`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      const data = await res.json();
      if (data.success) setTestimonials(data.data || []);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({ quote: '', author: '', position: '', display_order: 0 });
    setEditingTestimonial(null);
    setShowTestimonialForm(false);
  };

  const handleTestimonialEdit = (item) => {
    setEditingTestimonial(item);
    setTestimonialForm({
      quote: item.quote,
      author: item.author,
      position: item.position,
      display_order: item.display_order
    });
    setShowTestimonialForm(true);
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setTestimonialFormLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/admin/login");
        setTestimonialFormLoading(false);
        return;
      }
      
      const url = editingTestimonial
        ? `${API_URL}/api/testimonials/${editingTestimonial.id}`
        : `${API_URL}/api/testimonials`;
      
      const res = await fetch(url, {
        method: editingTestimonial ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(testimonialForm)
      });
      
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        setTestimonialFormLoading(false);
        return;
      }
      
      const result = await res.json();
      if (result.success) {
        alert(editingTestimonial ? 'Testimonial updated!' : 'Testimonial created!');
        resetTestimonialForm();
        fetchTestimonials();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error saving testimonial:", err);
      alert('Failed to save testimonial.');
    } finally {
      setTestimonialFormLoading(false);
    }
  };

  const handleTestimonialDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      const result = await res.json();
      if (result.success) {
        alert('Testimonial deleted!');
        fetchTestimonials();
      }
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const toggleTestimonialActive = async (item) => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      await fetch(`${API_URL}/api/testimonials/${item.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ is_active: item.is_active ? 0 : 1 })
      });
      fetchTestimonials();
    } catch (err) {
      alert('Failed to toggle.');
    }
  };

  // ═══════════════════════════════════════
  // TEAM FUNCTIONS - FIXED
  // ═══════════════════════════════════════
  const fetchTeam = async () => {
    setTeamLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        navigate("/admin/login");
        return;
      }
      
      const res = await fetch(`${API_URL}/api/team/admin/all`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      const data = await res.json();
      if (data.success) setTeamMembers(data.data || []);
    } catch (err) {
      console.error("Error fetching team:", err);
    } finally {
      setTeamLoading(false);
    }
  };

  const resetTeamForm = () => {
    setTeamForm({ name: '', full_name: '', role: '', quote: '', display_order: 0 });
    setTeamVideo(null);
    setTeamThumbnail(null);
    setTeamVideoPreview('');
    setTeamThumbPreview('');
    setEditingTeam(null);
    setShowTeamForm(false);
  };

  const handleTeamEdit = (item) => {
    setEditingTeam(item);
    setTeamForm({
      name: item.name,
      full_name: item.full_name,
      role: item.role,
      quote: item.quote,
      display_order: item.display_order
    });
    setTeamVideoPreview(item.video ? `${API_URL}${item.video}` : '');
    setTeamThumbPreview(item.thumbnail ? `${API_URL}${item.thumbnail}` : '');
    setShowTeamForm(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setTeamFormLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/admin/login");
        setTeamFormLoading(false);
        return;
      }
      
      const fd = new FormData();
      fd.append('name', teamForm.name);
      fd.append('full_name', teamForm.full_name);
      fd.append('role', teamForm.role);
      fd.append('quote', teamForm.quote);
      fd.append('display_order', teamForm.display_order);
      if (teamVideo) fd.append('video', teamVideo);
      if (teamThumbnail) fd.append('thumbnail', teamThumbnail);

      let res;
      if (editingTeam) {
        res = await fetch(`${API_URL}/api/team/${editingTeam.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      } else {
        if (!teamVideo || !teamThumbnail) {
          alert('Video and thumbnail are required for new team member!');
          setTeamFormLoading(false);
          return;
        }
        res = await fetch(`${API_URL}/api/team`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
      }
      
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        setTeamFormLoading(false);
        return;
      }
      
      const result = await res.json();
      if (result.success) {
        alert(editingTeam ? 'Team member updated!' : 'Team member created!');
        resetTeamForm();
        fetchTeam();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert('Failed to save team member.');
    } finally {
      setTeamFormLoading(false);
    }
  };

  const handleTeamDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      
      const res = await fetch(`${API_URL}/api/team/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      const result = await res.json();
      if (result.success) {
        alert('Team member deleted!');
        fetchTeam();
      }
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const toggleTeamActive = async (item) => {
    try {
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      const fd = new FormData();
      fd.append('is_active', item.is_active ? 0 : 1);
      await fetch(`${API_URL}/api/team/${item.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      fetchTeam();
    } catch (err) {
      alert('Failed to toggle.');
    }
  };

  // Load CMS data when section changes
  useEffect(() => {
    if (mainSection === 'news' && newsItems.length === 0) fetchNews();
    if (mainSection === 'testimonials' && testimonials.length === 0) fetchTestimonials();
    if (mainSection === 'team' && teamMembers.length === 0) fetchTeam();
  }, [mainSection]);

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1><i className="fas fa-toolbox"></i> DAKS NDT Admin</h1>  
          <p> Manage your NDT products & content </p>
        </div>
        <div className="header-right">
          <button
            onClick={() => fetchProducts(true)}
            className="refresh-button"
            disabled={loading || isRefreshing}
          >
            <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`}></i> Refresh
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="refresh-button"
          >
            <i className="fas fa-shopping-cart"></i> Orders
          </button>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {/* ═══ MAIN SECTION NAVIGATION ═══ */}
      <div className="cms-main-nav">
        <button
          className={`cms-nav-btn ${mainSection === 'products' ? 'cms-nav-active' : ''}`}
          onClick={() => setMainSection('products')}
        >
          <i className="fas fa-boxes"></i>
          <span className="cms-nav-label">Products</span>
          <span className="cms-nav-count">{products.length}</span>
        </button>
        <button
          className={`cms-nav-btn ${mainSection === 'news' ? 'cms-nav-active' : ''}`}
          onClick={() => setMainSection('news')}
        >
          <i className="fas fa-newspaper"></i>
          <span className="cms-nav-label">News / Blogs</span>
          <span className="cms-nav-count">{newsItems.length}</span>
        </button>
        <button
          className={`cms-nav-btn ${mainSection === 'testimonials' ? 'cms-nav-active' : ''}`}
          onClick={() => setMainSection('testimonials')}
        >
          <i className="fas fa-quote-left"></i>
          <span className="cms-nav-label">Testimonials</span>
          <span className="cms-nav-count">{testimonials.length}</span>
        </button>
        <button
          className={`cms-nav-btn ${mainSection === 'team' ? 'cms-nav-active' : ''}`}
          onClick={() => setMainSection('team')}
        >
          <i className="fas fa-video"></i>
          <span className="cms-nav-label">Team Videos</span>
          <span className="cms-nav-count">{teamMembers.length}</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════
           PRODUCTS SECTION
         ═══════════════════════════════════════ */}
      {mainSection === 'products' && (
        <>
          {/* Dashboard Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-box"></i></div>
              <div className="stat-content">
                <h3>{dashboardStats.total}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><i className="fas fa-ruler"></i></div>
              <div className="stat-content">
                <h3>{dashboardStats.calibrationBlocks}</h3>
                <p>Calibration Blocks</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><i className="fas fa-flask"></i></div>
              <div className="stat-content">
                <h3>{dashboardStats.flawedSpecimens}</h3>
                <p>Flawed Specimens</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><i className="fas fa-check-circle"></i></div>
              <div className="stat-content">
                <h3>{dashboardStats.validationBlocks}</h3>
                <p>Validation Blocks</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Add Product Form */}
            <div className="product-form-container">
              <h2><i className="fas fa-plus-circle"></i> Add New Product</h2>
              <div className="admin-nav-buttons">
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="nav-buttons orders"
                >
                  <i className="fas fa-shopping-cart"></i> Orders
                </button> <br />
                <button
                  onClick={() => navigate('/admin/sort-products')}
                  className="nav-buttons sort"
                >
                  <i className="fas fa-sort-amount-down"></i> Sort Products
                </button> <br />
                <button
                  onClick={() => navigate('/admin/gallery')}
                  className="nav-buttons gallery"
                >
                  <i className="fas fa-images"></i> Gallery
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="form-tabs">
                <button
                  type="button"
                  className={activeTab === "basic" ? "tab-active" : ""}
                  onClick={() => setActiveTab("basic")}
                >
                  <i className="fas fa-info-circle"></i> Basic Info
                </button>
                <button
                  type="button"
                  className={activeTab === "technical" ? "tab-active" : ""}
                  onClick={() => setActiveTab("technical")}
                >
                  <i className="fas fa-cogs"></i> Technical
                </button>
                <button
                  type="button"
                  className={activeTab === "meta" ? "tab-active" : ""}
                  onClick={() => setActiveTab("meta")}
                >
                  <i className="fas fa-tags"></i> Meta Data
                </button>
                <button
                  type="button"
                  className={activeTab === "images" ? "tab-active" : ""}
                  onClick={() => setActiveTab("images")}
                >
                  <i className="fas fa-images"></i> Images ({imagePreview.length})
                </button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="tab-content">
                  {/* BASIC INFO TAB */}
                  {activeTab === "basic" && (
                    <div className="form-section">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Product Name *</label>
                          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g., ASME V Calibration Block" className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>SKU</label>
                          <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g., CB-ASME-001 (generated if empty)" className="form-control" />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Product Type *</label>
                          <select value={formData.type} onChange={handleTypeChange} className="form-control">
                            <option value="calibration_block">Calibration Block</option>
                            <option value="flawed_specimen">Flawed Specimen</option>
                            <option value="validation_block">Validation Block</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Category *</label>
                          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="form-control">
                            <option value="">Select category</option>
                            {getCategoriesForType(formData.type).map((cat, index) => (
                              <option key={index} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Subcategory</label>
                          <input type="text" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} placeholder="e.g., ASME V Standards" className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>Featured Product</label>
                          <div className="toggle-container">
                            <label className="toggle">
                              <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
                              <span className="toggle-slider"></span>
                            </label>
                            <span className="toggle-label">{formData.is_featured ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Short Description</label>
                        <input type="text" value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} placeholder="Brief description (shown in product lists)" className="form-control" />
                      </div>

                      <div className="form-group">
                        <label>Full Description *</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed product description..." rows="5" className="form-control" />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Price (₹)</label>
                          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" min="0" step="0.01" className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>Compare At Price (₹)</label>
                          <input type="number" value={formData.compare_price} onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })} placeholder="0.00" min="0" step="0.01" className="form-control" />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Cost Price (₹)</label>
                          <input type="number" value={formData.cost_price} onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })} placeholder="0.00" min="0" step="0.01" className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>Stock Quantity</label>
                          <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} placeholder="0" min="0" step="1" className="form-control" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TECHNICAL TAB */}
                  {activeTab === "technical" && (
                    <div className="form-section">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Dimensions</label>
                          <input type="text" value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} placeholder="e.g., 100mm x 50mm x 25mm" className="form-control" />
                        </div>
                        <div className="form-group">
                          <label>Weight</label>
                          <input type="text" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g., 1.5kg" className="form-control" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Tolerance</label>
                        <input type="text" value={formData.tolerance} onChange={(e) => setFormData({ ...formData, tolerance: e.target.value })} placeholder="e.g., ±0.02mm or ±0.001 inch" className="form-control" />
                      </div>

                      <div className="form-group">
                        <label>Standards</label>
                        <input type="text" value={formData.standards} onChange={(e) => setFormData({ ...formData, standards: e.target.value })} placeholder="e.g., ASME V, EN 12668" className="form-control" />
                      </div>

                      <div className="form-group">
                        <label>Flaws/Defects</label>
                        <textarea value={formData.flaws} onChange={(e) => setFormData({ ...formData, flaws: e.target.value })} placeholder="e.g., Side drilled holes: 1.5mm, 3mm, 6mm diameter..." rows="3" className="form-control" />
                      </div>

                      {/* Materials Selection */}
                      <div className="form-group">
                        <label>Materials</label>
                        {formData.materials.length > 0 && (
                          <div className="selected-materials">
                            <div className="selected-materials-header">Selected Materials ({formData.materials.length}):</div>
                            <div className="selected-materials-list">
                              {formData.materials.map((material, idx) => (
                                <div key={idx} className="material-tag selected">
                                  {material}
                                  <button type="button" onClick={() => removeMaterial(material)} className="remove-material">×</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="materials-selection">
                          {commonMaterials.map((material, idx) => (
                            <div key={idx} onClick={() => handleMaterialToggle(material)} className={`material-tag ${formData.materials.includes(material) ? 'active' : ''}`}>
                              {material}
                            </div>
                          ))}
                        </div>
                        <div className="custom-material-input">
                          <input type="text" value={formData.customMaterial} onChange={(e) => setFormData({ ...formData, customMaterial: e.target.value })} placeholder="Add custom material..." className="form-control" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMaterial())} />
                          <button type="button" onClick={addCustomMaterial} className="add-material-btn">Add Material</button>
                        </div>
                      </div>

                      {/* Specifications */}
                      <div className="form-group">
                        <label>Specifications</label>
                        <div className="specs-list">
                          {specFields.map((field, index) => (
                            <div className="spec-row" key={index}>
                              <input type="text" placeholder="Name" value={field.key} onChange={(e) => handleSpecFieldChange(index, 'key', e.target.value)} className="form-control spec-key" />
                              <input type="text" placeholder="Value" value={field.value} onChange={(e) => handleSpecFieldChange(index, 'value', e.target.value)} className="form-control spec-value" />
                              <button type="button" onClick={() => removeSpecField(index)} className="remove-spec-btn">×</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={addSpecField} className="add-spec-btn">+ Add Specification</button>
                      </div>

                      {/* Features */}
                      <div className="form-group">
                        <label>Features</label>
                        <div className="features-list">
                          {featureFields.map((field, index) => (
                            <div className="feature-row" key={index}>
                              <input type="text" placeholder="Name" value={field.key} onChange={(e) => handleFeatureFieldChange(index, 'key', e.target.value)} className="form-control feature-key" />
                              <input type="text" placeholder="Description" value={field.value} onChange={(e) => handleFeatureFieldChange(index, 'value', e.target.value)} className="form-control feature-value" />
                              <button type="button" onClick={() => removeFeatureField(index)} className="remove-feature-btn">×</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={addFeatureField} className="add-feature-btn">+ Add Feature</button>
                      </div>
                    </div>
                  )}

                  {/* META DATA TAB */}
                  {activeTab === "meta" && (
                    <div className="form-section">
                      <div className="form-group">
                        <label>Meta Title (SEO)</label>
                        <input type="text" value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} placeholder="Optimized title for search engines" className="form-control" />
                        <small>Leave empty to use product name</small>
                      </div>
                      <div className="form-group">
                        <label>Meta Description</label>
                        <textarea value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} placeholder="Brief description for search engine results" rows="3" className="form-control" />
                        <small>Recommended length: 150-160 characters</small>
                      </div>
                      <div className="form-group">
                        <label>Meta Keywords</label>
                        <input type="text" value={formData.meta_keywords} onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })} placeholder="e.g., calibration block, ultrasonic testing, ASME" className="form-control" />
                        <small>Comma-separated keywords</small>
                      </div>
                    </div>
                  )}

                  {/* IMAGES TAB */}
                  {activeTab === "images" && (
                    <div className="form-section">
                      <div className="form-group">
                        <label>Product Images (Max 10)</label>
                        <div className="file-upload">
                          <input type="file" onChange={handleImageChange} multiple accept="image/*" id="productImages" className="file-input" />
                          <label htmlFor="productImages" className="file-label"><i className="fas fa-cloud-upload-alt"></i> Choose Files</label>
                          <span className="file-info">{formData.images.length} file(s) selected</span>
                        </div>
                        <small>First image will be the main product image by default.</small>
                      </div>

                      {imagePreview.length > 0 ? (
                        <div className="image-preview-container">
                          {imagePreview.map((img, idx) => (
                            <div key={idx} className={`image-preview ${idx === formData.mainImageIndex ? 'main-image' : ''}`} onClick={() => setMainImage(idx)}>
                              <img src={img.url} alt={img.name} className="preview-img" />
                              {idx === formData.mainImageIndex && (<div className="main-badge">MAIN</div>)}
                              <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="remove-image-btn">×</button>
                              <div className="image-name">{img.name}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-images">
                          <i className="fas fa-images"></i>
                          <p>No images selected</p>
                          <span>Click above to add product images</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="reset-button"><i className="fas fa-undo"></i> Reset Form</button>
                  <button type="submit" disabled={formLoading} className="submit-button">
                    {formLoading ? <><i className="fas fa-spinner fa-spin"></i> Adding Product...</> : <><i className="fas fa-plus-circle"></i> Add Product</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Products List */}
            <div className="products-list-container">
              <div className="products-header">
                <h2><i className="fas fa-boxes"></i> Products ({filteredProductList.length})</h2>
                <div className="product-filters">
                  <div className="search-container">
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    <i className="fas fa-search search-icon"></i>
                  </div>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="type-filter">
                    <option value="all">All Types</option>
                    <option value="calibration_block">Calibration Blocks</option>
                    <option value="flawed_specimen">Flawed Specimens</option>
                    <option value="validation_block">Validation Blocks</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading products...</p>
                </div>
              ) : (
                <div className="products-grid-wrapper" style={{ position: 'relative', minHeight: '300px' }}>
                  {isRefreshing && (
                    <div className="refresh-overlay"><div className="refresh-spinner"></div></div>
                  )}
                  {filteredProductList.length === 0 ? (
                    <div className="no-products"><i className="fas fa-box-open"></i><p>No products found</p></div>
                  ) : (
                    <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {filteredProductList.map((product) => (
                        <div key={product.id} className="product-card">
                          <div className="product-image">
                            <img src={getImageUrl(product.mainImage || product.image_url)} alt={product.name} loading="lazy" onError={handleImageError} />
                            <div className="product-type-badge" data-type={product.type}>{product.type.replace('_', ' ')}</div>
                          </div>
                          <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <div className="product-category">{product.category}</div>
                            <p className="product-description">
                              {product.short_description || (product.description?.length > 60 ? product.description.substring(0, 60) + "..." : product.description)}
                            </p>
                            <div className="product-footer">
                              <div className="product-price">{formatPrice(product.price)}</div>
                              <div className="product-actions">
                                <button onClick={() => viewProduct(product.id)} className="view-button">EDIT <i className="fas fa-eye"></i></button>
                                <button onClick={() => handleDelete(product.id)} className="delete-button">DELETE <i className="fas fa-trash-alt"></i></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Detail/Edit Modal */}
          {showEditModal && editingProduct && (
            <div className="modal-overlay" onClick={() => {
              if (!isEditMode || window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                setShowEditModal(false);
                setIsEditMode(false);
              }
            }}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>
                    {isEditMode ? (<><i className="fas fa-edit"></i> Edit Product</>) : (<><i className="fas fa-box-open"></i> Product Details</>)}
                  </h3>
                  <button className="close-button" onClick={() => {
                    if (!isEditMode || window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                      setShowEditModal(false);
                      setIsEditMode(false);
                    }
                  }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {isEditMode && (
                  <div className="edit-mode-notice"><i className="fas fa-edit"></i> You are editing this product</div>
                )}

                <div className="modal-body">
                  {isEditMode ? (
                    /* EDIT MODE */
                    <form onSubmit={handleEditSubmit}>
                      <div className="form-tabs">
                        <button type="button" className={editActiveTab === "basic" ? "tab-active" : ""} onClick={() => setEditActiveTab("basic")}><i className="fas fa-info-circle"></i> Basic Info</button>
                        <button type="button" className={editActiveTab === "technical" ? "tab-active" : ""} onClick={() => setEditActiveTab("technical")}><i className="fas fa-cogs"></i> Technical</button>
                        <button type="button" className={editActiveTab === "meta" ? "tab-active" : ""} onClick={() => setEditActiveTab("meta")}><i className="fas fa-tags"></i> Meta Data</button>
                        <button type="button" className={editActiveTab === "images" ? "tab-active" : ""} onClick={() => setEditActiveTab("images")}><i className="fas fa-images"></i> Images ({editFormData.existingImages.length - editFormData.deleteImages.length + editFormData.newImages.length})</button>
                      </div>

                      <div className="tab-content">
                        {editActiveTab === "basic" && (
                          <div className="form-section">
                            <div className="form-row">
                              <div className="form-group"><label>Product Name *</label><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required className="form-control" /></div>
                              <div className="form-group"><label>SKU</label><input type="text" value={editFormData.sku} onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })} className="form-control" /></div>
                            </div>
                            <div className="form-row">
                              <div className="form-group"><label>Product Type *</label><select value={editFormData.type} onChange={handleEditTypeChange} className="form-control"><option value="calibration_block">Calibration Block</option><option value="flawed_specimen">Flawed Specimen</option><option value="validation_block">Validation Block</option></select></div>
                              <div className="form-group"><label>Category *</label><select value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} required className="form-control"><option value="">Select category</option>{getCategoriesForType(editFormData.type).map((cat, index) => (<option key={index} value={cat}>{cat}</option>))}</select></div>
                            </div>
                            <div className="form-row">
                              <div className="form-group"><label>Subcategory</label><input type="text" value={editFormData.subcategory} onChange={(e) => setEditFormData({ ...editFormData, subcategory: e.target.value })} className="form-control" /></div>
                              <div className="form-group"><label>Featured Product</label><div className="toggle-container"><label className="toggle"><input type="checkbox" checked={editFormData.is_featured} onChange={(e) => setEditFormData({ ...editFormData, is_featured: e.target.checked })} /><span className="toggle-slider"></span></label><span className="toggle-label">{editFormData.is_featured ? "Yes" : "No"}</span></div></div>
                            </div>
                            <div className="form-group"><label>Short Description</label><input type="text" value={editFormData.short_description} onChange={(e) => setEditFormData({ ...editFormData, short_description: e.target.value })} className="form-control" /></div>
                            <div className="form-group"><label>Full Description *</label><textarea value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} rows="5" className="form-control" /></div>
                            <div className="form-row">
                              <div className="form-group"><label>Price (₹)</label><input type="number" value={editFormData.price} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} min="0" step="0.01" className="form-control" /></div>
                              <div className="form-group"><label>Compare At Price (₹)</label><input type="number" value={editFormData.compare_price} onChange={(e) => setEditFormData({ ...editFormData, compare_price: e.target.value })} min="0" step="0.01" className="form-control" /></div>
                            </div>
                            <div className="form-row">
                              <div className="form-group"><label>Cost Price (₹)</label><input type="number" value={editFormData.cost_price} onChange={(e) => setEditFormData({ ...editFormData, cost_price: e.target.value })} min="0" step="0.01" className="form-control" /></div>
                              <div className="form-group"><label>Stock Quantity</label><input type="number" value={editFormData.stock_quantity} onChange={(e) => setEditFormData({ ...editFormData, stock_quantity: e.target.value })} min="0" step="1" className="form-control" /></div>
                            </div>
                          </div>
                        )}

                        {editActiveTab === "technical" && (
                          <div className="form-section">
                            <div className="form-row">
                              <div className="form-group"><label>Dimensions</label><input type="text" value={editFormData.dimensions} onChange={(e) => setEditFormData({ ...editFormData, dimensions: e.target.value })} className="form-control" /></div>
                              <div className="form-group"><label>Weight</label><input type="text" value={editFormData.weight} onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })} className="form-control" /></div>
                            </div>
                            <div className="form-group"><label>Tolerance</label><input type="text" value={editFormData.tolerance} onChange={(e) => setEditFormData({ ...editFormData, tolerance: e.target.value })} className="form-control" /></div>
                            <div className="form-group"><label>Standards</label><input type="text" value={editFormData.standards} onChange={(e) => setEditFormData({ ...editFormData, standards: e.target.value })} className="form-control" /></div>
                            <div className="form-group"><label>Flaws/Defects</label><textarea value={editFormData.flaws} onChange={(e) => setEditFormData({ ...editFormData, flaws: e.target.value })} rows="3" className="form-control" /></div>

                            <div className="form-group">
                              <label>Materials</label>
                              {editFormData.materials.length > 0 && (
                                <div className="selected-materials">
                                  <div className="selected-materials-header">Selected Materials ({editFormData.materials.length}):</div>
                                  <div className="selected-materials-list">
                                    {editFormData.materials.map((material, idx) => (
                                      <div key={idx} className="material-tag selected">{material}<button type="button" onClick={() => removeMaterialEdit(material)} className="remove-material">×</button></div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="materials-selection">
                                {commonMaterials.map((material, idx) => (
                                  <div key={idx} onClick={() => handleEditMaterialToggle(material)} className={`material-tag ${editFormData.materials.includes(material) ? 'active' : ''}`}>{material}</div>
                                ))}
                              </div>
                              <div className="custom-material-input">
                                <input type="text" value={editFormData.customMaterial} onChange={(e) => setEditFormData({ ...editFormData, customMaterial: e.target.value })} placeholder="Add custom material..." className="form-control" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMaterialEdit())} />
                                <button type="button" onClick={addCustomMaterialEdit} className="add-material-btn">Add Material</button>
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Specifications</label>
                              <div className="specs-list">
                                {editSpecFields.map((field, index) => (
                                  <div className="spec-row" key={index}>
                                    <input type="text" placeholder="Name" value={field.key} onChange={(e) => handleEditSpecFieldChange(index, 'key', e.target.value)} className="form-control spec-key" />
                                    <input type="text" placeholder="Value" value={field.value} onChange={(e) => handleEditSpecFieldChange(index, 'value', e.target.value)} className="form-control spec-value" />
                                    <button type="button" onClick={() => removeEditSpecField(index)} className="remove-spec-btn">×</button>
                                  </div>
                                ))}
                              </div>
                              <button type="button" onClick={addEditSpecField} className="add-spec-btn">+ Add Specification</button>
                            </div>

                            <div className="form-group">
                              <label>Features</label>
                              <div className="features-list">
                                {editFeatureFields.map((field, index) => (
                                  <div className="feature-row" key={index}>
                                    <input type="text" placeholder="Name" value={field.key} onChange={(e) => handleEditFeatureFieldChange(index, 'key', e.target.value)} className="form-control feature-key" />
                                    <input type="text" placeholder="Description" value={field.value} onChange={(e) => handleEditFeatureFieldChange(index, 'value', e.target.value)} className="form-control feature-value" />
                                    <button type="button" onClick={() => removeEditFeatureField(index)} className="remove-feature-btn">×</button>
                                  </div>
                                ))}
                              </div>
                              <button type="button" onClick={addEditFeatureField} className="add-feature-btn">+ Add Feature</button>
                            </div>
                          </div>
                        )}

                        {editActiveTab === "meta" && (
                          <div className="form-section">
                            <div className="form-group"><label>Meta Title (SEO)</label><input type="text" value={editFormData.meta_title} onChange={(e) => setEditFormData({ ...editFormData, meta_title: e.target.value })} className="form-control" /><small>Leave empty to use product name</small></div>
                            <div className="form-group"><label>Meta Description</label><textarea value={editFormData.meta_description} onChange={(e) => setEditFormData({ ...editFormData, meta_description: e.target.value })} rows="3" className="form-control" /><small>Recommended length: 150-160 characters</small></div>
                            <div className="form-group"><label>Meta Keywords</label><input type="text" value={editFormData.meta_keywords} onChange={(e) => setEditFormData({ ...editFormData, meta_keywords: e.target.value })} className="form-control" /><small>Comma-separated keywords</small></div>
                          </div>
                        )}

                        {editActiveTab === "images" && (
                          <div className="form-section">
                            <div className="form-group">
                              <label>Product Images (Current: {editFormData.existingImages.length - editFormData.deleteImages.length}, New: {editFormData.newImages.length}, Max: 10)</label>
                              <div className="file-upload">
                                <input type="file" onChange={handleEditImageChange} multiple accept="image/*" id="editProductImages" className="file-input" />
                                <label htmlFor="editProductImages" className="file-label"><i className="fas fa-cloud-upload-alt"></i> Add More Images</label>
                                <span className="file-info">{editFormData.newImages.length} new file(s) selected</span>
                              </div>
                              <small>Click on an image to set it as the main product image.</small>
                            </div>

                            {editFormData.existingImages.length - editFormData.deleteImages.length > 0 && (
                              <div className="image-section">
                                <h4>Current Images</h4>
                                <div className="image-preview-container">
                                  {editFormData.existingImages
                                    .filter(img => !editFormData.deleteImages.includes(img.id))
                                    .map((img) => (
                                      <div key={img.id} className={`image-preview ${img.id === editFormData.mainImageId ? 'main-image' : ''}`} onClick={() => setMainImageEdit(img.id)}>
                                        <img src={getImageUrl(img.url)} alt="Product" className="preview-img" />
                                        {img.id === editFormData.mainImageId && (<div className="main-badge">MAIN</div>)}
                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeExistingImage(img.id); }} className="remove-image-btn">×</button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {editFormData.newImages.length > 0 && (
                              <div className="image-section">
                                <h4>New Images</h4>
                                <div className="image-preview-container">
                                  {editImagePreview.new.map((img, idx) => (
                                    <div key={idx} className={`image-preview ${editFormData.mainImageId === null && editFormData.mainImageIndex === idx ? 'main-image' : ''}`} onClick={() => setMainImageEdit(null, true, idx)}>
                                      <img src={img.url} alt={img.name} className="preview-img" />
                                      {editFormData.mainImageId === null && editFormData.mainImageIndex === idx && (<div className="main-badge">MAIN</div>)}
                                      <button type="button" onClick={(e) => { e.stopPropagation(); removeNewImage(idx); }} className="remove-image-btn">×</button>
                                      <div className="image-name">{img.name}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {editFormData.existingImages.length - editFormData.deleteImages.length === 0 && editFormData.newImages.length === 0 && (
                              <div className="no-images"><i className="fas fa-images"></i><p>No images available</p><span>Upload at least one image for your product</span></div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="form-actions modal-actions">
                        <button type="button" onClick={cancelEditMode} className="cancel-button"><i className="fas fa-times"></i> Cancel</button>
                        <button type="submit" disabled={editLoading} className="save-button">
                          {editLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* VIEW MODE */
                    <>
                      <div className="product-gallery">
                        <div className="main-product-image">
                          {editingProduct.images && editingProduct.images.length > 0 ? (
                            <>
                              <img src={getImageUrl(editingProduct.images[currentModalImage].url)} alt={editingProduct.name} onError={handleImageError} />
                              {editingProduct.images.length > 1 && (
                                <div className="modal-image-controls">
                                  <button className="modal-image-nav prev" onClick={prevModalImage}><i className="fas fa-chevron-left"></i></button>
                                  <span className="image-count">{currentModalImage + 1} / {editingProduct.images.length}</span>
                                  <button className="modal-image-nav next" onClick={nextModalImage}><i className="fas fa-chevron-right"></i></button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="no-image">No image available</div>
                          )}
                        </div>
                        {editingProduct.images && editingProduct.images.length > 1 && (
                          <div className="product-thumbnails">
                            {editingProduct.images.map((img, idx) => (
                              <div key={idx} className={`thumbnail ${idx === currentModalImage ? 'active-thumbnail' : ''}`} onClick={() => setCurrentModalImage(idx)}>
                                <img src={getImageUrl(img.url)} alt={`${editingProduct.name} ${idx + 1}`} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="product-details">
                        <div className="product-meta-header">
                          <div className="product-badges">
                            <span className="product-type" data-type={editingProduct.type}>{editingProduct.type.replace('_', ' ')}</span>
                            {editingProduct.is_featured && (<span className="featured-tag"><i className="fas fa-star"></i> Featured</span>)}
                          </div>
                          <div className="product-sku">SKU: {editingProduct.sku}</div>
                        </div>
                        <h1 className="product-title">{editingProduct.name}</h1>
                        <div className="product-categories">
                          <span className="category">{editingProduct.category}</span>
                          {editingProduct.subcategory && (<span className="subcategory">{editingProduct.subcategory}</span>)}
                        </div>
                        <div className="product-pricing">
                          <div className="current-price">{formatPrice(editingProduct.price)}</div>
                          {editingProduct.compare_price && (<div className="compare-price">{formatPrice(editingProduct.compare_price)}</div>)}
                        </div>
                        <div className="product-stock">Stock: <span>{editingProduct.stock_quantity || '0'} units</span></div>
                        <div className="product-description"><h3>Description</h3><p>{editingProduct.description}</p></div>

                        <div className="product-technical">
                          <h3>Technical Details</h3>
                          <div className="technical-grid">
                            {editingProduct.dimensions && (<div className="technical-item"><strong>Dimensions</strong><span>{editingProduct.dimensions}</span></div>)}
                            {editingProduct.tolerance && (<div className="technical-item"><strong>Tolerance</strong><span>{editingProduct.tolerance}</span></div>)}
                            {editingProduct.weight && (<div className="technical-item"><strong>Weight</strong><span>{editingProduct.weight}</span></div>)}
                            {editingProduct.standards && (<div className="technical-item"><strong>Standards</strong><span>{editingProduct.standards}</span></div>)}
                          </div>
                        </div>

                        {editingProduct.materials && editingProduct.materials.length > 0 && (
                          <div className="product-materials"><h3>Materials</h3><div className="materials-list">{editingProduct.materials.map((material, idx) => (<span key={idx} className="material-tag">{material}</span>))}</div></div>
                        )}
                        {editingProduct.flaws && (<div className="product-flaws"><h3>Flaws/Defects</h3><p>{editingProduct.flaws}</p></div>)}
                        {editingProduct.specifications && Object.keys(editingProduct.specifications).length > 0 && (
                          <div className="product-specifications"><h3>Specifications</h3><div className="specifications-list">{Object.entries(editingProduct.specifications).map(([key, value], idx) => (<div key={idx} className="specification-item"><div className="spec-key">{key}</div><div className="spec-value">{value}</div></div>))}</div></div>
                        )}
                        {editingProduct.features && Object.keys(editingProduct.features).length > 0 && (
                          <div className="product-features"><h3>Features</h3><div className="features-list">{Object.entries(editingProduct.features).map(([key, value], idx) => (<div key={idx} className="feature-item"><div className="feature-key">{key}</div><div className="feature-value">{value}</div></div>))}</div></div>
                        )}

                        <div className="meta-data-section">
                          <h3>SEO & Meta Data</h3>
                          <div className="meta-data-grid">
                            <div className="meta-item"><strong>Meta Title</strong><span>{editingProduct.meta_title || editingProduct.name}</span></div>
                            <div className="meta-item"><strong>Meta Description</strong><span>{editingProduct.meta_description || 'Not set'}</span></div>
                            <div className="meta-item"><strong>Meta Keywords</strong><span>{editingProduct.meta_keywords || 'Not set'}</span></div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  {isEditMode ? (
                    <div className="footer-actions">
                      <button onClick={cancelEditMode} className="cancel-button"><i className="fas fa-times"></i> Cancel</button>
                      <button onClick={handleEditSubmit} disabled={editLoading} className="save-button">
                        {editLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
                      </button>
                    </div>
                  ) : (
                    <div className="footer-actions">
                      <button onClick={() => setShowEditModal(false)} className="close-modal-button"><i className="fas fa-times"></i> Close</button>
                      <div>
                        <button onClick={enterEditMode} className="edit-button"><i className="fas fa-edit"></i> Edit Product</button>
                        <button onClick={() => { if (window.confirm("Are you sure you want to delete this product?")) { handleDelete(editingProduct.id); } }} className="delete-button" style={{ marginLeft: '10px' }}><i className="fas fa-trash-alt"></i> Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════
           NEWS SECTION
         ═══════════════════════════════════════ */}
      {mainSection === 'news' && (
        <div className="cms-section">
          <div className="cms-section-header">
            <h2><i className="fas fa-newspaper"></i> Manage News & Blogs</h2>
            <div className="cms-section-actions">
              <button className="cms-add-btn" onClick={() => { resetNewsForm(); setShowNewsForm(true); }}>
                <i className="fas fa-plus"></i> Add News
              </button>
              <button className="cms-refresh-btn" onClick={fetchNews} disabled={newsLoading}>
                <i className={`fas fa-sync-alt ${newsLoading ? 'fa-spin' : ''}`}></i> Refresh
              </button>
            </div>
          </div>

          {showNewsForm && (
            <div className="cms-form-card">
              <div className="cms-form-header">
                <h3><i className={`fas ${editingNews ? 'fa-edit' : 'fa-plus-circle'}`}></i> {editingNews ? 'Edit News' : 'Create News'}</h3>
                <button className="cms-form-close" onClick={resetNewsForm}><i className="fas fa-times"></i></button>
              </div>
              <form onSubmit={handleNewsSubmit}>
                <div className="cms-form-grid">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="text" value={newsForm.date} onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })} placeholder="e.g. 15. March 2026" required className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input type="number" value={newsForm.display_order} onChange={(e) => setNewsForm({ ...newsForm, display_order: parseInt(e.target.value) || 0 })} className="form-control" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} required className="form-control" placeholder="News headline..." />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea value={newsForm.description} onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })} rows={4} required className="form-control" placeholder="News content..." />
                </div>
                <div className="form-group">
                  <label>Image {editingNews ? '(leave empty to keep current)' : '*'}</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewsImage(file);
                      setNewsImagePreview(URL.createObjectURL(file));
                    }
                  }} className="form-control" />
                  {newsImagePreview && (
                    <div className="cms-preview-box">
                      <img src={newsImagePreview} alt="Preview" className="cms-preview-img" />
                    </div>
                  )}
                </div>
                <div className="cms-form-footer">
                  <button type="button" onClick={resetNewsForm} className="reset-button"><i className="fas fa-times"></i> Cancel</button>
                  <button type="submit" disabled={newsFormLoading} className="submit-button">
                    {newsFormLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-check"></i> {editingNews ? 'Update' : 'Create'}</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {newsLoading ? (
            <div className="loading-container"><div className="spinner"></div><p>Loading news...</p></div>
          ) : (
            <div className="cms-table-wrap">
              <table className="cms-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsItems.map(item => (
                    <tr key={item.id} className={!item.is_active ? 'cms-row-inactive' : ''}>
                      <td><img src={`${API_URL}${item.image}`} alt="" className="cms-table-thumb" onError={handleImageError} /></td>
                      <td><span className="cms-date-badge">{item.date}</span></td>
                      <td className="cms-cell-title">{item.title}</td>
                      <td><span className="cms-order-badge">{item.display_order}</span></td>
                      <td>
                        <button className={`cms-status-btn ${item.is_active ? 'active' : 'inactive'}`} onClick={() => toggleNewsActive(item)}>
                          {item.is_active ? '● Active' : '○ Hidden'}
                        </button>
                      </td>
                      <td className="cms-cell-actions">
                        <button onClick={() => handleNewsEdit(item)} className="cms-action-btn edit" title="Edit"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleNewsDelete(item.id)} className="cms-action-btn delete" title="Delete"><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                  {newsItems.length === 0 && (
                    <tr><td colSpan="6" className="cms-empty-row"><i className="fas fa-inbox"></i> No news items yet. Click "Add News" to create one.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
           TESTIMONIALS SECTION
         ═══════════════════════════════════════ */}
      {mainSection === 'testimonials' && (
        <div className="cms-section">
          <div className="cms-section-header">
            <h2><i className="fas fa-quote-left"></i> Manage Testimonials</h2>
            <div className="cms-section-actions">
              <button className="cms-add-btn" onClick={() => { resetTestimonialForm(); setShowTestimonialForm(true); }}>
                <i className="fas fa-plus"></i> Add Testimonial
              </button>
              <button className="cms-refresh-btn" onClick={fetchTestimonials} disabled={testimonialsLoading}>
                <i className={`fas fa-sync-alt ${testimonialsLoading ? 'fa-spin' : ''}`}></i> Refresh
              </button>
            </div>
          </div>

          {showTestimonialForm && (
            <div className="cms-form-card">
              <div className="cms-form-header">
                <h3><i className={`fas ${editingTestimonial ? 'fa-edit' : 'fa-plus-circle'}`}></i> {editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}</h3>
                <button className="cms-form-close" onClick={resetTestimonialForm}><i className="fas fa-times"></i></button>
              </div>
              <form onSubmit={handleTestimonialSubmit}>
                <div className="form-group">
                  <label>Quote *</label>
                                  <textarea value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} rows={4} required className="form-control" placeholder="Customer testimonial quote..." />
                </div>
                <div className="cms-form-grid">
                  <div className="form-group">
                    <label>Author Name *</label>
                    <input type="text" value={testimonialForm.author} onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })} required className="form-control" placeholder="Dr. Michael Chen" />
                  </div>
                  <div className="form-group">
                    <label>Position *</label>
                    <input type="text" value={testimonialForm.position} onChange={(e) => setTestimonialForm({ ...testimonialForm, position: e.target.value })} required className="form-control" placeholder="NDT Manager • Company" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" value={testimonialForm.display_order} onChange={(e) => setTestimonialForm({ ...testimonialForm, display_order: parseInt(e.target.value) || 0 })} className="form-control" />
                </div>
                <div className="cms-form-footer">
                  <button type="button" onClick={resetTestimonialForm} className="reset-button"><i className="fas fa-times"></i> Cancel</button>
                  <button type="submit" disabled={testimonialFormLoading} className="submit-button">
                    {testimonialFormLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-check"></i> {editingTestimonial ? 'Update' : 'Create'}</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {testimonialsLoading ? (
            <div className="loading-container"><div className="spinner"></div><p>Loading testimonials...</p></div>
          ) : (
            <div className="cms-cards-grid">
              {testimonials.map(item => (
                <div key={item.id} className={`cms-testimonial-card ${!item.is_active ? 'cms-card-inactive' : ''}`}>
                  <div className="cms-testimonial-quote">
                    <i className="fas fa-quote-left cms-quote-icon"></i>
                    <p>"{item.quote}"</p>
                  </div>
                  <div className="cms-testimonial-author">
                    <div>
                      <strong>{item.author}</strong>
                      <span>{item.position}</span>
                    </div>
                    <span className="cms-order-badge">#{item.display_order}</span>
                  </div>
                  <div className="cms-card-footer">
                    <button className={`cms-status-btn ${item.is_active ? 'active' : 'inactive'}`} onClick={() => toggleTestimonialActive(item)}>
                      {item.is_active ? '● Active' : '○ Hidden'}
                    </button>
                    <div className="cms-card-actions">
                      <button onClick={() => handleTestimonialEdit(item)} className="cms-action-btn edit"><i className="fas fa-edit"></i></button>
                      <button onClick={() => handleTestimonialDelete(item.id)} className="cms-action-btn delete"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="cms-empty-state"><i className="fas fa-comments"></i><p>No testimonials yet. Click "Add Testimonial" to create one.</p></div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
           TEAM VIDEOS SECTION
         ═══════════════════════════════════════ */}
      {mainSection === 'team' && (
        <div className="cms-section">
          <div className="cms-section-header">
            <h2><i className="fas fa-video"></i> Manage Team Videos</h2>
            <div className="cms-section-actions">
              <button className="cms-add-btn" onClick={() => { resetTeamForm(); setShowTeamForm(true); }}>
                <i className="fas fa-plus"></i> Add Team Member
              </button>
              <button className="cms-refresh-btn" onClick={fetchTeam} disabled={teamLoading}>
                <i className={`fas fa-sync-alt ${teamLoading ? 'fa-spin' : ''}`}></i> Refresh
              </button>
            </div>
          </div>

          {showTeamForm && (
            <div className="cms-form-card">
              <div className="cms-form-header">
                <h3><i className={`fas ${editingTeam ? 'fa-edit' : 'fa-plus-circle'}`}></i> {editingTeam ? 'Edit Team Member' : 'Add Team Member'}</h3>
                <button className="cms-form-close" onClick={resetTeamForm}><i className="fas fa-times"></i></button>
              </div>
              <form onSubmit={handleTeamSubmit}>
                <div className="cms-form-grid">
                  <div className="form-group">
                    <label>Short Name *</label>
                    <input type="text" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required className="form-control" placeholder="e.g. Dr. Chen & Santos" />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" value={teamForm.full_name} onChange={(e) => setTeamForm({ ...teamForm, full_name: e.target.value })} required className="form-control" placeholder="Dr. James Chen & Maria Santos" />
                  </div>
                </div>
                <div className="cms-form-grid">
                  <div className="form-group">
                    <label>Role *</label>
                    <input type="text" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} required className="form-control" placeholder="NDT Research & Development" />
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input type="number" value={teamForm.display_order} onChange={(e) => setTeamForm({ ...teamForm, display_order: parseInt(e.target.value) || 0 })} className="form-control" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Quote *</label>
                  <textarea value={teamForm.quote} onChange={(e) => setTeamForm({ ...teamForm, quote: e.target.value })} rows={3} required className="form-control" placeholder="Team member quote..." />
                </div>
                <div className="cms-form-grid">
                  <div className="form-group">
                    <label>Video File {editingTeam ? '(leave empty to keep current)' : '*'}</label>
                    <input type="file" accept="video/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setTeamVideo(file);
                        setTeamVideoPreview(URL.createObjectURL(file));
                      }
                    }} className="form-control" />
                    {teamVideoPreview && (
                      <div className="cms-preview-box">
                        <video src={teamVideoPreview} className="cms-preview-video" controls muted />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Thumbnail {editingTeam ? '(leave empty to keep current)' : '*'}</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setTeamThumbnail(file);
                        setTeamThumbPreview(URL.createObjectURL(file));
                      }
                    }} className="form-control" />
                    {teamThumbPreview && (
                      <div className="cms-preview-box">
                        <img src={teamThumbPreview} alt="Thumb Preview" className="cms-preview-img" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="cms-form-footer">
                  <button type="button" onClick={resetTeamForm} className="reset-button"><i className="fas fa-times"></i> Cancel</button>
                  <button type="submit" disabled={teamFormLoading} className="submit-button">
                    {teamFormLoading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-check"></i> {editingTeam ? 'Update' : 'Create'}</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {teamLoading ? (
            <div className="loading-container"><div className="spinner"></div><p>Loading team members...</p></div>
          ) : (
            <div className="cms-team-grid">
              {teamMembers.map(item => (
                <div key={item.id} className={`cms-team-card ${!item.is_active ? 'cms-card-inactive' : ''}`}>
                  <div className="cms-team-media">
                    <video
                      src={`${API_URL}${item.video}`}
                      poster={`${API_URL}${item.thumbnail}`}
                      className="cms-team-video"
                      muted
                      preload="metadata"
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                    />
                    <div className="cms-team-play-overlay"><i className="fas fa-play"></i></div>
                  </div>
                  <div className="cms-team-info">
                    <h4>{item.full_name}</h4>
                    <span className="cms-team-role">{item.role}</span>
                    <p className="cms-team-quote">"{item.quote.length > 80 ? item.quote.substring(0, 80) + '...' : item.quote}"</p>
                    <div className="cms-card-footer">
                      <button className={`cms-status-btn ${item.is_active ? 'active' : 'inactive'}`} onClick={() => toggleTeamActive(item)}>
                        {item.is_active ? '● Active' : '○ Hidden'}
                      </button>
                      <div className="cms-card-actions">
                        <button onClick={() => handleTeamEdit(item)} className="cms-action-btn edit"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleTeamDelete(item.id)} className="cms-action-btn delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="cms-empty-state"><i className="fas fa-film"></i><p>No team members yet. Click "Add Team Member" to create one.</p></div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;