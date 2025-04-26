const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGING_FACE_API_TOKEN);

// 使用 Stable Diffusion 模型
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

async function generateImage(prompt, style) {
    try {
        console.log('开始调用 Hugging Face API...');
        console.log('API Token:', process.env.HUGGING_FACE_API_TOKEN ? '已设置' : '未设置');
        
        const response = await hf.textToImage({
            model: MODEL,
            inputs: `${prompt}, ${style}`,
            parameters: {
                width: 512,
                height: 512,
                num_inference_steps: 50,
                guidance_scale: 7.5,
            }
        });

        // 将 Blob 转换为 base64
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const imageUrl = `data:image/png;base64,${base64}`;

        console.log('Hugging Face API 调用成功');

        return {
            success: true,
            imageUrl
        };
    } catch (error) {
        console.error('Hugging Face API 错误详情:', {
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