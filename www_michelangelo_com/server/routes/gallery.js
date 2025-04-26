const express = require('express');
const router = express.Router();
const { getGallery } = require('../controllers/galleryController');

// 获取画廊数据
router.get('/', getGallery);

module.exports = router; 