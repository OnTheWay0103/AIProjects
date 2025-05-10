const { render, screen } = require('@testing-library/react');
const ImageGrid = require('../../../../src/components/features/images/ImageGrid').default;

// 模拟 ImageCard 组件
jest.mock('../../../../src/components/features/images/ImageCard', () => {
  return function MockImageCard({ image }) {
    return (
      <div data-testid="image-card">
        <img src={image.imageUrl} alt={image.prompt} />
        <p>{image.prompt}</p>
      </div>
    );
  };
});

describe('ImageGrid Tests', () => {
  const mockImages = [
    {
      id: '1',
      imageUrl: 'https://example.com/image1.jpg',
      prompt: '测试图片1',
      createdAt: '2024-03-20T12:00:00Z'
    },
    {
      id: '2',
      imageUrl: 'https://example.com/image2.jpg',
      prompt: '测试图片2',
      createdAt: '2024-03-20T13:00:00Z'
    }
  ];

  test('应该正确渲染图片网格', () => {
    render(<ImageGrid images={mockImages} />);
    
    const imageCards = screen.getAllByTestId('image-card');
    expect(imageCards).toHaveLength(2);
  });

  test('应该使用正确的网格列数', () => {
    const { rerender } = render(<ImageGrid images={mockImages} columns={2} />);
    expect(screen.getByRole('list')).toHaveClass('grid-cols-2');
    
    rerender(<ImageGrid images={mockImages} columns={3} />);
    expect(screen.getByRole('list')).toHaveClass('grid-cols-3');
    
    rerender(<ImageGrid images={mockImages} columns={4} />);
    expect(screen.getByRole('list')).toHaveClass('grid-cols-4');
  });

  test('应该使用正确的间距', () => {
    const { rerender } = render(<ImageGrid images={mockImages} gap={2} />);
    expect(screen.getByRole('list')).toHaveClass('gap-2');
    
    rerender(<ImageGrid images={mockImages} gap={4} />);
    expect(screen.getByRole('list')).toHaveClass('gap-4');
    
    rerender(<ImageGrid images={mockImages} gap={6} />);
    expect(screen.getByRole('list')).toHaveClass('gap-6');
  });

  test('空列表应该显示提示信息', () => {
    render(<ImageGrid images={[]} />);
    
    expect(screen.getByText('暂无图片')).toBeInTheDocument();
  });

  test('应该使用默认值', () => {
    render(<ImageGrid images={mockImages} />);
    
    const grid = screen.getByRole('list');
    expect(grid).toHaveClass('grid grid-cols-4 gap-6');
  });
}); 