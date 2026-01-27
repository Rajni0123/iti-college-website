const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admissionProcessController = require('../controllers/admissionProcess.controller');

// Public route
router.get('/', admissionProcessController.getAdmissionProcess);

// Protected route
router.use(auth);
router.put('/', admissionProcessController.updateAdmissionProcess);

module.exports = router;
