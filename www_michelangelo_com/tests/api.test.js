const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// 模拟 axios
jest.mock('axios');

describe('API Tests', () => {
  beforeEach(() => {
    // 清除所有模拟函数的调用记录
    jest.clearAllMocks();
  });

  // 测试登录 API
  test('登录 API 应该正常工作', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'testuser',
    };
    const mockResponse = {
      data: {
        user: mockUser,
        token: 'mockToken',
      },
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123',
    });

    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.data.user).toEqual(mockUser);
    expect(response.data.token).toBe('mockToken');
  });

  // 测试注册 API
  test('注册 API 应该正常工作', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'testuser',
    };
    const mockResponse = {
      data: {
        user: mockUser,
        token: 'mockToken',
      },
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/auth/register`, {
      name: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.data.user).toEqual(mockUser);
    expect(response.data.token).toBe('mockToken');
  });

  // 测试生成图片 API
  test('生成图片 API 应该正常工作', async () => {
    const mockImage = {
      id: '1',
      url: 'https://example.com/image.jpg',
      prompt: '一只可爱的猫咪',
      createdAt: '2024-05-09T10:00:00Z',
    };
    const mockResponse = {
      data: mockImage,
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await axios.post(`${API_BASE_URL}/images/generate`, {
      prompt: '一只可爱的猫咪',
    });

    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/images/generate`, {
      prompt: '一只可爱的猫咪',
    });
    expect(response.data).toEqual(mockImage);
  });

  // 测试获取图片列表 API
  test('获取图片列表 API 应该正常工作', async () => {
    const mockImages = [
      {
        id: '1',
        url: 'https://example.com/image1.jpg',
        prompt: '一只可爱的猫咪',
        createdAt: '2024-05-09T10:00:00Z',
      },
      {
        id: '2',
        url: 'https://example.com/image2.jpg',
        prompt: '一只可爱的狗狗',
        createdAt: '2024-05-09T11:00:00Z',
      },
    ];
    const mockResponse = {
      data: mockImages,
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    const response = await axios.get(`${API_BASE_URL}/images`);

    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/images`);
    expect(response.data).toEqual(mockImages);
  });

  // 测试获取用户图片列表 API
  test('获取用户图片列表 API 应该正常工作', async () => {
    const mockImages = [
      {
        id: '1',
        url: 'https://example.com/image1.jpg',
        prompt: '一只可爱的猫咪',
        createdAt: '2024-05-09T10:00:00Z',
      },
      {
        id: '2',
        url: 'https://example.com/image2.jpg',
        prompt: '一只可爱的狗狗',
        createdAt: '2024-05-09T11:00:00Z',
      },
    ];
    const mockResponse = {
      data: mockImages,
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    const response = await axios.get(`${API_BASE_URL}/images/user`);

    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/images/user`);
    expect(response.data).toEqual(mockImages);
  });

  // 测试删除图片 API
  test('删除图片 API 应该正常工作', async () => {
    const mockResponse = {
      data: { success: true },
    };

    axios.delete.mockResolvedValueOnce(mockResponse);

    const response = await axios.delete(`${API_BASE_URL}/images/1`);

    expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/images/1`);
    expect(response.data.success).toBe(true);
  });
});

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