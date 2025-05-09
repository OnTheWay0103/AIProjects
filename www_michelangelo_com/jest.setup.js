require('@testing-library/jest-dom');

// 模拟 next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// 模拟 next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image(props) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return `<img ${Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ')} />`;
  },
}));

// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 