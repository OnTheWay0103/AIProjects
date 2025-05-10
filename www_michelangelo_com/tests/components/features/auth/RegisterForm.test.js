const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const RegisterForm = require('../../../../src/components/features/auth/RegisterForm').default;
const { useAuth } = require('../../../../src/hooks/auth/useAuth');

// 模拟 useAuth hook
jest.mock('../../../../src/hooks/auth/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('RegisterForm Tests', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ register: mockRegister });
  });

  test('应该正确渲染表单', () => {
    render(<RegisterForm />);
    
    expect(screen.getByLabelText('用户名')).toBeInTheDocument();
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument();
  });

  test('提交表单应该调用 register 函数', async () => {
    render(<RegisterForm />);
    
    const usernameInput = screen.getByLabelText('用户名');
    const emailInput = screen.getByLabelText('邮箱');
    const passwordInput = screen.getByLabelText('密码');
    const submitButton = screen.getByRole('button', { name: '注册' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });
  });

  test('提交空表单应该显示验证错误', () => {
    render(<RegisterForm />);
    
    const submitButton = screen.getByRole('button', { name: '注册' });
    fireEvent.click(submitButton);
    
    expect(screen.getByLabelText('用户名')).toBeInvalid();
    expect(screen.getByLabelText('邮箱')).toBeInvalid();
    expect(screen.getByLabelText('密码')).toBeInvalid();
  });

  test('输入无效邮箱应该显示验证错误', () => {
    render(<RegisterForm />);
    
    const emailInput = screen.getByLabelText('邮箱');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(emailInput).toBeInvalid();
  });

  test('注册失败应该显示错误信息', async () => {
    const errorMessage = '注册失败';
    mockRegister.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<RegisterForm />);
    
    const usernameInput = screen.getByLabelText('用户名');
    const emailInput = screen.getByLabelText('邮箱');
    const passwordInput = screen.getByLabelText('密码');
    const submitButton = screen.getByRole('button', { name: '注册' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 