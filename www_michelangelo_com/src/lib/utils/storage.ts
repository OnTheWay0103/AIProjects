import { User } from '@/types/user/index';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const storage = {
  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  clearUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}; 