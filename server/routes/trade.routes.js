const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { handleMulterError } = require('../middleware/upload');
const tradeController = require('../controllers/trade.controller');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`[TRADE ROUTES] ${req.method} ${req.path}`);
  next();
});

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
// Get all active trades (public)
router.get('/', (req, res, next) => {
  console.log('[TRADE ROUTES] GET / - Calling getTrades controller');
  tradeController.getTrades(req, res, next);
});

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================
// Apply auth middleware to all routes below
router.use(auth);

// IMPORTANT: Specific routes like '/admin/all' must be defined BEFORE
// parameterized routes like '/:slug' to avoid route conflicts
router.get('/admin/all', tradeController.getAllTrades);
router.post('/', upload.fields([{ name: 'syllabus_pdf', maxCount: 1 }, { name: 'prospectus_pdf', maxCount: 1 }]), handleMulterError, (req, res, next) => {
  console.log('[TRADE ROUTES] POST / - Creating trade');
  console.log('[TRADE ROUTES] Body fields:', Object.keys(req.body || {}));
  console.log('[TRADE ROUTES] Files:', req.files);
  tradeController.createTrade(req, res, next);
});
router.put('/:id', upload.fields([{ name: 'syllabus_pdf', maxCount: 1 }, { name: 'prospectus_pdf', maxCount: 1 }]), handleMulterError, (req, res, next) => {
  console.log(`[TRADE ROUTES] PUT /${req.params.id} - Updating trade`);
  console.log('[TRADE ROUTES] Body fields:', Object.keys(req.body || {}));
  console.log('[TRADE ROUTES] Files:', req.files);
  tradeController.updateTrade(req, res, next);
});
router.delete('/:id', tradeController.deleteTrade);

// ============================================
// PUBLIC ROUTES (After protected routes)
// ============================================
// Get trade by slug (public) - must be after /admin/all to avoid conflicts
router.get('/:slug', (req, res, next) => {
  console.log(`[TRADE ROUTES] GET /${req.params.slug} - Calling getTradeBySlug controller`);
  tradeController.getTradeBySlug(req, res, next);
});

// Catch-all for undefined trade routes
router.use((req, res) => {
  console.warn(`[TRADE ROUTES] Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false,
    message: `Trade route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /',
      'GET /:slug',
      'GET /admin/all (protected)',
      'POST / (protected)',
      'PUT /:id (protected)',
      'DELETE /:id (protected)'
    ]
  });
});

module.exports = router;
