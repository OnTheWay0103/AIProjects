const { render, screen, fireEvent, act } = require('@testing-library/react');
const Toast = require('../../../src/components/ui/Toast.tsx').default;

describe('Toast Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('应该正确渲染消息', () => {
    render(<Toast message="测试消息" />);
    expect(screen.getByText('测试消息')).toBeInTheDocument();
  });

  test('应该在指定时间后自动关闭', () => {
    const onClose = jest.fn();
    render(<Toast message="测试消息" duration={3000} onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalled();
  });

  test('应该根据类型显示不同样式', () => {
    const { rerender } = render(<Toast message="测试消息" type="success" />);
    expect(screen.getByTestId('toast')).toHaveClass('bg-success');

    rerender(<Toast message="测试消息" type="error" />);
    expect(screen.getByTestId('toast')).toHaveClass('bg-error');

    rerender(<Toast message="测试消息" type="info" />);
    expect(screen.getByTestId('toast')).toHaveClass('bg-info');

    rerender(<Toast message="测试消息" type="warning" />);
    expect(screen.getByTestId('toast')).toHaveClass('bg-warning');
  });

  test('应该使用默认持续时间', () => {
    const onClose = jest.fn();
    render(<Toast message="测试消息" onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalled();
  });

  test('应该正确渲染成功提示', () => {
    render(
      <Toast
        message="操作成功"
        type="success"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('操作成功')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toHaveClass('bg-success');
  });

  test('应该正确渲染错误提示', () => {
    render(
      <Toast
        message="操作失败"
        type="error"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('操作失败')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toHaveClass('bg-error');
  });

  test('应该正确渲染警告提示', () => {
    render(
      <Toast
        message="警告信息"
        type="warning"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('警告信息')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toHaveClass('bg-warning');
  });

  test('应该正确渲染信息提示', () => {
    render(
      <Toast
        message="提示信息"
        type="info"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('提示信息')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toHaveClass('bg-info');
  });

  test('应该调用关闭函数当点击关闭按钮', () => {
    const mockOnClose = jest.fn();
    
    render(
      <Toast
        message="测试消息"
        type="success"
        onClose={mockOnClose}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('应该自动关闭当duration大于0', () => {
    const mockOnClose = jest.fn();
    
    render(
      <Toast
        message="测试消息"
        type="success"
        onClose={mockOnClose}
        duration={3000}
      />
    );
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('不应该自动关闭当duration为0', () => {
    const mockOnClose = jest.fn();
    
    render(
      <Toast
        message="测试消息"
        type="success"
        onClose={mockOnClose}
        duration={0}
      />
    );
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('应该使用默认类型', () => {
    render(<Toast message="测试消息" />);
    expect(screen.getByTestId('toast')).toHaveClass('bg-info');
  });
}); 