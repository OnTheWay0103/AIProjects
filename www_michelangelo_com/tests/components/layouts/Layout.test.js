const { render, screen } = require('@testing-library/react');
const Layout = require('../../../src/components/layouts/Layout').default;

// 模拟 Navbar 组件
jest.mock('../../../src/components/layouts/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  };
});

describe('Layout Tests', () => {
  test('应该正确渲染布局结构', () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );
    
    // 检查 Navbar 是否被渲染
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    
    // 检查子组件是否被渲染
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    
    // 检查页脚是否被渲染
    const footer = screen.getByText(/Mikey.app/);
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent(new Date().getFullYear().toString());
  });

  test('应该正确渲染多个子组件', () => {
    render(
      <Layout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Layout>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
}); 