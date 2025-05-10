const { render, screen, fireEvent } = require('@testing-library/react');
const ImageDetail = require('../../../../src/components/features/images/ImageDetail').default;

describe('ImageDetail Tests', () => {
  const mockImage = {
    id: '1',
    imageUrl: 'https://example.com/image1.jpg',
    prompt: '测试图片1',
    createdAt: '2024-03-20T12:00:00Z',
    isPublic: false
  };

  const mockOnShare = jest.fn();
  const mockOnUnshare = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该正确渲染图片详情', () => {
    render(
      <ImageDetail
        image={mockImage}
        onShare={mockOnShare}
        onUnshare={mockOnUnshare}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByAltText(mockImage.prompt)).toBeInTheDocument();
    expect(screen.getByText(mockImage.prompt)).toBeInTheDocument();
    expect(screen.getByText('分享')).toBeInTheDocument();
    expect(screen.getByText('删除')).toBeInTheDocument();
  });

  test('应该显示取消分享按钮当图片是公开的', () => {
    const publicImage = { ...mockImage, isPublic: true };
    
    render(
      <ImageDetail
        image={publicImage}
        onShare={mockOnShare}
        onUnshare={mockOnUnshare}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('取消分享')).toBeInTheDocument();
    expect(screen.queryByText('分享')).not.toBeInTheDocument();
  });

  test('应该调用分享函数当点击分享按钮', () => {
    render(
      <ImageDetail
        image={mockImage}
        onShare={mockOnShare}
        onUnshare={mockOnUnshare}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );
    
    fireEvent.click(screen.getByText('分享'));
    expect(mockOnShare).toHaveBeenCalledWith(mockImage.id);
  });

  test('应该调用取消分享函数当点击取消分享按钮', () => {
    const publicImage = { ...mockImage, isPublic: true };
    
    render(
      <ImageDetail
        image={publicImage}
        onShare={mockOnShare}
        onUnshare={mockOnUnshare}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );
    
    fireEvent.click(screen.getByText('取消分享'));
    expect(mockOnUnshare).toHaveBeenCalledWith(mockImage.id);
  });

  test('应该调用删除函数当点击删除按钮', () => {
    render(
      <ImageDetail
        image={mockImage}
        onShare={mockOnShare}
        onUnshare={mockOnUnshare}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );
    
    fireEvent.click(screen.getByText('删除'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockImage.id);
  });

  test('应该调用关闭函数当点击关闭按钮', () => {
    render(
      <ImageDetail
        image={mockImage}
        onShare={mockOnShare}
        onUnshare={mockOnUnshare}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('应该禁用按钮当操作进行中', () => {
    render(
      <ImageDetail
        image={mockImage}
        onShare={mockOnShare}
        onUnshare={mockOnUnshare}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
        isSubmitting={true}
      />
    );
    
    expect(screen.getByText('分享中...')).toBeDisabled();
    expect(screen.getByText('删除中...')).toBeDisabled();
  });

  test('不应该显示按钮当没有提供操作函数', () => {
    render(
      <ImageDetail
        image={mockImage}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.queryByText('分享')).not.toBeInTheDocument();
    expect(screen.queryByText('删除')).not.toBeInTheDocument();
  });
}); 