const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const flashNewsController = require('../controllers/flashnews.controller');

// Public route
router.get('/', flashNewsController.getFlashNews);

// Protected routes
router.use(auth);
router.get('/all', flashNewsController.getAllFlashNews);
router.post('/', flashNewsController.createFlashNews);
router.put('/:id', flashNewsController.updateFlashNews);
router.delete('/:id', flashNewsController.deleteFlashNews);

module.exports = router;
