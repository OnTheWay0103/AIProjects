import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../src/store/contexts/AuthContext';
import Generate from '../src/pages/generate';
import Images from '../src/pages/images';
import Explore from '../src/pages/explore';
import { generateImage, getImages, getPublicImages } from '../src/lib/api/api';
import { useRouter } from 'next/router';

// 模拟 next/router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    pathname: '/'
  })
}));

// 模拟 next/link
jest.mock('next/link', () => {
  return function Link({ children, href }) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          mockPush(href);
        }}
      >
        {children}
      </a>
    );
  };
});

// 模拟 API
jest.mock('../src/lib/api/api', () => ({
  generateImage: jest.fn(),
  getImages: jest.fn(),
  getPublicImages: jest.fn()
}));

// 渲染组件时包装 AuthContext
const renderWithAuth = (component) => {
  const mockAuthContext = {
    user: { id: '1', name: '测试用户', email: 'test@example.com' },
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  };

  return render(
    <AuthContext.Provider value={mockAuthContext}>
      {component}
    </AuthContext.Provider>
  );
};

describe('Page Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Generate Page', () => {
    test('应该正确渲染生成页面', () => {
      renderWithAuth(<Generate />);
      expect(screen.getByText('使用 AI 生成图片')).toBeInTheDocument();
      expect(screen.getByLabelText('提示词')).toBeInTheDocument();
    });

    test('生成图片后应该显示图片', async () => {
      const mockImageUrl = 'https://example.com/image.jpg';
      generateImage.mockResolvedValueOnce({ image: { url: mockImageUrl } });

      renderWithAuth(<Generate />);
      
      const textarea = screen.getByLabelText('提示词');
      const submitButton = screen.getByRole('button', { name: '生成图片' });

      fireEvent.change(textarea, { target: { value: '一只可爱的猫咪' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByAltText('生成的图片')).toBeInTheDocument();
        expect(screen.getByAltText('生成的图片')).toHaveAttribute('src', mockImageUrl);
      });
    });
  });

  describe('Images Page', () => {
    test('应该正确渲染图片页面', async () => {
      const mockImages = {
        images: [
          {
            id: '1',
            imageUrl: 'https://example.com/image1.jpg',
            prompt: '一只可爱的猫咪',
            createdAt: new Date().toISOString(),
            isPublic: false
          }
        ]
      };
      getImages.mockResolvedValueOnce(mockImages);

      renderWithAuth(<Images />);
      
      // 等待加载状态消失
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('我的图片')).toBeInTheDocument();
      expect(screen.getByTestId('image-list')).toBeInTheDocument();
    });

    test('加载失败应该显示错误信息', async () => {
      getImages.mockRejectedValueOnce(new Error('请求失败'));

      renderWithAuth(<Images />);

      // 等待加载状态消失
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // 检查 Toast 组件中的错误信息
      expect(screen.getByText('请求失败')).toBeInTheDocument();
    });

    test('点击生成新图片按钮应该跳转', async () => {
      const mockImages = { images: [] };
      getImages.mockResolvedValueOnce(mockImages);

      renderWithAuth(<Images />);
      
      // 等待加载状态消失
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // 使用 getByText 而不是 getByRole
      const generateButton = screen.getByText('生成新图片');
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/generate');
      });
    });
  });

  describe('Explore Page', () => {
    test('应该正确渲染探索页面', async () => {
      const mockImages = {
        images: [
          {
            id: '1',
            imageUrl: 'https://example.com/image1.jpg',
            prompt: '一只可爱的猫咪',
            createdAt: new Date().toISOString(),
            isPublic: true
          }
        ]
      };
      getPublicImages.mockResolvedValueOnce(mockImages);

      renderWithAuth(<Explore />);
      
      // 等待加载状态消失
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText('探索')).toBeInTheDocument();
      expect(screen.getByTestId('image-list')).toBeInTheDocument();
    });

    test('加载失败应该显示错误信息', async () => {
      getPublicImages.mockRejectedValueOnce(new Error('请求失败'));

      renderWithAuth(<Explore />);

      // 等待加载状态消失
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText('请求失败')).toBeInTheDocument();
    });
  });
}); 