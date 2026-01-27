const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const studentController = require('../controllers/student.controller');

// All routes require authentication
router.use(auth);

// Student CRUD operations
router.get('/', studentController.getAllStudents);
router.get('/high-dues', studentController.getStudentsWithHighDues);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
