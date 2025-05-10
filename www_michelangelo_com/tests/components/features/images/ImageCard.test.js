const { render, screen, fireEvent } = require('@testing-library/react');
const ImageCard = require('../../../../src/components/features/images/ImageCard').default;

// 模拟 next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt }) {
    return <img src={src} alt={alt} data-testid="mock-image" />;
  };
});

describe('ImageCard Tests', () => {
  const mockImage = {
    id: '1',
    imageUrl: 'https://example.com/image.jpg',
    prompt: '测试图片',
    createdAt: '2024-03-20T12:00:00Z',
    isPublic: false
  };

  test('应该正确渲染图片和提示词', () => {
    render(<ImageCard image={mockImage} />);
    
    const image = screen.getByTestId('mock-image');
    expect(image).toHaveAttribute('src', mockImage.imageUrl);
    expect(image).toHaveAttribute('alt', mockImage.prompt);
    
    expect(screen.getByText(mockImage.prompt)).toBeInTheDocument();
  });

  test('应该正确显示创建时间', () => {
    render(<ImageCard image={mockImage} />);
    
    const date = new Date(mockImage.createdAt).toLocaleString();
    expect(screen.getByText(date)).toBeInTheDocument();
  });

  test('应该正确显示分享按钮', () => {
    const onShare = jest.fn();
    render(<ImageCard image={mockImage} onShare={onShare} />);
    
    const shareButton = screen.getByText('分享');
    expect(shareButton).toBeInTheDocument();
    
    fireEvent.click(shareButton);
    expect(onShare).toHaveBeenCalledWith(mockImage.id, mockImage.isPublic);
  });

  test('应该正确显示取消分享按钮', () => {
    const onShare = jest.fn();
    const publicImage = { ...mockImage, isPublic: true };
    render(<ImageCard image={publicImage} onShare={onShare} />);
    
    const unshareButton = screen.getByText('取消分享');
    expect(unshareButton).toBeInTheDocument();
    
    fireEvent.click(unshareButton);
    expect(onShare).toHaveBeenCalledWith(publicImage.id, publicImage.isPublic);
  });

  test('应该正确显示删除按钮', () => {
    const onDelete = jest.fn();
    render(<ImageCard image={mockImage} onDelete={onDelete} />);
    
    const deleteButton = screen.getByText('删除');
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(mockImage.id);
  });

  test('分享按钮应该在处理中时禁用', () => {
    render(<ImageCard image={mockImage} onShare={() => {}} isSharing={true} />);
    
    const shareButton = screen.getByText('处理中...');
    expect(shareButton).toBeDisabled();
  });

  test('删除按钮应该在处理中时禁用', () => {
    render(<ImageCard image={mockImage} onDelete={() => {}} isDeleting={true} />);
    
    const deleteButton = screen.getByText('删除中...');
    expect(deleteButton).toBeDisabled();
  });

  test('当没有操作函数时不应该显示按钮', () => {
    render(<ImageCard image={mockImage} />);
    
    expect(screen.queryByText('分享')).not.toBeInTheDocument();
    expect(screen.queryByText('删除')).not.toBeInTheDocument();
  });
}); 