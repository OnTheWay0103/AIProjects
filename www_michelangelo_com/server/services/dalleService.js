const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

const stylePrompts = {
    'anime': 'anime style, vibrant colors, detailed character design',
    'watercolor': 'watercolor painting style, soft colors, artistic brush strokes'
};

const generateWithDalle = async (params) => {
    try {
        // 构建提示词
        const stylePrompt = stylePrompts[params.style] || '';
        const fullPrompt = `${params.prompt}, ${stylePrompt}`;

        const response = await axios.post(OPENAI_API_URL, {
            prompt: fullPrompt,
            n: 1,
            size: `${params.width}x${params.height}`,
            response_format: 'url'
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.data || !response.data.data[0]) {
            throw new Error('生成失败');
        }

        // 返回生成的图像 URL
        return response.data.data[0].url;

    } catch (error) {
        console.error('DALL-E API 调用失败:', error);
        throw new Error('图像生成服务暂时不可用');
    }
};

module.exports = { generateWithDalle }; 