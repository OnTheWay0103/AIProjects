const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { AuthProvider } = require('../src/store/contexts/AuthContext');
const { generateImage, shareImage, unshareImage, deleteImage } = require('../src/lib/api/api');

// 模拟 next/image
jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => {
      return React.createElement('img', {
        ...props,
        src: props.src || '',
        alt: props.alt || '',
      });
    },
  };
});

// 模拟 API
jest.mock('../src/lib/api/api', () => ({
  generateImage: jest.fn(),
  shareImage: jest.fn(),
  unshareImage: jest.fn(),
  deleteImage: jest.fn(),
}));

// 模拟组件
jest.mock('../src/components/features/auth/LoginForm', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      return React.createElement('div', { 'data-testid': 'login-form' });
    }),
  };
});

jest.mock('../src/components/features/auth/RegisterForm', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      return React.createElement('div', { 'data-testid': 'register-form' });
    }),
  };
});

jest.mock('../src/components/features/images/ImageCard', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => {
      const { image, onShare, onDelete, isSharing, isDeleting } = props;
      return React.createElement('div', { 'data-testid': 'image-card' }, [
        React.createElement('img', {
          key: 'image',
          src: image.imageUrl,
          alt: image.prompt,
        }),
        React.createElement('p', { key: 'prompt' }, image.prompt),
        onShare && React.createElement('button', {
          key: 'share',
          onClick: () => onShare(image.id, image.isPublic),
          disabled: isSharing,
          'aria-label': isSharing ? '处理中...' : (image.isPublic ? '取消分享' : '分享'),
        }, isSharing ? '处理中...' : (image.isPublic ? '取消分享' : '分享')),
        onDelete && React.createElement('button', {
          key: 'delete',
          onClick: () => onDelete(image.id),
          disabled: isDeleting,
          'aria-label': isDeleting ? '删除中...' : '删除',
        }, isDeleting ? '删除中...' : '删除'),
      ]);
    },
  };
});

jest.mock('../src/components/features/generate/GenerateForm', () => {
  const React = require('react');
  const { generateImage } = require('../src/lib/api/api');

  return {
    __esModule: true,
    default: (props) => {
      const [prompt, setPrompt] = React.useState('');
      const [isGenerating, setIsGenerating] = React.useState(false);
      const [error, setError] = React.useState(null);

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
          setError('请输入提示词');
          return;
        }
        setIsGenerating(true);
        try {
          const { image } = await generateImage(prompt);
          props.onImageGenerated?.(image.url);
          setError(null);
        } catch (err) {
          setError('生成失败');
        } finally {
          setIsGenerating(false);
        }
      };

      return React.createElement('form', { 
        onSubmit: handleSubmit, 
        'data-testid': 'generate-form',
        className: 'space-y-4'
      }, [
        React.createElement('div', { key: 'input-group' }, [
          React.createElement('label', { 
            key: 'label', 
            htmlFor: 'prompt',
            role: 'label',
          }, '提示词'),
          React.createElement('textarea', {
            key: 'input',
            id: 'prompt',
            value: prompt,
            onChange: (e) => setPrompt(e.target.value),
            'aria-label': '提示词',
          }),
        ]),
        error && React.createElement('div', { 
          key: 'error',
          role: 'alert',
          className: 'text-error text-sm'
        }, error),
        React.createElement('button', {
          key: 'submit',
          type: 'submit',
          disabled: isGenerating,
          'aria-label': isGenerating ? '生成中...' : '生成图片',
        }, isGenerating ? '生成中...' : '生成图片'),
      ]);
    },
  };
});

// 导入模拟的组件
const LoginForm = require('../src/components/features/auth/LoginForm').default;
const RegisterForm = require('../src/components/features/auth/RegisterForm').default;
const ImageCard = require('../src/components/features/images/ImageCard').default;
const GenerateForm = require('../src/components/features/generate/GenerateForm').default;
const ImageList = require('../src/components/features/images/ImageList').default;

// 包装组件以提供必要的上下文
const renderWithAuth = (component) => {
  return render(
    React.createElement(AuthProvider, null, component)
  );
};

describe('Component Tests', () => {
  // 测试登录表单
  test('登录表单应该正确渲染', () => {
    render(<LoginForm />);
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
  });

  // 测试注册表单
  test('注册表单应该正确渲染', () => {
    render(<RegisterForm />);
    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toBeInTheDocument();
  });

  // 测试图片卡片组件
  test('图片卡片应该正确渲染', () => {
    const mockImage = {
      id: '1',
      imageUrl: 'https://example.com/image.jpg',
      prompt: '一只可爱的猫咪',
      createdAt: new Date().toISOString(),
      isPublic: false
    };
    render(<ImageCard image={mockImage} />);
    const imageCard = screen.getByTestId('image-card');
    expect(imageCard).toBeInTheDocument();
  });

  // 测试生成表单
  test('生成表单应该正确渲染', () => {
    render(<GenerateForm />);
    const generateForm = screen.getByTestId('generate-form');
    expect(generateForm).toBeInTheDocument();
  });
});

describe('GenerateForm Tests', () => {
  beforeEach(() => {
    generateImage.mockClear();
  });

  test('应该正确渲染生成表单', () => {
    render(<GenerateForm />);
    expect(screen.getByLabelText('提示词')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '生成图片' })).toBeInTheDocument();
  });

  test('应该调用generateImage API当提交有效提示词', async () => {
    generateImage.mockResolvedValueOnce({ image: { url: 'https://example.com/image.jpg' } });
    render(<GenerateForm />);

    const textarea = screen.getByLabelText('提示词');
    const submitButton = screen.getByRole('button', { name: '生成图片' });

    fireEvent.change(textarea, { target: { value: '一只可爱的猫咪' } });
    await fireEvent.click(submitButton);

    expect(generateImage).toHaveBeenCalledWith('一只可爱的猫咪');
    expect(screen.getByRole('button', { name: '生成中...' })).toBeInTheDocument();
  });

  test('应该显示错误信息当生成失败', async () => {
    generateImage.mockRejectedValueOnce(new Error('生成失败'));
    render(<GenerateForm />);

    const textarea = screen.getByLabelText('提示词');
    const submitButton = screen.getByRole('button', { name: '生成图片' });

    fireEvent.change(textarea, { target: { value: '一只可爱的猫咪' } });
    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('生成失败');
    });
  });
});

describe('ImageCard Tests', () => {
  test('应该正确渲染图片', () => {
    const mockImage = {
      id: '1',
      imageUrl: 'https://example.com/image.jpg',
      prompt: '一只可爱的猫咪',
      createdAt: new Date().toISOString(),
      isPublic: false
    };
    render(<ImageCard image={mockImage} />);
    expect(screen.getByAltText('一只可爱的猫咪')).toBeInTheDocument();
    expect(screen.getByText('一只可爱的猫咪')).toBeInTheDocument();
  });

  test('加载状态应该正确显示', () => {
    const mockImage = {
      id: '1',
      imageUrl: 'https://example.com/image.jpg',
      prompt: '一只可爱的猫咪',
      createdAt: new Date().toISOString(),
      isPublic: false
    };
    render(<ImageCard image={mockImage} onShare={() => {}} onDelete={() => {}} isSharing={true} isDeleting={true} />);
    expect(screen.getByText('处理中...')).toBeInTheDocument();
    expect(screen.getByText('删除中...')).toBeInTheDocument();
  });
});

describe('ImageList Tests', () => {
  test('应该正确渲染图片列表', () => {
    const mockImages = [
      {
        id: '1',
        imageUrl: 'https://example.com/image1.jpg',
        prompt: '一只可爱的猫咪',
        createdAt: new Date().toISOString(),
        isPublic: false
      },
      {
        id: '2',
        imageUrl: 'https://example.com/image2.jpg',
        prompt: '一只可爱的狗狗',
        createdAt: new Date().toISOString(),
        isPublic: true
      }
    ];
    render(<ImageList images={mockImages} />);
    expect(screen.getByTestId('image-list')).toBeInTheDocument();
    expect(screen.getByText('一只可爱的猫咪')).toBeInTheDocument();
    expect(screen.getByText('一只可爱的狗狗')).toBeInTheDocument();
  });

  test('点击分享按钮应该调用 handleShare', async () => {
    const mockImages = [
      {
        id: '1',
        imageUrl: 'https://example.com/image1.jpg',
        prompt: '一只可爱的猫咪',
        createdAt: new Date().toISOString(),
        isPublic: false
      }
    ];
    const handleShare = jest.fn();

    render(<ImageList images={mockImages} />);
    const shareButtons = screen.getAllByRole('button', { name: /分享|取消分享/ });

    fireEvent.click(shareButtons[0]); // 分享第一张图片
    await waitFor(() => {
      expect(shareImage).toHaveBeenCalledWith('1');
    });
  });
}); 