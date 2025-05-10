const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const GenerateForm = require('../../../../src/components/features/generate/GenerateForm').default;
const { generateImage } = require('../../../../src/lib/api/api');

// 模拟 API 函数
jest.mock('../../../../src/lib/api/api', () => ({
  generateImage: jest.fn()
}));

describe('GenerateForm Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该正确渲染表单', () => {
    render(<GenerateForm />);
    
    expect(screen.getByLabelText('提示词')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成图片' })).toBeInTheDocument();
  });

  test('提交空提示词应该显示错误', async () => {
    render(<GenerateForm />);
    
    const submitButton = screen.getByRole('button', { name: '生成图片' });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('请输入提示词')).toBeInTheDocument();
  });

  test('提交有效提示词应该调用生成 API', async () => {
    const mockImageUrl = 'https://example.com/image.jpg';
    const onImageGenerated = jest.fn();
    
    generateImage.mockResolvedValueOnce({ image: { url: mockImageUrl } });
    
    render(<GenerateForm onImageGenerated={onImageGenerated} />);
    
    const textarea = screen.getByLabelText('提示词');
    const submitButton = screen.getByRole('button', { name: '生成图片' });
    
    fireEvent.change(textarea, { target: { value: '一只可爱的猫咪' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(generateImage).toHaveBeenCalledWith('一只可爱的猫咪');
      expect(onImageGenerated).toHaveBeenCalledWith(mockImageUrl);
    });
  });

  test('生成失败应该显示错误信息', async () => {
    const errorMessage = '生成失败';
    generateImage.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<GenerateForm />);
    
    const textarea = screen.getByLabelText('提示词');
    const submitButton = screen.getByRole('button', { name: '生成图片' });
    
    fireEvent.change(textarea, { target: { value: '一只可爱的猫咪' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('生成过程中应该禁用提交按钮', async () => {
    generateImage.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<GenerateForm />);
    
    const textarea = screen.getByLabelText('提示词');
    const submitButton = screen.getByRole('button', { name: '生成图片' });
    
    fireEvent.change(textarea, { target: { value: '一只可爱的猫咪' } });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('生成中...');
  });

  test('生成完成后应该重置表单状态', async () => {
    const mockImageUrl = 'https://example.com/image.jpg';
    generateImage.mockResolvedValueOnce({ image: { url: mockImageUrl } });
    
    render(<GenerateForm />);
    
    const textarea = screen.getByLabelText('提示词');
    const submitButton = screen.getByRole('button', { name: '生成图片' });
    
    fireEvent.change(textarea, { target: { value: '一只可爱的猫咪' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('生成图片');
    });
  });
}); 