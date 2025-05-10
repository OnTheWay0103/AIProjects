const { render, screen, act } = require('@testing-library/react');
const { useRouter } = require('next/router');
const { useAuth } = require('../../../../src/hooks/auth/useAuth');
const ProtectedRoute = require('../../../../src/components/features/auth/ProtectedRoute').default;

// 模拟 next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// 模拟 useAuth hook
jest.mock('../../../../src/hooks/auth/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('ProtectedRoute Tests', () => {
  const mockRouter = {
    replace: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
  });

  test('加载状态应该显示加载动画', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    
    render(
      <ProtectedRoute>
        <div>受保护的内容</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('未登录用户应该被重定向到登录页面', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    
    render(
      <ProtectedRoute>
        <div>受保护的内容</div>
      </ProtectedRoute>
    );
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('受保护的内容')).not.toBeInTheDocument();
  });

  test('已登录用户应该看到受保护的内容', () => {
    useAuth.mockReturnValue({ user: { email: 'test@example.com' }, loading: false });
    
    render(
      <ProtectedRoute>
        <div>受保护的内容</div>
      </ProtectedRoute>
    );
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(screen.getByText('受保护的内容')).toBeInTheDocument();
  });

  test('用户状态变化应该触发重定向', () => {
    useAuth.mockReturnValue({ user: { email: 'test@example.com' }, loading: false });
    
    const { rerender } = render(
      <ProtectedRoute>
        <div>受保护的内容</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('受保护的内容')).toBeInTheDocument();
    
    useAuth.mockReturnValue({ user: null, loading: false });
    rerender(
      <ProtectedRoute>
        <div>受保护的内容</div>
      </ProtectedRoute>
    );
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('受保护的内容')).not.toBeInTheDocument();
  });
}); 