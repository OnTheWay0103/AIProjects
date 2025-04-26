const { generateImage } = require('../services/huggingFaceService');
const { saveGeneration } = require('../services/fileStorageService');

// 简单的内存缓存用于速率限制
const rateLimitCache = new Map();
const DAILY_LIMIT = 10;

// 检查速率限制
function checkRateLimit(ip) {
    const today = new Date().toISOString().split('T')[0];
    const key = `${ip}:${today}`;
    
    const count = rateLimitCache.get(key) || 0;
    if (count >= DAILY_LIMIT) {
        return false;
    }
    
    rateLimitCache.set(key, count + 1);
    return true;
}

async function generate(req, res) {
    try {
        const { prompt, style } = req.body;
        
        if (!prompt || !style) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数'
            });
        }

        // 检查速率限制
        if (!checkRateLimit(req.ip)) {
            return res.status(429).json({
                success: false,
                error: '已达到今日生成次数限制'
            });
        }

        // 生成图像
        const result = await generateImage(prompt, style);
        
        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

        // 保存生成记录
        const saved = await saveGeneration({
            prompt,
            style,
            imageUrl: result.imageUrl,
            ip: req.ip
        });

        res.json({
            success: true,
            data: {
                imageUrl: result.imageUrl,
                id: saved.id
            }
        });
    } catch (error) {
        console.error('生成失败:', error);
        res.status(500).json({
            success: false,
            error: error.message || '生成失败'
        });
    }
}

module.exports = {
    generate
}; 