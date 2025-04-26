const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testGenerateAPI() {
    try {
        console.log('测试生成图像 API...');
        
        const response = await axios.post(`${API_BASE_URL}/generate`, {
            prompt: '一只可爱的猫咪',
            style: 'anime'
        });

        console.log('生成成功:', response.data);
        return response.data.data.imageUrl;
    } catch (error) {
        console.error('生成失败:', error.response?.data || error.message);
        return null;
    }
}

async function testSaveAPI(imageUrl) {
    if (!imageUrl) return;

    try {
        console.log('测试保存图像 API...');
        
        const response = await axios.post(`${API_BASE_URL}/save`, {
            imageUrl,
            prompt: '测试保存',
            style: 'anime'
        });

        console.log('保存成功:', response.data);
    } catch (error) {
        console.error('保存失败:', error.response?.data || error.message);
    }
}

async function testGalleryAPI() {
    try {
        console.log('测试画廊 API...');
        
        const response = await axios.get(`${API_BASE_URL}/gallery`);
        console.log('获取画廊成功:', response.data);
    } catch (error) {
        console.error('获取画廊失败:', error.response?.data || error.message);
    }
}

async function main() {
    console.log('开始测试 API...');
    await testGenerateAPI();
    await testGalleryAPI();
    console.log('测试完成');
}

main(); 