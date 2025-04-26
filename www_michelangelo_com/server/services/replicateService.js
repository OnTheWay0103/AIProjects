const Replicate = require('replicate');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// 使用基础版 Stable Diffusion 模型
const MODEL = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";

async function generateImage(prompt, style) {
    try {
        console.log('开始调用 Replicate API...');
        console.log('API Token:', process.env.REPLICATE_API_TOKEN ? '已设置' : '未设置');
        
        const output = await replicate.run(
            MODEL,
            {
                input: {
                    prompt: `${prompt}, ${style}`,
                    width: 512,
                    height: 512,
                    num_outputs: 1,
                    scheduler: "K_EULER",
                    num_inference_steps: 50,
                    guidance_scale: 7.5,
                    prompt_strength: 0.8,
                }
            }
        );

        console.log('Replicate API 响应:', output);

        if (!output || !output[0]) {
            throw new Error('生成失败：未获取到有效输出');
        }

        return {
            success: true,
            imageUrl: output[0]
        };
    } catch (error) {
        console.error('Replicate API 错误详情:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        throw new Error('图像生成服务暂时不可用');
    }
}

module.exports = {
    generateImage
}; 