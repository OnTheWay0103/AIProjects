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

  test('未登录状态下应该显示登录和注册链接', () => {
    render(<Navbar />);
    
    expect(screen.getByText('登录')).toBeInTheDocument();
    expect(screen.getByText('注册')).toBeInTheDocument();
    expect(screen.queryByText('生成')).not.toBeInTheDocument();
    expect(screen.queryByText('我的图片')).not.toBeInTheDocument();
    expect(screen.queryByText('设置')).not.toBeInTheDocument();
  });

  test('登录状态下应该显示用户相关链接', () => {
    useAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      logout: jest.fn()
    });

    render(<Navbar />);
    
    expect(screen.getByText('生成')).toBeInTheDocument();
    expect(screen.getByText('我的图片')).toBeInTheDocument();
    expect(screen.getByText('设置')).toBeInTheDocument();
    expect(screen.getByText('退出')).toBeInTheDocument();
    expect(screen.queryByText('登录')).not.toBeInTheDocument();
    expect(screen.queryByText('注册')).not.toBeInTheDocument();
  });

  test('当前路由应该高亮显示', () => {
    useRouter.mockReturnValue({
      pathname: '/explore'
    });

    render(<Navbar />);
    
    const exploreLink = screen.getByText('探索');
    expect(exploreLink).toHaveClass('text-primary');
  });

  test('点击退出按钮应该调用 logout 函数', () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      logout: mockLogout
    });

    render(<Navbar />);
    
    const logoutButton = screen.getByText('退出');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });
}); 