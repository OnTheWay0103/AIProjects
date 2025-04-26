const express = require('express');
const router = express.Router();
const { saveGeneration } = require('../services/fileStorageService');

// 保存图像
router.post('/', async (req, res) => {
    try {
        const { imageUrl, prompt, style } = req.body;
        
        if (!imageUrl || !prompt || !style) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数'
            });
        }

        const saved = await saveGeneration({
            prompt,
            style,
            imageUrl,
            ip: req.ip
        });

        res.json({
            success: true,
            data: saved
        });
    } catch (error) {
        console.error('保存失败:', error);
        res.status(500).json({
            success: false,
            error: '保存失败'
        });
    }
});

module.exports = router; 