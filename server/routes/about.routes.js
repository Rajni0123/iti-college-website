const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aboutController = require('../controllers/about.controller');

// Public route
router.get('/', aboutController.getAbout);

// Protected route
router.use(auth);
router.put('/', aboutController.updateAbout);

module.exports = router;
