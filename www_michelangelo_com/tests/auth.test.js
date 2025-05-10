const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const React = require('react');

// 创建模拟对象
const mockStorage = {
  getUser: jest.fn(),
  setUser: jest.fn(),
  setToken: jest.fn(),
  clear: jest.fn(),
};

const mockApi = {
  login: jest.fn(),
  register: jest.fn(),
};

// 模拟模块
jest.mock('../src/lib/utils/storage', () => ({
  storage: mockStorage
}));
jest.mock('../src/lib/api/api', () => mockApi);

// 导入模拟后的模块
const { AuthProvider } = require('../src/store/contexts/AuthContext');
const { useAuth } = require('../src/hooks/auth/useAuth');

// 测试组件
const TestComponent = () => {
  const { user, login, register, logout } = useAuth();
  return React.createElement('div', null, [
    React.createElement('div', { key: 'user', 'data-testid': 'user' }, user ? user.email : '未登录'),
    React.createElement('button', { key: 'login', onClick: () => login('test@example.com', 'password') }, '登录'),
    React.createElement('button', { key: 'register', onClick: () => register('testuser', 'test@example.com', 'password') }, '注册'),
    React.createElement('button', { key: 'logout', onClick: logout }, '登出')
  ]);
};

describe('Auth Tests', () => {
  beforeEach(() => {
    // 清除所有模拟函数的调用记录
    jest.clearAllMocks();
    // 初始化 storage 模拟
    mockStorage.getUser.mockReturnValue(null);
  });

  test('登录功能应该正常工作', async () => {
    const mockUser = { email: 'test@example.com' };
    mockApi.login.mockResolvedValueOnce({ user: mockUser, token: 'mockToken' });

    render(React.createElement(AuthProvider, null, React.createElement(TestComponent)));

    // 点击登录按钮
    fireEvent.click(screen.getByText('登录'));

    // 等待状态更新
    await waitFor(() => {
      expect(mockApi.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(mockStorage.setUser).toHaveBeenCalledWith(mockUser);
      expect(mockStorage.setToken).toHaveBeenCalledWith('mockToken');
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  test('注册功能应该正常工作', async () => {
    const mockUser = { email: 'test@example.com' };
    mockApi.register.mockResolvedValueOnce({ user: mockUser, token: 'mockToken' });

    render(React.createElement(AuthProvider, null, React.createElement(TestComponent)));

    // 点击注册按钮
    fireEvent.click(screen.getByText('注册'));

    // 等待状态更新
    await waitFor(() => {
      expect(mockApi.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
      expect(mockStorage.setUser).toHaveBeenCalledWith(mockUser);
      expect(mockStorage.setToken).toHaveBeenCalledWith('mockToken');
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  test('登出功能应该正常工作', async () => {
    const mockUser = { email: 'test@example.com' };
    mockStorage.getUser.mockReturnValue(mockUser);

    render(React.createElement(AuthProvider, null, React.createElement(TestComponent)));

    // 点击登出按钮
    fireEvent.click(screen.getByText('登出'));

    // 等待状态更新
    await waitFor(() => {
      expect(mockStorage.clear).toHaveBeenCalled();
      expect(screen.getByTestId('user')).toHaveTextContent('未登录');
    });
  });
}); 