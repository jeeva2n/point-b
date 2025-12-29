const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const mysql = require('mysql2/promise');

const app = express();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'daks',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors({
  origin: '*', // Allow all for testing
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Static files
app.use('/uploads', express.static(uploadsDir));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// JWT Secret Key (Use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-key-2024-daks-ndt';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

// Rate limiting middleware (Basic implementation)
const rateLimitMap = new Map();
const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 attempts per 15 minutes

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { attempts: 1, firstAttempt: now });
    return next();
  }

  const data = rateLimitMap.get(ip);
  
  if (now - data.firstAttempt > windowMs) {
    // Reset if window has passed
    rateLimitMap.set(ip, { attempts: 1, firstAttempt: now });
    return next();
  }

  if (data.attempts >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.'
    });
  }

  data.attempts++;
  next();
};

// Secure Admin Login
app.post('/api/admin/login', rateLimit, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const admin = rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        type: 'admin'
      }, 
      JWT_SECRET,
      { expiresIn: '8h' } // Shorter expiry for security
    );

    res.json({ 
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Change admin password
app.post('/api/admin/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE id = ?',
      [req.adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const admin = rows[0];
    const validCurrentPassword = await bcrypt.compare(currentPassword, admin.password);

    if (!validCurrentPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.execute(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedNewPassword, req.adminId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
});

// Get all products (with type filter)
app.get('/api/products', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM products';
    let params = [];

    if (type) {
      query += ' WHERE product_type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    res.json({
      success: true,
      products: rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching products' 
    });
  }
});

// Create new product (protected)
app.post('/api/products', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, subcategory, product_type } = req.body;
    
    if (!name || !description || !category || !subcategory || !product_type) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Product image is required' 
      });
    }

    const imageUrl = '/uploads/' + req.file.filename;

    const [result] = await pool.execute(
      `INSERT INTO products (name, description, category, subcategory, image_url, product_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category, subcategory, imageUrl, product_type]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating product' 
    });
  }
});

// Delete product (protected)
app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, rows[0].image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting product' 
    });
  }
});

// Verify token endpoint
app.get('/api/admin/verify', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email FROM admins WHERE id = ?',
      [req.adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: rows[0]
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// Logout endpoint (client-side token removal)
app.post('/api/admin/logout', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'DAKS NDT Backend is running',
    database: 'MySQL',
    security: 'Enabled'
  });
});

// Initialize admin and start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  await initializeAdmin();
  console.log(`✅ Secure Server running on port ${PORT}`);
  console.log(`🔒 Admin authentication: ENABLED`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
});