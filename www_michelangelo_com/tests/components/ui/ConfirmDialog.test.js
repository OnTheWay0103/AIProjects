const { render, screen, fireEvent } = require('@testing-library/react');
const React = require('react');
const ConfirmDialog = require('../../../src/components/ui/ConfirmDialog.tsx').default;

// 模拟 @headlessui/react
jest.mock('@headlessui/react', () => {
  const React = require('react');
  const Dialog = ({ children, onClose }) => (
    <div role="dialog" onClick={onClose}>
      {children}
    </div>
  );
  
  Dialog.Panel = ({ children }) => <div>{children}</div>;
  Dialog.Title = ({ children }) => <h3>{children}</h3>;

  return {
    Dialog,
    Transition: {
      Root: ({ show, children }) => (show ? children : null),
      Child: ({ children }) => children
    },
    Fragment: React.Fragment
  };
});

describe('ConfirmDialog Tests', () => {
  test('应该正确渲染对话框', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="确认"
        message="确定要执行此操作吗？"
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '确认' })).toBeInTheDocument();
    expect(screen.getByText('确定要执行此操作吗？')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '确认' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument();
  });

  test('点击确认按钮应该触发回调', () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="确认"
        message="确定要执行此操作吗？"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '确认' }));
    expect(handleConfirm).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  test('点击取消按钮应该关闭对话框', () => {
    const handleClose = jest.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={() => {}}
        title="确认"
        message="确定要执行此操作吗？"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(handleClose).toHaveBeenCalled();
  });

  test('不应该在关闭状态下渲染对话框', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="确认"
        message="确定要执行此操作吗？"
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('应该使用自定义按钮文本', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="确认"
        message="确定要执行此操作吗？"
        confirmText="删除"
        cancelText="返回"
      />
    );

    expect(screen.getByRole('button', { name: '删除' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '返回' })).toBeInTheDocument();
  });
}); 