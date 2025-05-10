import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getPublicImages } from '@/lib/api/api';
import type { GeneratedImage } from '@/types/image/index';
import Toast from '@/components/ui/Toast';
import ImageList from '@/components/features/images/ImageList';
import Link from 'next/link';

// 样式标签
const STYLE_TAGS = [
  { id: 'all', name: '全部' },
  { id: 'realistic', name: '写实' },
  { id: 'anime', name: '动漫' },
  { id: 'oil', name: '油画' },
  { id: 'digital', name: '数字艺术' },
  { id: 'watercolor', name: '水彩' },
  { id: 'sketch', name: '素描' },
];

// 排序选项
const SORT_OPTIONS = [
  { id: 'newest', name: '最新' },
  { id: 'popular', name: '最受欢迎' },
];

export default function Explore() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  
  // 筛选和排序状态
  const [activeTag, setActiveTag] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      // 在实际应用中，这里应该根据选定的标签和排序选项来调用不同的API
      const { images } = await getPublicImages();
      setImages(images);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败';
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟数据
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const mockImages: GeneratedImage[] = Array.from({ length: 20 }).map((_, index) => ({
          id: `mock-${index}`,
          prompt: index % 3 === 0 
            ? '一只可爱的橘猫在阳光下打盹，背景是绿色的草地' 
            : index % 3 === 1
              ? '未来城市的科幻景观，高耸的建筑和飞行的汽车'
              : '水彩风格的山水画，雾气缭绕的群山，有小木屋和流水',
          imageUrl: `https://picsum.photos/seed/mockimg${index}/500/500`,
          createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
          isPublic: true
        }));
        setImages(mockImages);
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  // 处理筛选和排序逻辑
  const filteredImages = images.filter(image => {
    if (activeTag !== 'all') {
      // 实际应用中应该根据图片的风格标签来筛选
      return true; // 现在暂时返回所有图片
    }
    
    if (searchInput) {
      return image.prompt.toLowerCase().includes(searchInput.toLowerCase());
    }
    
    return true;
  });

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'popular') {
      // 实际应用中应该根据图片的点赞数或浏览量来排序
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <>
      <Head>
        <title>探索社区 - Mikey.app</title>
        <meta name="description" content="探索Mikey.app社区中分享的AI生成图像" />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold text-text-primary mb-4 md:mb-0" data-testid="page-title">探索社区</h1>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索提示词..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
              
              <Link href="/generate">
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                  创建图像
                </button>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            {/* 标签筛选 */}
            <div className="flex flex-wrap gap-2">
              {STYLE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(tag.id)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeTag === tag.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            
            {/* 排序和视图选项 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">排序:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  aria-label="网格视图"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-1 rounded ${viewMode === 'masonry' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  aria-label="瀑布流视图"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" role="progressbar" />
            </div>
          ) : sortedImages.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-text-primary">暂无图片</h3>
              <p className="mt-1 text-text-secondary">目前社区中还没有分享的图片</p>
              <div className="mt-6">
                <Link href="/generate">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                    创建并分享第一张图片
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <ImageList
              images={sortedImages}
              showActions={false}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
} 