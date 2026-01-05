const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  }
});

// Database connection
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'daks_ndt',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

// Initialize database tables
async function initDb() {
  try {
    // Check if database exists
    const [databases] = await db.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME || 'daks_ndt']);
    if (databases.length === 0) {
      await db.query(`CREATE DATABASE ${process.env.DB_NAME || 'daks_ndt'}`);
      console.log(`✅ Database created: ${process.env.DB_NAME || 'daks_ndt'}`);
    }

    // Use the database
    await db.query(`USE ${process.env.DB_NAME || 'daks_ndt'}`);

    // Check if products table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'products'");
    
    if (tables.length === 0) {
      // Create products table
      await db.query(`
        CREATE TABLE products (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          short_description TEXT,
          category VARCHAR(100) NOT NULL,
          subcategory VARCHAR(100),
          type VARCHAR(50) NOT NULL,
          price DECIMAL(10,2) DEFAULT 0.00,
          compare_price DECIMAL(10,2),
          cost_price DECIMAL(10,2),
          image_url VARCHAR(500),
          dimensions VARCHAR(255),
          tolerance VARCHAR(255),
          flaws TEXT,
          materials JSON,
          weight VARCHAR(100),
          standards VARCHAR(255),
          specifications JSON,
          features JSON,
          stock_quantity INT DEFAULT 10,
          sku VARCHAR(100),
          meta_title VARCHAR(255),
          meta_description TEXT,
          meta_keywords VARCHAR(255),
          is_featured BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Products table created');
    } else {
      console.log('✅ Products table already exists');
    }

    // Check if product_images table exists
    const [imageTables] = await db.query("SHOW TABLES LIKE 'product_images'");
    
    if (imageTables.length === 0) {
      // Create product_images table
      await db.query(`
        CREATE TABLE product_images (
          id INT PRIMARY KEY AUTO_INCREMENT,
          product_id INT NOT NULL,
          image_url VARCHAR(500) NOT NULL,
          is_main BOOLEAN DEFAULT FALSE,
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Product_images table created');
    } else {
      console.log('✅ Product_images table already exists');
    }

    // Check if tables have data
    const [productCount] = await db.query('SELECT COUNT(*) as count FROM products');
    console.log(`📊 Products in database: ${productCount[0].count}`);

    const [imageCount] = await db.query('SELECT COUNT(*) as count FROM product_images');
    console.log(`📊 Images in database: ${imageCount[0].count}`);

  } catch (error) {
    console.error('❌ DB Init Error:', error.message);
  }
}

// Helper function to parse JSON fields
function parseProductFields(product) {
  if (!product) return null;

  // Parse JSON fields
  const jsonFields = ['materials', 'specifications', 'features'];
  
  jsonFields.forEach(field => {
    if (product[field]) {
      try {
        product[field] = JSON.parse(product[field]);
      } catch (e) {
        product[field] = field === 'materials' ? [] : {};
      }
    } else {
      product[field] = field === 'materials' ? [] : {};
    }
  });

  return product;
}

// ======================
// PRODUCT ROUTES
// ======================

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    console.log('📥 GET /api/products called');
    
    const { type, category, search, limit = 100 } = req.query;
    let query = 'SELECT * FROM products WHERE is_active = TRUE';
    const params = [];

    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
      console.log(`🔍 Filtering by type: ${type}`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
      console.log(`🔍 Filtering by category: ${category}`);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      console.log(`🔍 Searching for: ${search}`);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    console.log(`📝 SQL Query: ${query}`);
    console.log(`📝 SQL Params:`, params);

    const [products] = await db.query(query, params);
    console.log(`✅ Found ${products.length} products`);

    // Get images for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const [images] = await db.query(
          'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_main DESC, sort_order ASC',
          [product.id]
        );

        const parsedProduct = parseProductFields(product);
        
        parsedProduct.images = images.map(img => ({
          id: img.id,
          url: img.image_url,
          isMain: img.is_main === 1,
          sortOrder: img.sort_order
        }));

        // Set main image
        const mainImage = images.find(img => img.is_main === 1);
        parsedProduct.mainImage = mainImage ? mainImage.image_url : 
          (images.length > 0 ? images[0].image_url : product.image_url);
        
        parsedProduct.image_url = parsedProduct.mainImage;

        console.log(`📦 Product: ${product.name}, Images: ${images.length}, Main: ${parsedProduct.mainImage}`);

        return parsedProduct;
      })
    );

    res.json({
      success: true,
      products: productsWithImages
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products',
      error: error.message
    });
  }
});

// GET SINGLE PRODUCT BY ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 GET /api/products/${id} called`);

    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (products.length === 0) {
      console.log(`❌ Product ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log(`✅ Found product: ${products[0].name}`);

    const product = products[0];

    // Get all images for this product
    const [images] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_main DESC, sort_order ASC',
      [id]
    );

    console.log(`📸 Found ${images.length} images for product ${id}`);

    const parsedProduct = parseProductFields(product);
    
    parsedProduct.images = images.map(img => ({
      id: img.id,
      url: img.image_url,
      isMain: img.is_main === 1,
      sortOrder: img.sort_order
    }));

    // Set main image
    const mainImage = images.find(img => img.is_main === 1);
    parsedProduct.mainImage = mainImage ? mainImage.image_url : 
      (images.length > 0 ? images[0].image_url : product.image_url);
    
    parsedProduct.image_url = parsedProduct.mainImage;

    res.json({
      success: true,
      product: parsedProduct
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product'
    });
  }
});

// CREATE PRODUCT
app.post('/api/products', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📝 POST /api/products called');
    console.log('📦 Body:', req.body);
    console.log('📸 Files:', req.files?.length || 0);

    const { 
      name, description, short_description, category, subcategory, type,
      price, compare_price, cost_price, stock_quantity, sku,
      dimensions, tolerance, flaws, weight, standards,
      materials, specifications, features,
      meta_title, meta_description, meta_keywords,
      is_featured, mainImageIndex = 0
    } = req.body;

    // Validate required fields
    if (!name || !category || !type) {
      console.log('❌ Missing required fields');
      console.log('Name:', name);
      console.log('Category:', category);
      console.log('Type:', type);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, and type'
      });
    }

    // Parse JSON fields
    let materialsArray = [];
    if (materials) {
      try {
        materialsArray = typeof materials === 'string' ? JSON.parse(materials) : materials;
      } catch (e) {
        materialsArray = Array.isArray(materials) ? materials : [];
      }
    }

    let specificationsObj = {};
    if (specifications) {
      try {
        specificationsObj = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      } catch (e) {
        specificationsObj = {};
      }
    }

    let featuresObj = {};
    if (features) {
      try {
        featuresObj = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        featuresObj = {};
      }
    }

    console.log('📋 Prepared data for insertion');

    // Insert product
    const [result] = await db.query(
      `INSERT INTO products (
        name, description, short_description, category, subcategory, type,
        price, compare_price, cost_price, stock_quantity, sku,
        dimensions, tolerance, flaws, weight, standards,
        materials, specifications, features,
        meta_title, meta_description, meta_keywords, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description || '', short_description || '', category, subcategory || '', type,
        parseFloat(price) || 0, compare_price ? parseFloat(compare_price) : null, 
        cost_price ? parseFloat(cost_price) : null, parseInt(stock_quantity) || 10, sku || '',
        dimensions || null, tolerance || null, flaws || null, weight || null, standards || null,
        JSON.stringify(materialsArray), JSON.stringify(specificationsObj), JSON.stringify(featuresObj),
        meta_title || null, meta_description || null, meta_keywords || null,
        is_featured === 'true' || is_featured === true
      ]
    );

    const productId = result.insertId;
    console.log(`✅ Product inserted with ID: ${productId}`);

    // Handle images
    let mainImageUrl = null;
    if (req.files && req.files.length > 0) {
      console.log(`📸 Processing ${req.files.length} images`);
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageUrl = `/uploads/products/${file.filename}`;
        const isMain = parseInt(mainImageIndex) === i;
        
        console.log(`📸 Image ${i+1}: ${file.filename}, Main: ${isMain}`);

        if (isMain) {
          mainImageUrl = imageUrl;
          console.log(`⭐ Set as main image: ${imageUrl}`);
        }

        await db.query(
          'INSERT INTO product_images (product_id, image_url, is_main, sort_order) VALUES (?, ?, ?, ?)',
          [productId, imageUrl, isMain, i]
        );
      }

      // If main image was set, update product
      if (mainImageUrl) {
        await db.query('UPDATE products SET image_url = ? WHERE id = ?', [mainImageUrl, productId]);
        console.log(`🔄 Updated product image_url: ${mainImageUrl}`);
      }
    }

    // Fetch the created product with images
    const [productRows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    const [imageRows] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_main DESC, sort_order ASC',
      [productId]
    );

    console.log(`📊 Fetched ${imageRows.length} images for product ${productId}`);

    const product = parseProductFields(productRows[0]);
    product.images = imageRows.map(img => ({
      id: img.id,
      url: img.image_url,
      isMain: img.is_main === 1,
      sortOrder: img.sort_order
    }));

    // Set main image
    const mainImage = imageRows.find(img => img.is_main === 1);
    product.mainImage = mainImage ? mainImage.image_url : 
      (imageRows.length > 0 ? imageRows[0].image_url : product.image_url);
    
    product.image_url = product.mainImage;

    console.log(`🎉 Product created successfully: ${product.name}`);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, 'uploads/products', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🧹 Cleaned up file: ${file.filename}`);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating product',
      error: error.message
    });
  }
});

// ======================
// PRODUCT REORDER ENDPOINT
// ======================

// PUT /api/products/reorder - Update sort order of multiple products
app.put('/api/products/reorder', async (req, res) => {
  try {
    const { items } = req.body;
    
    console.log('📋 Received reorder request for', items?.length, 'items');
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data. Expected items array.'
      });
    }
    
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update each product's sort_order
      for (const item of items) {
        if (item.id && typeof item.sort_order === 'number') {
          console.log(`   Updating product ${item.id} to sort_order ${item.sort_order}`);
          await connection.query(
            'UPDATE products SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [item.sort_order, item.id]
          );
        }
      }
      
      await connection.commit();
      connection.release();
      
      console.log(`✅ Reordered ${items.length} products successfully`);
      
      res.json({
        success: true,
        message: 'Product order updated successfully'
      });
      
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('❌ Transaction error:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Error reordering products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// UPDATE PRODUCT
app.put('/api/products/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 PUT /api/products/${id} called`);
    console.log('📦 Body:', req.body);
    console.log('📸 Files:', req.files?.length || 0);

    // Check if product exists
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      console.log(`❌ Product ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log(`✅ Found existing product: ${existing[0].name}`);

    // Handle image deletions
    if (req.body.deleteImages) {
      let imagesToDelete = [];
      try {
        imagesToDelete = typeof req.body.deleteImages === 'string' ? JSON.parse(req.body.deleteImages) : req.body.deleteImages;
      } catch (e) {
        imagesToDelete = [];
      }

      console.log(`🗑️ Deleting ${imagesToDelete.length} images`);

      for (const imageId of imagesToDelete) {
        const [imgRows] = await db.query(
          'SELECT image_url FROM product_images WHERE id = ? AND product_id = ?',
          [imageId, id]
        );
        
        if (imgRows.length > 0) {
          const imagePath = path.join(__dirname, imgRows[0].image_url);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`🧹 Deleted file: ${imgRows[0].image_url}`);
          }
          await db.query('DELETE FROM product_images WHERE id = ?', [imageId]);
          console.log(`🗑️ Deleted image record: ${imageId}`);
        }
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      // Get current max sort order
      const [maxOrder] = await db.query(
        'SELECT MAX(sort_order) as max_order FROM product_images WHERE product_id = ?',
        [id]
      );
      let sortOrder = (maxOrder[0].max_order || -1) + 1;

      console.log(`📸 Adding ${req.files.length} new images starting at sort order ${sortOrder}`);

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await db.query(
          'INSERT INTO product_images (product_id, image_url, is_main, sort_order) VALUES (?, ?, ?, ?)',
          [id, `/uploads/products/${file.filename}`, 0, sortOrder + i]
        );
        console.log(`📸 Added image: ${file.filename}`);
      }
    }

    // Handle main image setting
    if (req.body.mainImageId !== undefined && req.body.mainImageId !== null) {
      // Set specified existing image as main
      console.log(`⭐ Setting main image by ID: ${req.body.mainImageId}`);
      await db.query('UPDATE product_images SET is_main = 0 WHERE product_id = ?', [id]);
      await db.query('UPDATE product_images SET is_main = 1 WHERE id = ? AND product_id = ?', [req.body.mainImageId, id]);
      
      // Get image URL and update product
      const [mainImageRow] = await db.query(
        'SELECT image_url FROM product_images WHERE id = ?',
        [req.body.mainImageId]
      );
      if (mainImageRow.length > 0) {
        await db.query('UPDATE products SET image_url = ? WHERE id = ?', [mainImageRow[0].image_url, id]);
        console.log(`🔄 Updated product image_url: ${mainImageRow[0].image_url}`);
      }
    } else if (req.body.mainImageIndex !== undefined && req.body.mainImageIndex !== null) {
      // Set image at index as main (for new images)
      console.log(`⭐ Setting main image by index: ${req.body.mainImageIndex}`);
      const [allImages] = await db.query(
        'SELECT id, image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
        [id]
      );
      
      if (allImages.length > 0) {
        const mainIdx = Math.min(parseInt(req.body.mainImageIndex), allImages.length - 1);
        await db.query('UPDATE product_images SET is_main = 0 WHERE product_id = ?', [id]);
        await db.query('UPDATE product_images SET is_main = 1 WHERE id = ?', [allImages[mainIdx].id]);
        await db.query('UPDATE products SET image_url = ? WHERE id = ?', [allImages[mainIdx].image_url, id]);
        console.log(`🔄 Updated product image_url: ${allImages[mainIdx].image_url}`);
      }
    }

    // Parse JSON fields for update
    let materialsArray = [];
    if (req.body.materials !== undefined) {
      try {
        materialsArray = typeof req.body.materials === 'string' ? JSON.parse(req.body.materials) : req.body.materials;
      } catch (e) {
        materialsArray = Array.isArray(req.body.materials) ? req.body.materials : [];
      }
    }

    let specificationsObj = {};
    if (req.body.specifications !== undefined) {
      try {
        specificationsObj = typeof req.body.specifications === 'string' ? JSON.parse(req.body.specifications) : req.body.specifications;
      } catch (e) {
        specificationsObj = {};
      }
    }

    let featuresObj = {};
    if (req.body.features !== undefined) {
      try {
        featuresObj = typeof req.body.features === 'string' ? JSON.parse(req.body.features) : req.body.features;
      } catch (e) {
        featuresObj = {};
      }
    }

    // Build update query
    const updates = [];
    const params = [];

    const fields = {
      name: req.body.name,
      description: req.body.description,
      short_description: req.body.short_description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      type: req.body.type,
      price: req.body.price,
      compare_price: req.body.compare_price,
      cost_price: req.body.cost_price,
      stock_quantity: req.body.stock_quantity,
      sku: req.body.sku,
      dimensions: req.body.dimensions,
      tolerance: req.body.tolerance,
      flaws: req.body.flaws,
      weight: req.body.weight,
      standards: req.body.standards,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
      is_featured: req.body.is_featured
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'price' || key === 'compare_price' || key === 'cost_price') {
          updates.push(`${key} = ?`);
          params.push(value !== '' ? parseFloat(value) : null);
        } else if (key === 'stock_quantity') {
          updates.push(`${key} = ?`);
          params.push(value !== '' ? parseInt(value) : 0);
        } else if (key === 'is_featured') {
          updates.push(`${key} = ?`);
          params.push(value === 'true' || value === true);
        } else {
          updates.push(`${key} = ?`);
          params.push(value || null);
        }
      }
    });

    // Add JSON fields
    if (req.body.materials !== undefined) {
      updates.push('materials = ?');
      params.push(JSON.stringify(materialsArray));
    }
    
    if (req.body.specifications !== undefined) {
      updates.push('specifications = ?');
      params.push(JSON.stringify(specificationsObj));
    }
    
    if (req.body.features !== undefined) {
      updates.push('features = ?');
      params.push(JSON.stringify(featuresObj));
    }

    if (updates.length > 0) {
      params.push(id);
      const updateQuery = `UPDATE products SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      console.log(`📝 Update query: ${updateQuery}`);
      console.log(`📝 Update params:`, params);
      
      await db.query(updateQuery, params);
      console.log(`✅ Product updated`);
    } else {
      console.log(`📝 No fields to update`);
    }

    // Fetch updated product with images
    const [productRows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const [imageRows] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_main DESC, sort_order ASC',
      [id]
    );

    console.log(`📊 Fetched ${imageRows.length} images for updated product`);

    const product = parseProductFields(productRows[0]);
    product.images = imageRows.map(img => ({
      id: img.id,
      url: img.image_url,
      isMain: img.is_main === 1,
      sortOrder: img.sort_order
    }));

    // Set main image
    const mainImage = imageRows.find(img => img.is_main === 1);
    product.mainImage = mainImage ? mainImage.image_url : 
      (imageRows.length > 0 ? imageRows[0].image_url : product.image_url);
    
    product.image_url = product.mainImage;

    console.log(`🎉 Product updated successfully: ${product.name}`);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product',
      error: error.message
    });
  }
});

// DELETE PRODUCT
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/products/${id} called`);

    // Get all images for this product
    const [images] = await db.query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [id]
    );

    console.log(`📸 Found ${images.length} images to delete`);

    // Delete all image files
    for (const img of images) {
      const imagePath = path.join(__dirname, img.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`🧹 Deleted file: ${img.image_url}`);
      }
    }

    // Delete from database (product_images will be deleted by CASCADE)
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    console.log(`🗑️ Deleted product ${id} from database`);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: process.env.DB_NAME || 'daks_ndt'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initDb();
});