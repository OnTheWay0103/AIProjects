import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth/useAuth';
import { register } from '@/lib/api/api';
import { RegisterData } from '@/types/user/index';
import { storage } from '@/lib/utils/storage';

export default function Register() {
  const router = useRouter();
  const { register: authRegister } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 页面加载时清除存储的信息
  useEffect(() => {
    console.log('Clearing stored data on register page load');
    storage.clear();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('Submitting registration form:', {
      name: formData.name,
      email: formData.email,
      password: '***'
    });

    try {
      // 确保所有字段都是字符串类型
      if (typeof formData.name !== 'string' || 
          typeof formData.email !== 'string' || 
          typeof formData.password !== 'string') {
        throw new Error('所有字段必须是字符串类型');
      }

      // 确保所有字段不为空
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        throw new Error('所有字段不能为空');
      }

      // 验证email格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('请输入有效的邮箱地址');
      }

      // 验证password格式
      if (formData.password.trim().length < 6) {
        throw new Error('密码长度不能少于6个字符');
      }

      await authRegister(
        formData.name.trim(),
        formData.email.trim(),
        formData.password.trim()
      );
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 验证输入值
    if (name === 'email') {
      // 检查是否是JWT token格式
      if (value.includes('eyJ') && value.includes('.')) {
        console.error('Invalid email format: appears to be a JWT token');
        setError('请输入有效的邮箱地址');
        return;
      }
    }
    
    if (name === 'password') {
      // 检查是否是JSON对象格式
      if (value.includes('{') && value.includes('}')) {
        console.error('Invalid password format: appears to be a JSON object');
        setError('请输入有效的密码');
        return;
      }
    }

    console.log('Form field changed:', { 
      name, 
      value: name === 'password' ? '***' : value 
    });
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Head>
        <title>注册 - Mikey.app</title>
        <meta name="description" content="创建新账户" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              创建新账户
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              或者{' '}
              <Link href="/login" className="text-primary hover:text-secondary">
                登录已有账户
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  用户名
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input rounded-t-md"
                  placeholder="用户名"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  邮箱地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input"
                  placeholder="邮箱地址"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input rounded-b-md"
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-error text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '注册'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 