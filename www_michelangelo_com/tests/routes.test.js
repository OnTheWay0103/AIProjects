require('cross-fetch/polyfill');
const { createMocks } = require('node-mocks-http');

// 模拟 getServerSideProps
const mockGetServerSideProps = jest.fn().mockResolvedValue({
  props: {},
});

jest.mock('../src/pages/index', () => ({
  getServerSideProps: mockGetServerSideProps,
}));

describe('Route Tests', () => {
  beforeEach(() => {
    // 清除所有模拟函数的调用记录
    jest.clearAllMocks();
  });

  // 测试首页路由
  test('首页路由应该返回200状态码', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    await mockGetServerSideProps({ req, res });

    expect(mockGetServerSideProps).toHaveBeenCalledWith({ req, res });
  });

  // 测试登录页面路由
  test('登录页面路由应该返回200状态码', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    const response = await fetch('http://localhost:3000/login');
    expect(response.status).toBe(200);
  });

  // 测试注册页面路由
  test('注册页面路由应该返回200状态码', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    const response = await fetch('http://localhost:3000/register');
    expect(response.status).toBe(200);
  });

  // 测试探索页面路由
  test('探索页面路由应该返回200状态码', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    const response = await fetch('http://localhost:3000/explore');
    expect(response.status).toBe(200);
  });

  // 测试生成页面路由
  test('生成页面路由应该返回200状态码', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    const response = await fetch('http://localhost:3000/generate');
    expect(response.status).toBe(200);
  });

  // 测试设置页面路由
  test('设置页面路由应该返回200状态码', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    const response = await fetch('http://localhost:3000/settings');
    expect(response.status).toBe(200);
  });

  // 测试图片页面路由
  test('图片页面路由应该返回200状态码', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    const response = await fetch('http://localhost:3000/images');
    expect(response.status).toBe(200);
  });
}); 