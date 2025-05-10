import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../../src/components/ui/ErrorBoundary';

// 模拟会抛出错误的组件
const ThrowError = () => {
  throw new Error('测试错误');
};

// 正常组件
const NormalContent = () => <div data-testid="normal-content">正常内容</div>;

describe('ErrorBoundary Tests', () => {
  beforeAll(() => {
    // 禁用控制台错误输出
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // 恢复控制台错误输出
    console.error.mockRestore();
  });

  test('应该捕获并显示错误信息', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('出错了')).toBeInTheDocument();
    expect(screen.getByText('测试错误')).toBeInTheDocument();
  });

  test('应该正常渲染没有错误的子组件', () => {
    render(
      <ErrorBoundary>
        <NormalContent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('normal-content')).toBeInTheDocument();
    expect(screen.queryByText('出错了')).not.toBeInTheDocument();
  });

  test('点击重试按钮应该重置错误状态', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('出错了')).toBeInTheDocument();

    // 点击重试按钮
    fireEvent.click(screen.getByTestId('retry-button'));

    // 卸载后重新 render 正常 children
    unmount();
    render(
      <ErrorBoundary>
        <NormalContent />
      </ErrorBoundary>
    );

    // 验证错误状态已重置
    expect(screen.getByTestId('normal-content')).toBeInTheDocument();
    expect(screen.queryByText('出错了')).not.toBeInTheDocument();
  });
}); 