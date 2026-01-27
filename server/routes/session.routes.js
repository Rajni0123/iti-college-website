const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const auth = require('../middleware/auth');

// Public routes (MUST come first, before protected routes)
router.get('/active', sessionController.getActiveSessions);

// Admin routes
router.get('/', auth, sessionController.getAllSessions);
router.post('/', auth, sessionController.createSession);
router.put('/:id', auth, sessionController.updateSession);
router.delete('/:id', auth, sessionController.deleteSession);

module.exports = router;
