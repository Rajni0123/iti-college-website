const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://manerpvtiti.space',
  'https://www.manerpvtiti.space',
  'https://api.manerpvtiti.space',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in production for flexibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increase URL-encoded payload limit

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/notices', require('./routes/notice.routes'));
app.use('/api/results', require('./routes/result.routes'));
app.use('/api/gallery', require('./routes/gallery.routes'));
app.use('/api/admissions', require('./routes/admission.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/menus', require('./routes/menu.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/hero', require('./routes/hero.routes'));
app.use('/api/flash-news', require('./routes/flashnews.routes'));
const feeRoutes = require('./routes/fee.routes');
app.use('/api/fees', feeRoutes);
console.log('✓ Fee routes registered at /api/fees');
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/site', require('./routes/headerfooter.routes'));
// Trades routes
const tradeRoutes = require('./routes/trade.routes');
app.use('/api/trades', tradeRoutes);
console.log('✓ Trades routes registered at /api/trades');

// About page routes
app.use('/api/about', require('./routes/about.routes'));
console.log('✓ About page routes registered at /api/about');

// Admission Process routes
app.use('/api/admission-process', require('./routes/admissionProcess.routes'));
console.log('✓ Admission Process routes registered at /api/admission-process');

// Faculty routes
app.use('/api/faculty', require('./routes/faculty.routes'));
console.log('✓ Faculty routes registered at /api/faculty');

// Staff routes
app.use('/api/staff', require('./routes/staff.routes'));
console.log('✓ Staff routes registered at /api/staff');

// Student routes
app.use('/api/students', require('./routes/student.routes'));
console.log('✓ Student routes registered at /api/students');

// Session routes
app.use('/api/sessions', require('./routes/session.routes'));
console.log('✓ Session routes registered at /api/sessions');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test trades endpoint
app.get('/api/test-trades', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Trades route test endpoint',
    routes: {
      public: 'GET /api/trades',
      admin: 'GET /api/trades/admin/all (requires auth)',
      bySlug: 'GET /api/trades/:slug'
    }
  });
});

// Database health check - verify trades table exists
app.get('/api/health/db', (req, res) => {
  const db = require('./database/db').getDb();
  
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='trades'", [], (err, row) => {
    if (err) {
      return res.status(500).json({ 
        status: 'ERROR', 
        message: 'Database error', 
        error: err.message 
      });
    }
    
    if (row) {
      // Table exists, check if it has data
      db.get('SELECT COUNT(*) as count FROM trades', [], (err, countRow) => {
        if (err) {
          return res.status(500).json({ 
            status: 'ERROR', 
            message: 'Error checking trades data', 
            error: err.message 
          });
        }
        
        res.json({ 
          status: 'OK', 
          message: 'Database is healthy',
          tradesTable: true,
          tradesCount: countRow?.count || 0
        });
      });
    } else {
      res.json({ 
        status: 'WARNING', 
        message: 'Trades table does not exist. Please restart the server to create it.',
        tradesTable: false,
        tradesCount: 0
      });
    }
  });
});

// Initialize database
const db = require('./database/db');
db.init();

// 404 handler for undefined routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.warn(`[404] API route not found: ${req.method} ${req.path}`);
    return res.status(404).json({ 
      success: false,
      message: `API route not found: ${req.method} ${req.path}`,
      availableRoutes: [
        'GET /api/trades',
        'GET /api/trades/:slug',
        'GET /api/trades/admin/all (protected)',
        'POST /api/trades (protected)',
        'PUT /api/trades/:id (protected)',
        'DELETE /api/trades/:id (protected)'
      ]
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`API base URL: ${process.env.API_DOMAIN || 'https://api.manerpvtiti.space'}/api`);
  } else {
    console.log(`API base URL: http://localhost:${PORT}/api`);
  }
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
