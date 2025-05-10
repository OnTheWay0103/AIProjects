import { storage } from '../utils/storage';
import { LoginData, RegisterData, AuthResponse } from '@/types/user/index';
import { GeneratedImage, GenerateImageResponse } from '@/types/image/index';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

const API_URL = '/api';

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = storage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = '请求失败';
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.error('解析错误响应失败:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络请求失败');
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    // 验证输入
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('邮箱和密码必须是字符串类型');
    }

    if (!email.trim() || !password.trim()) {
      throw new Error('邮箱和密码不能为空');
    }

    // 验证email格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('请输入有效的邮箱地址');
    }

    // 验证password格式
    if (password.trim().length < 6) {
      throw new Error('密码长度不能少于6个字符');
    }

    // 检查是否是JWT token
    if (email.includes('eyJ') && email.includes('.')) {
      throw new Error('请输入有效的邮箱地址，而不是token');
    }

    // 检查是否是JSON对象
    if (password.includes('{') && password.includes('}')) {
      throw new Error('请输入有效的密码，而不是JSON对象');
    }

    console.log('Sending login request:', { email: email.trim(), password: '***' });
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Login failed:', data);
      throw new Error(data.error || '登录失败');
    }

    // 验证返回的数据格式
    if (!data.user || !data.token) {
      console.error('Invalid response format:', data);
      throw new Error('服务器返回的数据格式不正确');
    }

    console.log('Login successful:', { user: data.user, token: '***' });
    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('登录失败');
  }
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    // 验证输入
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      console.error('Invalid input types:', { 
        name: typeof name, 
        email: typeof email, 
        password: typeof password 
      });
      throw new Error('所有字段必须是字符串类型');
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      throw new Error('所有字段不能为空');
    }

    // 验证email格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('请输入有效的邮箱地址');
    }

    // 验证password格式
    if (password.trim().length < 6) {
      throw new Error('密码长度不能少于6个字符');
    }

    // 检查是否是JWT token
    if (email.includes('eyJ') && email.includes('.')) {
      throw new Error('请输入有效的邮箱地址，而不是token');
    }

    // 检查是否是JSON对象
    if (password.includes('{') && password.includes('}')) {
      throw new Error('请输入有效的密码，而不是JSON对象');
    }

    console.log('Sending registration request:', { 
      name: name.trim(), 
      email: email.trim(), 
      password: '***' 
    });

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password: password.trim()
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Registration failed:', data);
      throw new Error(data.error || '注册失败');
    }

    // 验证返回的数据格式
    if (!data.user || !data.token) {
      console.error('Invalid response format:', data);
      throw new Error('服务器返回的数据格式不正确');
    }

    console.log('Registration successful:', { user: data.user, token: '***' });
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('注册失败');
  }
}

export async function getImages(): Promise<{ images: GeneratedImage[] }> {
  return fetchWithAuth<{ images: GeneratedImage[] }>(`${API_URL}/images`);
}

export async function getPublicImages(): Promise<{ images: GeneratedImage[] }> {
  const response = await fetch(`${API_URL}/images/public`);
  if (!response.ok) {
    throw new Error('Failed to fetch public images');
  }
  return response.json();
}

export async function generateImage(prompt: string, style: string = 'realistic', aspect: string = 'square'): Promise<GenerateImageResponse> {
  try {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('提示词不能为空');
    }

    console.log('开始生成图像:', { prompt, style, aspect });
    
    // 开发环境模拟生成图像
    if (process.env.NODE_ENV === 'development' || true) { // 强制使用模拟数据，实际中可以根据环境变量决定
      console.log('使用模拟生成服务');
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根据提示词生成一个稳定的哈希值，用于生成一致的随机图像
      const hash = Array.from(prompt).reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      // 根据不同的风格选择不同的图像服务
      let imageUrl = '';
      const seed = hash % 1000;
      const width = aspect === 'landscape' || aspect === 'widescreen' ? 800 : 600;
      const height = aspect === 'portrait' ? 800 : aspect === 'square' ? width : 450;
      
      switch (style) {
        case 'anime':
          imageUrl = `https://picsum.photos/seed/anime${seed}/${width}/${height}`;
          break;
        case 'oil':
          imageUrl = `https://picsum.photos/seed/oil${seed}/${width}/${height}`;
          break;
        case 'watercolor':
          imageUrl = `https://picsum.photos/seed/water${seed}/${width}/${height}`;
          break;
        case 'sketch':
          imageUrl = `https://picsum.photos/seed/sketch${seed}/${width}/${height}`;
          break;
        case 'digital':
          imageUrl = `https://picsum.photos/seed/digital${seed}/${width}/${height}`;
          break;
        default:
          imageUrl = `https://picsum.photos/seed/real${seed}/${width}/${height}`;
      }
      
      return {
        image: {
          url: imageUrl
        }
      };
    }
    
    // 真实环境调用后端API
    const response = await fetchWithAuth<GenerateImageResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, style, aspect }),
    });

    console.log('生成图像响应:', response);

    if (!response || !response.image || !response.image.url) {
      console.error('无效的响应格式:', response);
      throw new Error('生成图像失败：服务器返回数据格式不正确');
    }

    return response;
  } catch (error) {
    console.error('生成图像失败:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('生成图像失败');
  }
}

export async function saveImage(data: {
  prompt: string;
  imageUrl: string;
}): Promise<{ id: string }> {
  return fetchWithAuth<{ id: string }>(`${API_URL}/images`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteImage(imageId: string): Promise<void> {
  return fetchWithAuth<void>(`${API_URL}/images/${imageId}`, {
    method: 'DELETE',
  });
}

export async function shareImage(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/images/${id}/share`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to share image');
  }
}

export async function unshareImage(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/images/${id}/share`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to unshare image');
  }
}

export async function getImage(id: string): Promise<{ image: GeneratedImage }> {
  return fetchWithAuth<{ image: GeneratedImage }>(`${API_URL}/images/${id}`);
} 