const { render, screen, fireEvent } = require('@testing-library/react');
const Input = require('../../../src/components/ui/Input.tsx').default;

describe('Input Tests', () => {
  test('应该正确渲染输入框', () => {
    render(<Input id="test" label="测试" />);
    expect(screen.getByLabelText('测试')).toBeInTheDocument();
  });

  test('应该处理值的变化', () => {
    const handleChange = jest.fn();
    render(<Input id="test" label="测试" onChange={handleChange} />);
    const input = screen.getByLabelText('测试');
    fireEvent.change(input, { target: { value: '新值' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('禁用状态下不应该可编辑', () => {
    render(<Input id="test" label="测试" disabled />);
    expect(screen.getByLabelText('测试')).toBeDisabled();
  });

  test('应该显示错误状态', () => {
    render(<Input id="test" label="测试" error="错误信息" />);
    expect(screen.getByText('错误信息')).toBeInTheDocument();
    expect(screen.getByLabelText('测试')).toHaveClass('border-red-500');
  });

  test('应该应用自定义类名', () => {
    render(<Input id="test" label="测试" className="custom-class" />);
    expect(screen.getByLabelText('测试')).toHaveClass('custom-class');
  });
}); 