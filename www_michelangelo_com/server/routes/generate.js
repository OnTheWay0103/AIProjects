const express = require('express');
const router = express.Router();
const { generate } = require('../controllers/generateController');
const { validateGenerateRequest } = require('../middleware/validateRequest');

// 生成图像路由
router.post('/', validateGenerateRequest, generate);

module.exports = router; 