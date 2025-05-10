/**
 * 模拟测试 Stability AI 服务
 * 使用方法：node scripts/testMockStability.js
 */

// 手动模拟 stability-ai
const stabilityMock = {
  default: function StabilityMock(apiKey) {
    console.log('初始化 Stability API 客户端 (模拟)，API 密钥:', apiKey);
    return {
      v1: {
        generation: {
          textToImage: async (modelId, prompts, options) => {
            console.log('调用 textToImage API (模拟)');
            console.log('- 模型 ID:', modelId);
            console.log('- 提示词:', prompts);
            console.log('- 选项:', options);
            
            // 返回模拟结果
            return [
              {
                filepath: './mock-image.png',
                width: options.width || 1024,
                height: options.height || 1024,
                seed: 12345
              }
            ];
          }
        }
      }
    };
  }
};

// 手动模拟文件系统
const fsMock = {
  existsSync: (path) => {
    console.log('检查文件是否存在 (模拟):', path);
    return true;
  },
  readFileSync: (path) => {
    console.log('读取文件 (模拟):', path);
    // 返回一个小的 PNG 图像的 base64 编码
    return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  },
  unlinkSync: (path) => {
    console.log('删除文件 (模拟):', path);
  }
};

// 模拟 path 模块
const pathMock = {
  extname: (filePath) => {
    return '.png';
  }
};

// 创建模拟服务
const createMockService = () => {
  // 设置模拟环境变量
  process.env.STABILITY_API_KEY = 'sk-mock-key-for-testing';
  
  // 创建模拟模块
  const mockRequire = (moduleName) => {
    if (moduleName === 'stability-ai') {
      return stabilityMock;
    } else if (moduleName === 'fs') {
      return fsMock;
    } else if (moduleName === 'path') {
      return pathMock;
    } else {
      return require(moduleName);
    }
  };
  
  // 创建模拟 huggingFaceService 模块
  const originalRequire = require;
  global.require = (moduleName) => {
    if (moduleName === 'stability-ai' || moduleName === 'fs' || moduleName === 'path') {
      return mockRequire(moduleName);
    } else {
      return originalRequire(moduleName);
    }
  };
  
  try {
    // 加载服务模块（会使用我们的模拟）
    const huggingFaceService = require('../server/services/huggingFaceService');
    return huggingFaceService;
  } finally {
    // 恢复原始 require
    global.require = originalRequire;
  }
};

// 测试生成图像
async function testGenerateImage() {
  console.log('开始模拟测试...');
  
  try {
    const service = createMockService();
    
    console.log('调用 generateImage...');
    const prompt = '一只可爱的猫';
    const style = 'watercolor painting';
    
    const startTime = Date.now();
    const result = await service.generateImage(prompt, style);
    const endTime = Date.now();
    
    console.log('图像生成成功! 耗时:', (endTime - startTime) / 1000, '秒');
    console.log('结果:', {
      success: result.success,
      hasImageUrl: !!result.imageUrl,
      imageUrlLength: result.imageUrl?.length,
      imageUrlPreview: result.imageUrl?.substring(0, 50) + '...'
    });
    
    console.log('测试完成!');
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
    process.exit(1);
  }
}

// 执行测试
testGenerateImage(); 