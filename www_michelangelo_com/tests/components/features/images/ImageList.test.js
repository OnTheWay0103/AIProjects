const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const ImageList = require('../../../../src/components/features/images/ImageList').default;
const { shareImage, unshareImage } = require('../../../../src/lib/api/api');

// 模拟 API 函数
jest.mock('../../../../src/lib/api/api', () => ({
  shareImage: jest.fn(),
  unshareImage: jest.fn()
}));

// 模拟 ImageCard 组件
jest.mock('../../../../src/components/features/images/ImageCard', () => {
  return function MockImageCard({ image, onShare, onDelete, isSharing, isDeleting }) {
    return (
      <div data-testid="image-card">
        <img src={image.imageUrl} alt={image.prompt} />
        <p>{image.prompt}</p>
        {onShare && (
          <button
            onClick={() => onShare(image.id, image.isPublic)}
            disabled={isSharing}
            data-testid="share-button"
          >
            {isSharing ? '处理中...' : (image.isPublic ? '取消分享' : '分享')}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(image.id)}
            disabled={isDeleting}
            data-testid="delete-button"
          >
            {isDeleting ? '删除中...' : '删除'}
          </button>
        )}
      </div>
    );
  };
});

describe('ImageList Tests', () => {
  const mockImages = [
    {
      id: '1',
      imageUrl: 'https://example.com/image1.jpg',
      prompt: '测试图片1',
      isPublic: false
    },
    {
      id: '2',
      imageUrl: 'https://example.com/image2.jpg',
      prompt: '测试图片2',
      isPublic: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('加载状态应该显示加载动画', () => {
    render(<ImageList images={[]} isLoading={true} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('错误状态应该显示错误信息', () => {
    const errorMessage = '加载失败';
    render(<ImageList images={[]} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('空列表应该显示提示信息', () => {
    render(<ImageList images={[]} />);
    
    expect(screen.getByText('暂无图片')).toBeInTheDocument();
  });

  test('应该正确渲染图片列表', () => {
    render(<ImageList images={mockImages} />);
    
    const imageCards = screen.getAllByTestId('image-card');
    expect(imageCards).toHaveLength(2);
  });

  test('分享图片应该调用正确的 API', async () => {
    shareImage.mockResolvedValueOnce({ success: true });
    
    render(<ImageList images={mockImages} />);
    
    const shareButtons = screen.getAllByTestId('share-button');
    fireEvent.click(shareButtons[0]); // 点击第一张图片的分享按钮
    
    await waitFor(() => {
      expect(shareImage).toHaveBeenCalledWith('1');
    });
  });

  test('取消分享图片应该调用正确的 API', async () => {
    unshareImage.mockResolvedValueOnce({ success: true });
    
    render(<ImageList images={mockImages} />);
    
    const shareButtons = screen.getAllByTestId('share-button');
    fireEvent.click(shareButtons[1]); // 点击第二张图片的取消分享按钮
    
    await waitFor(() => {
      expect(unshareImage).toHaveBeenCalledWith('2');
    });
  });

  test('删除图片应该调用 onDelete 回调', () => {
    const onDelete = jest.fn();
    render(<ImageList images={mockImages} onDelete={onDelete} />);
    
    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('当 showActions 为 false 时不应该显示操作按钮', () => {
    render(<ImageList images={mockImages} showActions={false} />);
    
    expect(screen.queryByTestId('share-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });
}); 