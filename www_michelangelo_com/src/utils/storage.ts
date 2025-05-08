import { User } from '@/types/user';

const TOKEN_COOKIE_NAME = 'token';

export const storage = {
  getToken: () => {
    if (typeof window === 'undefined') return null;
    // 优先从cookie中获取token
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${TOKEN_COOKIE_NAME}=`));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    // 如果cookie中没有，则从localStorage获取
    return localStorage.getItem('token');
  },

  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    // 同时存储到cookie和localStorage
    document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=604800`; // 7天过期
    localStorage.setItem('token', token);
  },

  removeToken: () => {
    if (typeof window === 'undefined') return;
    // 同时从cookie和localStorage中删除
    document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
    localStorage.removeItem('token');
  },

  getUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) as User : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    // 清除所有存储
    document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
}; 