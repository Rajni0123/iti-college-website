const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const menuController = require('../controllers/menu.controller');

// Public route
router.get('/', menuController.getMenus);

// Protected routes
router.use(auth);
router.post('/seed', menuController.seedMenus);
router.post('/', menuController.createMenu);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router;
