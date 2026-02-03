const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const staffController = require('../controllers/staff.controller');
const salaryController = require('../controllers/salary.controller');

// All routes require authentication
router.use(auth);

// Get default permissions (public for admin)
router.get('/permissions/default', staffController.getDefaultPermissions);

// Staff Salary routes (must be before /:id to avoid conflict)
router.get('/salaries', salaryController.getStaffSalaries);
router.post('/salaries', salaryController.createStaffSalary);
router.get('/salaries/:id', salaryController.getStaffSalaryById);
router.put('/salaries/:id', salaryController.updateStaffSalary);
router.delete('/salaries/:id', salaryController.deleteStaffSalary);

// Staff payslips by staff member
router.get('/:staffId/payslips', salaryController.getStaffPayslips);

// Staff CRUD operations
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
