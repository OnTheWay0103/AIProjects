import { storage } from './storage';
import { LoginData, RegisterData, AuthResponse } from '@/types/user';
import { GeneratedImage } from '@/types/image';

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
      const error = await response.json();
      throw new Error(error.message || '请求失败');
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

export async function generateImage(prompt: string): Promise<{ image: GeneratedImage }> {
  return fetchWithAuth<{ image: GeneratedImage }>(`${API_URL}/images/generate`, {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
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