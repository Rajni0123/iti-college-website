const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const heroController = require('../controllers/hero.controller');

// Public route
router.get('/', heroController.getHero);

// Protected routes
router.use(auth);
router.get('/all', heroController.getAllHero);
router.post('/', heroController.createHero);
router.put('/:id', heroController.updateHero);
router.delete('/:id', heroController.deleteHero);

module.exports = router;
