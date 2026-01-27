const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const staffController = require('../controllers/staff.controller');

// All routes require authentication
router.use(auth);

// Get default permissions (public for admin)
router.get('/permissions/default', staffController.getDefaultPermissions);

// Staff CRUD operations
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
