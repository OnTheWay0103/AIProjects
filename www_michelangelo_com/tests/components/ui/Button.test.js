const { render, screen, fireEvent } = require('@testing-library/react');
const Button = require('../../../src/components/ui/Button.tsx').default;

describe('Button Tests', () => {
  test('应该正确渲染按钮', () => {
    render(<Button>测试按钮</Button>);
    expect(screen.getByText('测试按钮')).toBeInTheDocument();
  });

  test('应该处理点击事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>测试按钮</Button>);
    fireEvent.click(screen.getByText('测试按钮'));
    expect(handleClick).toHaveBeenCalled();
  });

  test('应该应用正确的样式类', () => {
    const { rerender } = render(<Button variant="primary">测试按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="secondary">测试按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
  });

  test('禁用状态下应该有正确的样式且不可点击', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>测试按钮</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('加载状态下应该显示加载状态且不可点击', () => {
    const handleClick = jest.fn();
    render(<Button isLoading onClick={handleClick}>测试按钮</Button>);
    const button = screen.getByRole('button');
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-70');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('应该应用正确的尺寸类', () => {
    const { rerender } = render(<Button size="sm">测试按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="md">测试按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="lg">测试按钮</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  test('没有提供属性时应该使用默认值', () => {
    render(<Button>测试按钮</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
    expect(button).not.toHaveClass('opacity-50');
    expect(button).not.toBeDisabled();
  });
}); 