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
        
        console.log('收到生成请求:', {
            prompt,
            style,
            ip: req.ip,
            headers: req.headers
        });

        if (!prompt || !style) {
            console.error('缺少必要参数:', { prompt, style });
            return res.status(400).json({
                success: false,
                error: '缺少必要参数'
            });
        }

        // 检查速率限制
        if (!checkRateLimit(req.ip)) {
            console.error('达到速率限制:', { ip: req.ip });
            return res.status(429).json({
                success: false,
                error: '已达到今日生成次数限制'
            });
        }

        console.log('开始生成图像:', {
            prompt,
            style,
            ip: req.ip
        });

        // 生成图像
        const result = await generateImage(prompt, style);
        
        if (!result.success) {
            console.error('生成失败:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error || '生成失败'
            });
        }

        // 保存生成记录
        const saved = await saveGeneration({
            prompt,
            style,
            imageUrl: result.imageUrl,
            ip: req.ip
        });

        console.log('图像生成成功:', {
            id: saved.id,
            prompt,
            style
        });

        res.json({
            success: true,
            image: {
                url: result.imageUrl,
                id: saved.id
            }
        });
    } catch (error) {
        console.error('生成失败:', {
            error: error.message,
            stack: error.stack,
            body: req.body,
            headers: req.headers
        });

        // 根据错误类型返回不同的状态码
        const statusCode = error.message.includes('API 认证失败') ? 401 :
                         error.message.includes('API 调用次数超限') ? 429 :
                         error.message.includes('API 服务暂时不可用') ? 503 : 500;

        res.status(statusCode).json({
            success: false,
            error: error.message || '生成失败'
        });
    }
}

module.exports = {
    generate
}; 