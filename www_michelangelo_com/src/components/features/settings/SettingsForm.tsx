import React, { useState, useEffect } from 'react';

interface SettingsFormProps {
  settings: {
    username: string;
    email: string;
    theme: string;
    language: string;
  };
  onSave: (settings: any) => void;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  error?: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
}

export default function SettingsForm({
  settings,
  onSave,
  isSubmitting = false,
  isSuccess = false,
  error = ''
}: SettingsFormProps) {
  const [formData, setFormData] = useState(settings);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: ValidationErrors = {};

    if (!formData.username.trim()) {
      errors.username = '用户名不能为空';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = '邮箱不能为空';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除对应字段的验证错误
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-text-primary">
          用户名
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          data-testid="username-input"
        />
        {validationErrors.username && (
          <p className="mt-1 text-sm text-error" role="alert" data-testid="username-error">
            {validationErrors.username}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary">
          邮箱
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          data-testid="email-input"
        />
        {validationErrors.email && (
          <p className="mt-1 text-sm text-error" role="alert" data-testid="email-error">
            {validationErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-text-primary">
          主题
        </label>
        <select
          id="theme"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="light">浅色</option>
          <option value="dark">深色</option>
          <option value="system">跟随系统</option>
        </select>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-text-primary">
          语言
        </label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>

      {error && (
        <div className="text-error text-sm" role="alert" data-testid="error-message">
          {error}
        </div>
      )}

      {isSuccess && !error && (
        <div className="text-success text-sm" role="alert" data-testid="success-message">
          设置已保存
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        data-testid="save-button"
      >
        {isSubmitting ? '保存中...' : '保存设置'}
      </button>
    </form>
  );
} 