/**
 * 测试不同 API 服务的命令行工具
 * 使用方法：
 * node scripts/testAPI.js [service] [options]
 * 
 * 例如：
 * node scripts/testAPI.js huggingface --prompt "一只猫" --style "realistic"
 * node scripts/testAPI.js huggingface --prompt "一只猫" --style "realistic" --mock true
 */

require('dotenv').config(); // 加载环境变量

// 解析命令行参数
const args = process.argv.slice(2);
const service = args[0]?.toLowerCase();

// 解析选项
const options = {};
for (let i = 1; i < args.length; i += 2) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2);
    const value = args[i + 1];
    if (value === 'true') options[key] = true;
    else if (value === 'false') options[key] = false;
    else options[key] = value;
  }
}

// 如果启用了模拟模式，则使用假的 API 密钥
if (options.mock) {
  process.env.STABILITY_API_KEY = 'sk-mock-key-for-testing';
  
  // 模拟 stability-ai 包
  jest.mock('stability-ai', () => ({
    default: jest.fn().mockImplementation(() => ({
      v1: {
        generation: {
          textToImage: jest.fn().mockResolvedValue([
            {
              filepath: './mock-image.png', // 这个文件不需要真实存在，因为我们会模拟文件系统
              width: 1024,
              height: 1024,
              seed: 12345
            }
          ])
        }
      }
    }))
  }));
  
  // 模拟文件系统
  jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn().mockReturnValue(true),
    readFileSync: jest.fn().mockReturnValue(
      Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
    ),
    unlinkSync: jest.fn()
  }));
}

// 测试 huggingFaceService
async function testHuggingFaceService(options) {
  try {
    const huggingFaceService = require('../server/services/huggingFaceService');
    
    if (!process.env.STABILITY_API_KEY) {
      console.error('请设置 STABILITY_API_KEY 环境变量');
      process.exit(1);
    }
    
    const prompt = options.prompt || '一只可爱的小狗';
    const style = options.style || 'realistic photo';
    
    console.log(`使用提示词 "${prompt}" 和风格 "${style}" 生成图像...`);
    
    const startTime = Date.now();
    const result = await huggingFaceService.generateImage(prompt, style);
    const endTime = Date.now();
    
    console.log('图像生成成功!');
    console.log('耗时:', (endTime - startTime) / 1000, '秒');
    console.log('结果:', {
      success: result.success,
      hasImageUrl: !!result.imageUrl,
      imageUrlLength: result.imageUrl?.length,
      imageUrlPreview: result.imageUrl?.substring(0, 50) + '...'
    });
    
    return result;
  } catch (error) {
    console.error('图像生成失败:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
    throw error;
  }
}

// 主函数
async function main() {
  console.log('测试 API 服务:', service);
  console.log('选项:', options);
  console.log('模式:', options.mock ? '模拟模式' : '真实 API 模式');
  
  try {
    switch (service) {
      case 'huggingface':
      case 'stability':
        await testHuggingFaceService(options);
        break;
        
      default:
        console.error('未知服务:', service);
        console.error('可用服务: huggingface, stability');
        process.exit(1);
    }
    
    console.log('测试完成!');
  } catch (error) {
    console.error('测试失败!');
    process.exit(1);
  }
}

// 执行主函数
if (service) {
  main();
} else {
  console.error('请指定要测试的服务:');
  console.error('node scripts/testAPI.js [service] [options]');
  console.error('可用服务: huggingface, stability');
  console.error('选项:');
  console.error('  --prompt "提示词"     要生成的图像的提示词');
  console.error('  --style "风格"       图像的风格');
  console.error('  --mock true/false   是否使用模拟模式进行测试');
  process.exit(1);
} 