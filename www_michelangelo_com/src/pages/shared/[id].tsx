import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getImage, getPublicImages } from '@/lib/api/api';
import type { GeneratedImage } from '@/types/image/index';
import ImageCard from '@/components/features/images/ImageCard';

export default function ImageDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [similarImages, setSimilarImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));
  
  useEffect(() => {
    if (!router.isReady || !id) return;
    
    const loadImageData = async () => {
      try {
        setIsLoading(true);
        
        // 开发环境使用模拟数据
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            const mockImage: GeneratedImage = {
              id: typeof id === 'string' ? id : id[0],
              prompt: '一只可爱的橘猫在阳光下打盹，背景是绿色的草地',
              imageUrl: `https://picsum.photos/seed/detail${id}/800/800`,
              createdAt: new Date().toISOString(),
              isPublic: true
            };
            
            setImage(mockImage);
            
            // 模拟相似图片
            const mockSimilarImages: GeneratedImage[] = Array.from({ length: 8 }).map((_, index) => ({
              id: `similar-${index}`,
              prompt: index % 2 === 0 
                ? '一只可爱的橘猫在阳光下打盹，背景是绿色的草地' 
                : '未来城市的科幻景观，高耸的建筑和飞行的汽车',
              imageUrl: `https://picsum.photos/seed/similar${index}/500/500`,
              createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
              isPublic: true
            }));
            
            setSimilarImages(mockSimilarImages);
            setIsLoading(false);
          }, 1000);
          return;
        }
        
        // 实际环境调用API
        const { image: imageData } = await getImage(typeof id === 'string' ? id : id[0]);
        setImage(imageData);
        
        // 获取相似图片
        const { images } = await getPublicImages();
        setSimilarImages(images.filter(img => img.id !== imageData.id).slice(0, 8));
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '加载失败';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImageData();
  }, [router.isReady, id]);
  
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };
  
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({
          title: image?.prompt || 'Mikey.app分享的图片',
          text: `查看这张由Mikey.app生成的AI图片：${image?.prompt || ''}`,
          url: url
        }).catch(err => {
          console.error('分享失败:', err);
        });
      } else {
        navigator.clipboard.writeText(url).then(() => {
          alert('链接已复制到剪贴板!');
        });
      }
    }
  };

  return (
    <>
      <Head>
        <title>{image ? `${image.prompt.substring(0, 30)}... - Mikey.app` : 'AI图像详情 - Mikey.app'}</title>
        <meta name="description" content={image?.prompt || 'Mikey.app AI生成图像'} />
        {image && (
          <>
            <meta property="og:title" content={`${image.prompt.substring(0, 50)}...`} />
            <meta property="og:description" content="由Mikey.app生成的AI图像" />
            <meta property="og:image" content={image.imageUrl} />
            <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
          </>
        )}
      </Head>

      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/">
                  <span className="text-2xl font-bold text-primary cursor-pointer">Mikey</span>
                </Link>
              </div>
              <div>
                <Link href="/generate">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark">
                    创建我的图像
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-surface p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-text-primary mb-4">出错了</h2>
                <p className="text-text-secondary">{error}</p>
                <div className="mt-6">
                  <Link href="/explore">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark">
                      返回探索页面
                    </button>
                  </Link>
                </div>
              </div>
            ) : image && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* 图片区域 */}
                  <div className="lg:col-span-2">
                    <div className="bg-surface p-6 rounded-lg shadow-sm">
                      <div className="aspect-square w-full bg-background-secondary rounded-lg overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.prompt}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 信息区域 */}
                  <div className="lg:col-span-1">
                    <div className="bg-surface p-6 rounded-lg shadow-sm">
                      <h1 className="text-xl font-bold text-text-primary mb-4 line-clamp-3">
                        {image.prompt}
                      </h1>
                      
                      <div className="mb-6">
                        <p className="text-sm text-text-secondary mb-2">
                          创建于 {new Date(image.createdAt).toLocaleString()}
                        </p>
                        <div className="flex space-x-4 text-text-secondary text-sm">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{Math.floor(Math.random() * 1000)}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{likeCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3">
                        <button 
                          onClick={handleLike}
                          className={`flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                            liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white text-text-primary hover:bg-gray-50'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{liked ? '已点赞' : '点赞'}</span>
                        </button>
                        
                        <button 
                          onClick={handleShare}
                          className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-text-primary hover:bg-gray-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          <span>分享</span>
                        </button>
                        
                        <Link href="/generate">
                          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-primary text-white hover:bg-primary-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>创建类似的图像</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 相似图片 */}
                {similarImages.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-xl font-bold text-text-primary mb-6">你可能也喜欢</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {similarImages.map(img => (
                        <Link key={img.id} href={`/shared/${img.id}`}>
                          <div className="cursor-pointer">
                            <ImageCard image={img} showDetails={false} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
        
        <footer className="bg-surface mt-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
              <p className="text-base text-text-secondary">&copy; {new Date().getFullYear()} Mikey.app. 保留所有权利。</p>
              <div className="mt-4 flex space-x-6">
                <a href="#" className="text-text-secondary hover:text-text-primary">
                  隐私政策
                </a>
                <a href="#" className="text-text-secondary hover:text-text-primary">
                  使用条款
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 