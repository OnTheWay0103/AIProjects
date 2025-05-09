import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router';
import { login as loginApi, register as registerApi } from '@/utils/api';
import { storage } from '@/utils/storage';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      const { token, user } = response;
      
      // 保存状态
      setUser(user);
      storage.setUser(user);
      storage.setToken(token);

      // 等待状态更新完成后再跳转
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await registerApi(name, email, password);
      const { token, user } = response;
      
      setUser(user);
      storage.setUser(user);
      storage.setToken(token);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    storage.clear();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 