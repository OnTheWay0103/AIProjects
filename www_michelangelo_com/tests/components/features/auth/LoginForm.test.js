const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const LoginForm = require('../../../../src/components/features/auth/LoginForm').default;
const { useAuth } = require('../../../../src/hooks/auth/useAuth');

// 模拟 useAuth hook
jest.mock('../../../../src/hooks/auth/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('LoginForm Tests', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
  });

  test('应该正确渲染表单', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  test('提交表单应该调用 login 函数', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('邮箱');
    const passwordInput = screen.getByLabelText('密码');
    const submitButton = screen.getByRole('button', { name: '登录' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('提交空表单应该显示验证错误', () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: '登录' });
    fireEvent.click(submitButton);
    
    expect(screen.getByLabelText('邮箱')).toBeInvalid();
    expect(screen.getByLabelText('密码')).toBeInvalid();
  });

  test('输入无效邮箱应该显示验证错误', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('邮箱');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(emailInput).toBeInvalid();
  });

  test('登录失败应该显示错误信息', async () => {
    const errorMessage = '登录失败';
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('邮箱');
    const passwordInput = screen.getByLabelText('密码');
    const submitButton = screen.getByRole('button', { name: '登录' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 