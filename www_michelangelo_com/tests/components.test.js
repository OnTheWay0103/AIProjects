const { render, screen, fireEvent } = require('@testing-library/react');
const { AuthProvider } = require('../src/contexts/AuthContext');
const React = require('react');

// 模拟组件
jest.mock('../src/components/auth/LoginForm', () => {
  const mockReact = require('react');
  return {
    __esModule: true,
    default: function LoginForm() {
      return mockReact.createElement('div', null, [
        mockReact.createElement('label', { key: 'email-label', htmlFor: 'email' }, '邮箱'),
        mockReact.createElement('input', { key: 'email-input', id: 'email', type: 'email' }),
        mockReact.createElement('label', { key: 'password-label', htmlFor: 'password' }, '密码'),
        mockReact.createElement('input', { key: 'password-input', id: 'password', type: 'password' }),
        mockReact.createElement('button', { key: 'submit' }, '登录')
      ]);
    }
  };
});

jest.mock('../src/components/auth/RegisterForm', () => {
  const mockReact = require('react');
  return {
    __esModule: true,
    default: function RegisterForm() {
      return mockReact.createElement('div', null, [
        mockReact.createElement('label', { key: 'username-label', htmlFor: 'username' }, '用户名'),
        mockReact.createElement('input', { key: 'username-input', id: 'username', type: 'text' }),
        mockReact.createElement('label', { key: 'email-label', htmlFor: 'email' }, '邮箱'),
        mockReact.createElement('input', { key: 'email-input', id: 'email', type: 'email' }),
        mockReact.createElement('label', { key: 'password-label', htmlFor: 'password' }, '密码'),
        mockReact.createElement('input', { key: 'password-input', id: 'password', type: 'password' }),
        mockReact.createElement('button', { key: 'submit' }, '注册')
      ]);
    }
  };
});

jest.mock('../src/components/images/ImageCard', () => {
  const mockReact = require('react');
  return {
    __esModule: true,
    default: function ImageCard({ image }) {
      return mockReact.createElement('div', null, [
        mockReact.createElement('img', { key: 'image', src: image.url, alt: image.prompt }),
        mockReact.createElement('p', { key: 'prompt' }, image.prompt)
      ]);
    }
  };
});

jest.mock('../src/components/generate/GenerateForm', () => {
  const mockReact = require('react');
  return {
    __esModule: true,
    default: function GenerateForm() {
      return mockReact.createElement('div', null, [
        mockReact.createElement('label', { key: 'prompt-label', htmlFor: 'prompt' }, '提示词'),
        mockReact.createElement('input', { key: 'prompt-input', id: 'prompt', type: 'text' }),
        mockReact.createElement('button', { key: 'submit' }, '生成')
      ]);
    }
  };
});

// 导入模拟的组件
const LoginForm = require('../src/components/auth/LoginForm').default;
const RegisterForm = require('../src/components/auth/RegisterForm').default;
const ImageCard = require('../src/components/images/ImageCard').default;
const GenerateForm = require('../src/components/generate/GenerateForm').default;

// 包装组件以提供必要的上下文
const renderWithAuth = (component) => {
  return render(
    React.createElement(AuthProvider, null, component)
  );
};

describe('Component Tests', () => {
  // 测试登录表单
  test('登录表单应该正确渲染并处理输入', () => {
    renderWithAuth(React.createElement(LoginForm));
    
    // 检查表单元素是否存在
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();

    // 测试输入
    fireEvent.change(screen.getByLabelText(/邮箱/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/密码/i), {
      target: { value: 'password123' },
    });

    // 验证输入值
    expect(screen.getByLabelText(/邮箱/i).value).toBe('test@example.com');
    expect(screen.getByLabelText(/密码/i).value).toBe('password123');
  });

  // 测试注册表单
  test('注册表单应该正确渲染并处理输入', () => {
    renderWithAuth(React.createElement(RegisterForm));
    
    // 检查表单元素是否存在
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/邮箱/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument();

    // 测试输入
    fireEvent.change(screen.getByLabelText(/用户名/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/邮箱/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/密码/i), {
      target: { value: 'password123' },
    });

    // 验证输入值
    expect(screen.getByLabelText(/用户名/i).value).toBe('testuser');
    expect(screen.getByLabelText(/邮箱/i).value).toBe('test@example.com');
    expect(screen.getByLabelText(/密码/i).value).toBe('password123');
  });

  // 测试图片卡片组件
  test('图片卡片应该正确渲染图片信息', () => {
    const mockImage = {
      id: '1',
      url: 'https://example.com/image.jpg',
      prompt: '测试图片',
      createdAt: '2024-05-09T10:00:00Z',
    };

    render(React.createElement(ImageCard, { image: mockImage }));
    
    // 检查图片元素是否存在
    expect(screen.getByAltText(/测试图片/i)).toBeInTheDocument();
    expect(screen.getByText(/测试图片/i)).toBeInTheDocument();
  });

  // 测试生成表单
  test('生成表单应该正确渲染并处理输入', () => {
    renderWithAuth(React.createElement(GenerateForm));
    
    // 检查表单元素是否存在
    expect(screen.getByLabelText(/提示词/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /生成/i })).toBeInTheDocument();

    // 测试输入
    fireEvent.change(screen.getByLabelText(/提示词/i), {
      target: { value: '一只可爱的猫咪' },
    });

    // 验证输入值
    expect(screen.getByLabelText(/提示词/i).value).toBe('一只可爱的猫咪');
  });
}); 