/**
 * 测试 huggingFaceService 的加载和基本功能
 * 使用方法：
 * 1. 设置 STABILITY_API_KEY 环境变量
 * 2. 执行 node scripts/testHuggingFaceService.js
 */

require('dotenv').config(); // 加载环境变量

const huggingFaceService = require('../server/services/huggingFaceService');

async function testService() {
  console.log('开始测试 huggingFaceService...');

  try {
    if (!process.env.STABILITY_API_KEY) {
      console.error('请设置 STABILITY_API_KEY 环境变量');
      process.exit(1);
    }

    console.log('准备生成图像...');
    const result = await huggingFaceService.generateImage('一只可爱的小狗', 'realistic photo');

    console.log('图像生成结果:', {
      success: result.success,
      hasImageUrl: !!result.imageUrl,
      imageUrlLength: result.imageUrl?.length,
      imageUrlPreview: result.imageUrl?.substring(0, 50) + '...'
    });

    console.log('测试完成!');
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

// 执行测试
testService(); 