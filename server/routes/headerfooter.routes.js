const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const headerFooterController = require('../controllers/headerfooter.controller');

// Public routes
router.get('/header', headerFooterController.getHeaderSettings);
router.get('/footer', headerFooterController.getFooterSettings);

// Protected admin routes
router.put('/header', auth, headerFooterController.updateHeaderSettings);
router.put('/footer', auth, headerFooterController.updateFooterSettings);
router.get('/footer/links/all', auth, headerFooterController.getAllFooterLinks);
router.post('/footer/links', auth, headerFooterController.createFooterLink);
router.put('/footer/links/:id', auth, headerFooterController.updateFooterLink);
router.delete('/footer/links/:id', auth, headerFooterController.deleteFooterLink);

module.exports = router;
