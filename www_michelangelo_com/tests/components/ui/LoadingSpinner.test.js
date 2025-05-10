const { render, screen } = require('@testing-library/react');
const LoadingSpinner = require('../../../src/components/ui/LoadingSpinner.tsx').default;

describe('LoadingSpinner Tests', () => {
  test('应该正确渲染加载动画', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  test('应该应用自定义类名', () => {
    const customClass = 'custom-class';
    render(<LoadingSpinner className={customClass} />);
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass(customClass);
  });

  test('应该应用正确的尺寸', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('h-4 w-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByRole('status')).toHaveClass('h-8 w-8');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('h-12 w-12');
  });

  test('应该使用默认尺寸', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveClass('h-8 w-8');
  });

  test('应该使用正确的颜色', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />);
    expect(screen.getByRole('status')).toHaveClass('text-primary');
    
    rerender(<LoadingSpinner color="secondary" />);
    expect(screen.getByRole('status')).toHaveClass('text-secondary');
    
    rerender(<LoadingSpinner color="white" />);
    expect(screen.getByRole('status')).toHaveClass('text-white');
  });
}); 