const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const feeController = require('../controllers/fee.controller');

// Protected routes
router.use(auth);

// Fee summary/statistics
router.get('/summary', feeController.getFeeSummary);

// Recent payments (last 7 days) - must be before /:id route
router.get('/recent-payments', feeController.getRecentPayments);

// Student search for autocomplete - must be before /:id route
router.get('/search-students', feeController.searchStudents);

// Student fee balance
router.get('/student-balance/:admission_id', feeController.getStudentFeeBalance);

// Main fee CRUD
router.get('/', feeController.getFees);
router.get('/:id', feeController.getFeeById);
router.post('/', feeController.createFee);
router.put('/:id', feeController.updateFee);
router.delete('/:id', feeController.deleteFee);

// Payment routes
router.post('/:id/pay', feeController.payFee);

// Installment routes
router.get('/:id/installments', feeController.getInstallments);
router.post('/:id/installments/:installmentId/pay', feeController.payInstallment);

module.exports = router;
