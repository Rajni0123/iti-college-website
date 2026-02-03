const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminController = require('../controllers/admin.controller');
const settingsController = require('../controllers/settings.controller');

// Multi-file upload for admissions (photo, aadhaar, marksheets, certificates)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) { fs.mkdirSync(uploadsDir, { recursive: true }); }
const admissionUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.use(auth);

// Dashboard
router.get('/stats', adminController.getDashboardStats);

// Notices
router.post('/notices', upload.single('pdf'), adminController.createNotice);
router.put('/notices/:id', upload.single('pdf'), adminController.updateNotice);
router.delete('/notices/:id', adminController.deleteNotice);

// Results
router.post('/results', upload.single('pdf'), adminController.createResult);
router.delete('/results/:id', adminController.deleteResult);

// Gallery
router.post('/gallery', upload.single('image'), adminController.uploadGalleryImage);
router.delete('/gallery/:id', adminController.deleteGalleryImage);

// Admissions
router.get('/admissions', adminController.getAdmissions);
router.post('/admissions/manual', admissionUpload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'marksheet_10th', maxCount: 1 },
  { name: 'marksheet_12th', maxCount: 1 },
  { name: 'caste_certificate', maxCount: 1 },
  { name: 'income_certificate', maxCount: 1 },
  { name: 'student_credit_card_doc', maxCount: 1 },
]), adminController.createManualAdmission);
router.put('/admissions/:id/status', adminController.updateAdmissionStatus);
router.put('/admissions/:id', adminController.updateAdmission);
router.get('/admissions/documents/:filename', adminController.downloadDocument);

// Site Settings
router.get('/settings', settingsController.getAllSettings);
router.put('/settings', settingsController.updateMultipleSettings);
router.put('/settings/:key', settingsController.updateSetting);

module.exports = router;
