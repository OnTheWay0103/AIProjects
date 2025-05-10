const { render, screen, fireEvent } = require('@testing-library/react');
const GenerateHistory = require('../../../../src/components/features/generate/GenerateHistory').default;

describe('GenerateHistory Tests', () => {
  const mockHistory = [
    {
      id: '1',
      prompt: '测试提示词1',
      createdAt: '2024-03-20T12:00:00Z'
    },
    {
      id: '2',
      prompt: '测试提示词2',
      createdAt: '2024-03-20T13:00:00Z'
    }
  ];

  const mockOnSelect = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('应该正确渲染历史记录列表', () => {
    render(
      <GenerateHistory
        history={mockHistory}
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );
    
    expect(screen.getByText('生成历史')).toBeInTheDocument();
    expect(screen.getByText('测试提示词1')).toBeInTheDocument();
    expect(screen.getByText('测试提示词2')).toBeInTheDocument();
  });

  test('应该调用选择函数当点击历史记录项', () => {
    render(
      <GenerateHistory
        history={mockHistory}
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );
    
    fireEvent.click(screen.getByText('测试提示词1'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockHistory[0]);
  });

  test('应该调用清除函数当点击清除按钮', () => {
    render(
      <GenerateHistory
        history={mockHistory}
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );
    
    fireEvent.click(screen.getByText('清除历史'));
    expect(mockOnClear).toHaveBeenCalled();
  });

  test('空历史记录应该显示提示信息', () => {
    render(
      <GenerateHistory
        history={[]}
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );
    
    expect(screen.getByText('暂无历史记录')).toBeInTheDocument();
  });

  test('应该显示历史记录的时间', () => {
    render(
      <GenerateHistory
        history={mockHistory}
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );
    
    const date1 = new Date('2024-03-20T12:00:00Z');
    const date2 = new Date('2024-03-20T13:00:00Z');
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    };
    
    expect(screen.getByText(formatDate(date1))).toBeInTheDocument();
    expect(screen.getByText(formatDate(date2))).toBeInTheDocument();
  });

  test('应该限制显示的历史记录数量', () => {
    const longHistory = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      prompt: `测试提示词${i + 1}`,
      createdAt: '2024-03-20T12:00:00Z'
    }));

    render(
      <GenerateHistory
        history={longHistory}
        onSelect={mockOnSelect}
        onClear={mockOnClear}
        maxItems={5}
      />
    );
    
    const historyItems = screen.getAllByRole('listitem');
    expect(historyItems).toHaveLength(5);
  });

  test('应该使用默认的最大显示数量', () => {
    const longHistory = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      prompt: `测试提示词${i + 1}`,
      createdAt: '2024-03-20T12:00:00Z'
    }));

    render(
      <GenerateHistory
        history={longHistory}
        onSelect={mockOnSelect}
        onClear={mockOnClear}
      />
    );
    
    const historyItems = screen.getAllByRole('listitem');
    expect(historyItems).toHaveLength(5); // 默认显示5条
  });
}); 