const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/', facultyController.getAllFaculty);
router.get('/principal', facultyController.getPrincipal);
router.get('/department/:department', facultyController.getFacultyByDepartment);

// Protected routes (admin only)
router.get('/admin/all', auth, facultyController.getAllFacultyAdmin);
router.get('/:id', facultyController.getFacultyById);
router.post('/', auth, facultyController.createFaculty);
router.put('/:id', auth, facultyController.updateFaculty);
router.delete('/:id', auth, facultyController.deleteFaculty);

module.exports = router;
