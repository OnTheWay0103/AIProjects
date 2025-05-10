const { render, screen, fireEvent, act, waitFor } = require('@testing-library/react');
const SettingsForm = require('../../../../src/components/features/settings/SettingsForm').default;

describe('SettingsForm Tests', () => {
  const mockSettings = {
    username: '测试用户',
    email: 'test@example.com',
    theme: 'light',
    language: 'zh-CN'
  };

  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该正确渲染设置表单', () => {
    render(
      <SettingsForm
        settings={mockSettings}
        onSave={mockOnSave}
      />
    );
    
    expect(screen.getByTestId('username-input')).toHaveValue(mockSettings.username);
    expect(screen.getByTestId('email-input')).toHaveValue(mockSettings.email);
    expect(screen.getByLabelText('主题')).toHaveValue(mockSettings.theme);
    expect(screen.getByLabelText('语言')).toHaveValue(mockSettings.language);
  });

  test('应该调用保存函数当提交表单', async () => {
    render(
      <SettingsForm
        settings={mockSettings}
        onSave={mockOnSave}
      />
    );
    
    await act(async () => {
      fireEvent.click(screen.getByText('保存设置'));
    });
    
    expect(mockOnSave).toHaveBeenCalledWith(mockSettings);
  });

  test('应该更新表单值当输入改变', async () => {
    render(
      <SettingsForm
        settings={mockSettings}
        onSave={mockOnSave}
      />
    );
    
    const usernameInput = screen.getByTestId('username-input');
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: '新用户名' } });
    });
    expect(usernameInput).toHaveValue('新用户名');
    
    const emailInput = screen.getByTestId('email-input');
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    });
    expect(emailInput).toHaveValue('new@example.com');
  });

  test('应该显示错误信息当邮箱格式无效', async () => {
    render(
      <SettingsForm
        settings={{ ...mockSettings }}
        onSave={mockOnSave}
      />
    );
    
    const emailInput = screen.getByTestId('email-input');
    const form = emailInput.closest('form');
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    });
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    await waitFor(() => {
      const errorElement = screen.getByTestId('email-error');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('请输入有效的邮箱地址');
    });
    
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('应该显示错误信息当用户名为空', async () => {
    render(
      <SettingsForm
        settings={{ ...mockSettings }}
        onSave={mockOnSave}
      />
    );
    
    const usernameInput = screen.getByTestId('username-input');
    const form = usernameInput.closest('form');
    
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: '' } });
    });
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    await waitFor(() => {
      const errorElement = screen.getByTestId('username-error');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('用户名不能为空');
    });
    
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('应该禁用保存按钮当表单正在提交', () => {
    render(
      <SettingsForm
        settings={mockSettings}
        onSave={mockOnSave}
        isSubmitting={true}
      />
    );
    
    expect(screen.getByText('保存中...')).toBeDisabled();
  });

  test('应该显示成功消息当保存成功', () => {
    render(
      <SettingsForm
        settings={mockSettings}
        onSave={mockOnSave}
        isSuccess={true}
      />
    );
    
    expect(screen.getByTestId('success-message')).toHaveTextContent('设置已保存');
  });

  test('应该显示错误消息当保存失败', () => {
    render(
      <SettingsForm
        settings={mockSettings}
        onSave={mockOnSave}
        error="保存失败"
      />
    );
    
    expect(screen.getByTestId('error-message')).toHaveTextContent('保存失败');
  });
}); 