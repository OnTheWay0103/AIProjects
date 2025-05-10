const { generateImage, getImages, getPublicImages, shareImage, unshareImage, deleteImage } = require('../src/lib/api/api');
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// 模拟 axios
jest.mock('axios');

// 模拟 fetch
global.fetch = jest.fn();

describe('API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateImage', () => {
    test('成功生成图片', async () => {
      const mockResponse = {
        image: {
          url: 'https://example.com/image.jpg'
        }
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await generateImage('一只可爱的猫咪');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: '一只可爱的猫咪', style: 'realistic' })
      });
    });

    test('生成失败时抛出错误', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockImplementation(name => {
            if (name === 'content-type') return 'application/json';
            return null;
          })
        },
        json: () => Promise.resolve({ message: '请求失败' })
      });

      await expect(generateImage('一只可爱的猫咪')).rejects.toThrow('请求失败');
    });
  });

  describe('getImages', () => {
    test('成功获取图片列表', async () => {
      const mockImages = {
        images: [
          {
            id: '1',
            imageUrl: 'https://example.com/image1.jpg',
            prompt: '一只可爱的猫咪',
            createdAt: new Date().toISOString(),
            isPublic: false
          }
        ]
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockImages)
      });

      const result = await getImages();
      expect(result).toEqual(mockImages);
      expect(global.fetch).toHaveBeenCalledWith('/api/images', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    test('获取失败时抛出错误', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockImplementation(name => {
            if (name === 'content-type') return 'application/json';
            return null;
          })
        },
        json: () => Promise.resolve({ message: '请求失败' })
      });

      await expect(getImages()).rejects.toThrow('请求失败');
    });
  });

  describe('getPublicImages', () => {
    test('成功获取公开图片列表', async () => {
      const mockImages = {
        images: [
          {
            id: '1',
            imageUrl: 'https://example.com/image1.jpg',
            prompt: '一只可爱的猫咪',
            createdAt: new Date().toISOString(),
            isPublic: true
          }
        ]
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockImages)
      });

      const result = await getPublicImages();
      expect(result).toEqual(mockImages);
      expect(global.fetch).toHaveBeenCalledWith('/api/images/public');
    });

    test('获取失败时抛出错误', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockImplementation(name => {
            if (name === 'content-type') return 'application/json';
            return null;
          })
        },
        json: () => Promise.resolve({ message: 'Failed to fetch public images' })
      });

      await expect(getPublicImages()).rejects.toThrow('Failed to fetch public images');
    });
  });

  describe('shareImage', () => {
    test('成功分享图片', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      await shareImage('1');
      expect(global.fetch).toHaveBeenCalledWith('/api/images/1/share', {
        method: 'POST'
      });
    });

    test('分享失败时抛出错误', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockImplementation(name => {
            if (name === 'content-type') return 'application/json';
            return null;
          })
        },
        json: () => Promise.resolve({ message: 'Failed to share image' })
      });

      await expect(shareImage('1')).rejects.toThrow('Failed to share image');
    });
  });

  describe('unshareImage', () => {
    test('成功取消分享图片', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      await unshareImage('1');
      expect(global.fetch).toHaveBeenCalledWith('/api/images/1/share', {
        method: 'DELETE'
      });
    });

    test('取消分享失败时抛出错误', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockImplementation(name => {
            if (name === 'content-type') return 'application/json';
            return null;
          })
        },
        json: () => Promise.resolve({ message: 'Failed to unshare image' })
      });

      await expect(unshareImage('1')).rejects.toThrow('Failed to unshare image');
    });
  });

  describe('deleteImage', () => {
    test('成功删除图片', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      await deleteImage('1');
      expect(global.fetch).toHaveBeenCalledWith('/api/images/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    test('删除失败时抛出错误', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        headers: {
          get: jest.fn().mockImplementation(name => {
            if (name === 'content-type') return 'application/json';
            return null;
          })
        },
        json: () => Promise.resolve({ message: '请求失败' })
      });

      await expect(deleteImage('1')).rejects.toThrow('请求失败');
    });
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