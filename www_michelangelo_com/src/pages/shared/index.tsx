import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function SharedImage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { img } = router.query;
    
    if (!img) {
      setError('未找到图片，请检查链接是否完整');
      setIsLoading(false);
      return;
    }
    
    // 在实际应用中，应该使用API验证图片URL的有效性
    // 这里简单地设置图片URL
    try {
      const imgString = typeof img === 'string' ? img : img[0];
      setImageUrl(decodeURIComponent(imgString));
      setIsLoading(false);
    } catch (err) {
      setError('图片链接无效');
      setIsLoading(false);
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Mikey.app - 分享的 AI 图像</title>
        <meta name="description" content="查看使用 Mikey.app 创建的 AI 图像" />
        {imageUrl && (
          <>
            <meta property="og:title" content="使用 Mikey.app 创建的 AI 图像" />
            <meta property="og:description" content="通过 Mikey.app 人工智能生成的图像" />
            <meta property="og:image" content={imageUrl} />
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
          <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-surface p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-text-primary mb-4">出错了</h2>
                <p className="text-text-secondary">{error}</p>
                <div className="mt-6">
                  <Link href="/">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark">
                      返回首页
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-surface p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-text-primary mb-4">分享的图像</h2>
                
                <div className="aspect-square w-full bg-background-secondary rounded-lg overflow-hidden">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="分享的图像"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-text-secondary mb-4 sm:mb-0">
                    这是使用 <span className="font-semibold">Mikey.app</span> AI 图像生成器创建的图像
                  </p>
                  
                  <Link href="/generate">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark">
                      创建我的图像
                    </button>
                  </Link>
                </div>
              </div>
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