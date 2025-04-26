const axios = require('axios');

const STABLE_DIFFUSION_API_URL = process.env.STABLE_DIFFUSION_API_URL;
const STABLE_DIFFUSION_API_KEY = process.env.STABLE_DIFFUSION_API_KEY;

const generateWithStableDiffusion = async (params) => {
    try {
        const response = await axios.post(STABLE_DIFFUSION_API_URL, {
            prompt: params.prompt,
            negative_prompt: params.negative_prompt,
            width: params.width,
            height: params.height,
            steps: params.steps,
            cfg_scale: 7.5,
            sampler_name: "DPM++ 2M Karras",
            seed: -1
        }, {
            headers: {
                'Authorization': `Bearer ${STABLE_DIFFUSION_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.images || !response.data.images[0]) {
            throw new Error('生成失败');
        }

        // 返回生成的图像 URL
        return response.data.images[0];

    } catch (error) {
        console.error('Stable Diffusion API 调用失败:', error);
        throw new Error('图像生成服务暂时不可用');
    }
};

module.exports = { generateWithStableDiffusion }; 