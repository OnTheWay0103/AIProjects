const fs = require('fs');
const path = require('path');

// 修改模拟方式，使用 mockImplementation 而不是在 jest.mock 中定义行为
jest.mock('stability-ai', () => ({
  default: jest.fn()
}));

// 清理环境变量
const originalEnv = process.env;

describe('huggingFaceService', () => {
  let tempDir;
  let testImagePath;
  let Stability;
  let mockTextToImage;

  beforeEach(() => {
    // 设置测试环境
    jest.resetModules();
    process.env = { ...originalEnv, STABILITY_API_KEY: 'test-api-key' };

    // 创建临时测试图像文件
    tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    testImagePath = path.join(tempDir, 'test-image.png');
    
    // 写入一个最小的有效PNG（1x1像素）
    const minimalPNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testImagePath, minimalPNG);

    // 设置模拟行为
    Stability = require('stability-ai').default;
    mockTextToImage = jest.fn().mockResolvedValue([
      {
        filepath: testImagePath,
        width: 1024,
        height: 1024,
        seed: 12345
      }
    ]);

    Stability.mockImplementation(() => ({
      v1: {
        generation: {
          textToImage: mockTextToImage
        }
      }
    }));
  });

  afterEach(() => {
    // 清理测试环境
    process.env = originalEnv;
    // 清理临时文件
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('应该加载并初始化服务', () => {
    const service = require('../server/services/huggingFaceService');
    expect(service).toBeDefined();
    expect(service.generateImage).toBeInstanceOf(Function);
  });

  it('应该调用API并处理结果', async () => {
    const service = require('../server/services/huggingFaceService');
    
    const result = await service.generateImage('测试提示词', '现实风格');
    
    // 检查是否调用了API
    expect(Stability).toHaveBeenCalledWith('test-api-key');
    expect(mockTextToImage).toHaveBeenCalledWith(
      'stable-diffusion-xl-1024-v1-0',
      [{ text: '测试提示词, 现实风格', weight: 1.0 }],
      {
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
        cfg_scale: 7,
      }
    );
    
    // 检查结果格式
    expect(result).toEqual({
      success: true,
      imageUrl: expect.stringMatching(/^data:image\/png;base64,/)
    });
  });

  it('当API密钥未设置时应该抛出错误', () => {
    // 删除API密钥
    delete process.env.STABILITY_API_KEY;
    
    // 尝试导入服务应该抛出错误
    expect(() => {
      require('../server/services/huggingFaceService');
    }).toThrow('服务器配置错误: 缺少 Stability AI API Key');
  });

  it('当API请求失败时应该处理错误', async () => {
    // 模拟API调用失败
    mockTextToImage.mockRejectedValueOnce(
      new Error('API调用失败')
    );
    
    const service = require('../server/services/huggingFaceService');
    
    // 调用服务应该正确处理错误
    await expect(service.generateImage('测试提示词', '现实风格')).rejects.toThrow('图像生成失败: API调用失败');
  });
}); 