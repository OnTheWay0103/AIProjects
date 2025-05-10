const { render, screen, fireEvent } = require('@testing-library/react');
const { useRouter } = require('next/router');
const { useAuth } = require('../../../src/hooks/auth/useAuth');
const Navbar = require('../../../src/components/layouts/Navbar').default;

// 模拟 next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// 模拟 useAuth hook
jest.mock('../../../src/hooks/auth/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('Navbar Tests', () => {
  beforeEach(() => {
    // 清除所有模拟函数的调用记录
    jest.clearAllMocks();
    
    // 设置默认的模拟返回值
    useRouter.mockReturnValue({
      pathname: '/'
    });
    
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn()
    });
  });

  test('未登录状态下应该显示登录按钮和主导航链接', () => {
    render(<Navbar />);
    
    // 检查主导航链接
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Extend Image')).toBeInTheDocument();
    expect(screen.getByText('AI Voice Clone')).toBeInTheDocument();
    
    // 检查登录按钮
    expect(screen.getByText('Login')).toBeInTheDocument();
    
    // 检查语言切换按钮
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  test('登录状态下应该显示退出按钮', () => {
    useAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      logout: jest.fn()
    });

    render(<Navbar />);
    
    // 检查退出按钮
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  test('点击语言按钮应该显示语言选择下拉菜单', () => {
    render(<Navbar />);
    
    // 点击语言切换按钮
    const languageButton = screen.getByText('EN');
    fireEvent.click(languageButton);
    
    // 检查语言下拉菜单选项
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('简体中文')).toBeInTheDocument();
    expect(screen.getByText('繁體中文')).toBeInTheDocument();
    expect(screen.getByText('日本語')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  test('点击移动端菜单按钮应该显示移动导航', () => {
    render(<Navbar />);
    
    // 查找并点击移动菜单按钮
    const mobileMenuButton = screen.getByLabelText('Open main menu');
    fireEvent.click(mobileMenuButton);
    
    // 检查移动导航中的链接
    expect(screen.getAllByText('Features').length).toBe(2); // 一个在桌面版，一个在移动版
    expect(screen.getAllByText('FAQs').length).toBe(2);
    expect(screen.getAllByText('Pricing').length).toBe(2);
  });

  test('点击退出按钮应该调用 logout 函数', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      logout: mockLogout
    });

    render(<Navbar />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });
}); 