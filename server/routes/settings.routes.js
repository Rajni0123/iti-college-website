const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', settingsController.getAllSettings);
router.get('/fee-structure/download', settingsController.getFeeStructurePdf);
router.get('/fee-structure/info', settingsController.getFeeStructurePdfInfo);

// Admin routes
router.post('/fee-structure/upload', auth, upload.single('pdf'), settingsController.uploadFeeStructurePdf);
router.post('/favicon/upload', auth, upload.single('favicon'), settingsController.uploadFavicon);
router.get('/favicon/info', settingsController.getFaviconInfo);

module.exports = router;
