const Stability = require('stability-ai').default;
const fs = require('fs');
const path = require('path');

// 调试环境变量
console.log('huggingFaceService 环境变量:', {
    STABILITY_API_KEY: process.env.STABILITY_API_KEY ? '已设置' : '未设置',
    NODE_ENV: process.env.NODE_ENV
});

if (!process.env.STABILITY_API_KEY) {
    console.error('错误: STABILITY_API_KEY 环境变量未设置');
    throw new Error('服务器配置错误: 缺少 Stability AI API Key');
}

// 初始化 Stability AI API 客户端
const stability = new Stability(process.env.STABILITY_API_KEY);

// 使用 Stable Diffusion XL 模型
const MODEL_ID = 'stable-diffusion-xl-1024-v1-0';

// 最大重试次数
const MAX_RETRIES = 3;
// 重试延迟（毫秒）
const RETRY_DELAY = 1000;

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateImage(prompt, style, retryCount = 0) {
    try {
        console.log('开始调用 Stability AI API...', {
            prompt,
            style,
            model: MODEL_ID,
            attempt: retryCount + 1
        });
        
        // 使用官方SDK的textToImage方法
        const results = await stability.v1.generation.textToImage(
            MODEL_ID,
            [
                { text: `${prompt}, ${style}`, weight: 1.0 }
            ],
            {
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 30,
                cfg_scale: 7,
            }
        );

        console.log('API 响应:', {
            hasResults: !!results,
            resultCount: results?.length,
            firstResult: results?.[0] ? Object.keys(results[0]) : '无结果'
        });

        if (!results || !results.length) {
            console.error('无效的 API 响应:', results);
            throw new Error('API 返回数据格式不正确');
        }

        // 详细记录第一个结果的信息，帮助调试
        const firstResult = results[0];
        console.log('第一个结果详情:', {
            hasFilepath: !!firstResult.filepath,
            filepath: firstResult.filepath,
            fileExists: firstResult.filepath && fs.existsSync(firstResult.filepath)
        });

        // 获取生成的图像文件路径，转换为base64
        const imagePath = firstResult.filepath;
        
        if (!imagePath || !fs.existsSync(imagePath)) {
            console.error('无法找到生成的图像文件:', imagePath);
            throw new Error('无法找到生成的图像文件');
        }
        
        // 使用文件系统读取图像文件
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        // 确定图像的 MIME 类型
        const mimeType = determineMimeType(imagePath);
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        console.log('Stability AI API 调用成功');

        // 清理临时文件
        try {
            fs.unlinkSync(imagePath);
            console.log('已删除临时图像文件:', imagePath);
        } catch (err) {
            console.warn('删除临时图像文件失败:', err.message);
        }

        return {
            success: true,
            imageUrl
        };
    } catch (error) {
        console.error('Stability AI API 错误详情:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
            name: error.name,
            code: error.code,
            attempt: retryCount + 1
        });

        // 检查是否应该重试
        const shouldRetry = retryCount < MAX_RETRIES && (
            error.message.includes('rate limit') ||
            error.message.includes('unavailable') ||
            error.message.includes('timeout') ||
            error.message.includes('network')
        );

        if (shouldRetry) {
            console.log(`尝试重试 (${retryCount + 1}/${MAX_RETRIES})...`);
            await delay(RETRY_DELAY * (retryCount + 1));
            return generateImage(prompt, style, retryCount + 1);
        }

        // 根据错误类型返回不同的错误信息
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
            throw new Error('API 认证失败，请检查 API Key');
        } else if (error.message.includes('429') || error.message.includes('rate limit')) {
            throw new Error('API 调用次数超限，请稍后再试');
        } else if (error.message.includes('503') || error.message.includes('unavailable')) {
            throw new Error('API 服务暂时不可用，请稍后再试');
        } else {
            throw new Error(`图像生成失败: ${error.message}`);
        }
    }
}

// 根据文件扩展名确定 MIME 类型
function determineMimeType(filepath) {
    const ext = path.extname(filepath).toLowerCase();
    switch (ext) {
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.webp':
            return 'image/webp';
        default:
            return 'image/png'; // 默认为 PNG
    }
}

module.exports = {
    generateImage
}; 