const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/notice.controller');

router.get('/', noticeController.getNotices);
router.get('/:id', noticeController.getNotice);

module.exports = router;
