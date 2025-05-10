import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/hooks/auth/useAuth';
import GenerateForm from '@/components/features/generate/GenerateForm';
import GenerateHistory from '@/components/features/generate/GenerateHistory';
import GenerateProgress from '@/components/features/generate/GenerateProgress';
import ImageFilterControls, { ImageFilters } from '@/components/ui/ImageFilterControls';
import ShareImageModal from '@/components/modals/ShareImageModal';
import type { GeneratedImage } from '@/types/image/index';

export default function Generate() {
  const { user } = useAuth();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<GeneratedImage[]>([]);
  const [selectedAspect, setSelectedAspect] = useState('square');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentStyle, setCurrentStyle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [imageFilters, setImageFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    filter: 'none'
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressComplete, setProgressComplete] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    // 这里应该是获取用户的生成历史记录
    // 由于现在没有真实的API，我们使用模拟数据
    if (user) {
      setIsLoading(true);
      // 模拟API调用
      setTimeout(() => {
        const mockHistory: GeneratedImage[] = [
          {
            id: '1',
            prompt: '一只可爱的橘猫在阳光下打盹，背景是绿色的草地',
            imageUrl: 'https://picsum.photos/seed/cat1/800/800',
            createdAt: new Date().toISOString(),
            isPublic: false
          },
          {
            id: '2',
            prompt: '未来城市的科幻景观，高耸的建筑和飞行的汽车',
            imageUrl: 'https://picsum.photos/seed/city1/800/800',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isPublic: true
          }
        ];
        setGenerationHistory(mockHistory);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const handleImageGenerated = (imageUrl: string, prompt: string, style: string) => {
    setGeneratedImage(imageUrl);
    setCurrentPrompt(prompt);
    setCurrentStyle(style);
    setIsGenerating(false);
    setProgressPercent(100);
    setProgressComplete(true);
    setDownloadReady(true);
    setShowFilters(false);
    
    // 重置滤镜
    setImageFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      filter: 'none'
    });
    
    // 更新生成历史
    const newImage: GeneratedImage = {
      id: Math.random().toString(36).substring(2, 9),
      prompt: prompt,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString(),
      isPublic: false
    };
    
    setGenerationHistory(prev => [newImage, ...prev]);
  };

  const handleSelectImage = (image: GeneratedImage) => {
    setGeneratedImage(image.imageUrl);
    setCurrentPrompt(image.prompt);
    setDownloadReady(true);
    setShowFilters(false);
    
    // 重置滤镜
    setImageFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      filter: 'none'
    });
  };

  const handleClearHistory = () => {
    // 在实际应用中，这应该调用API来清除历史记录
    setGenerationHistory([]);
  };

  const handleGenerateStart = () => {
    setIsGenerating(true);
    setProgressPercent(0);
    setProgressComplete(false);
    setIsCancelled(false);
    setDownloadReady(false);
    setShowFilters(false);
    
    // 模拟进度更新
    const interval = setInterval(() => {
      setProgressPercent(prev => {
        if (prev >= 100 || isCancelled) {
          clearInterval(interval);
          return prev;
        }
        // 越接近100，增长越慢
        const increment = prev < 50 ? 5 : prev < 80 ? 3 : prev < 95 ? 1 : 0.5;
        return Math.min(prev + increment, 99.5);
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    // 创建一个新的canvas来应用滤镜并下载
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 应用CSS滤镜
        const { brightness, contrast, saturation, blur, filter } = imageFilters;
        ctx.filter = `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100}) blur(${blur}px)`;
        if (filter && filter !== 'none') {
          ctx.filter += ` ${filter}`;
        }
        
        ctx.drawImage(img, 0, 0);
        
        // 创建下载链接
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mikey-image-${new Date().getTime()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });
      }
    };
    img.src = generatedImage;
  };

  const handleShare = () => {
    if (!generatedImage) return;
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleShareImage = (platform: string, isPublic: boolean) => {
    console.log(`分享到 ${platform}，是否公开: ${isPublic}`);
    
    // 在实际应用中，如果图片被标记为公开，这里应该调用API
    if (isPublic) {
      // 模拟API调用
      setTimeout(() => {
        alert(`图片已成功分享到${platform}并公开到社区！`);
      }, 1000);
    }
  };

  const handleSave = () => {
    if (!generatedImage || !user) return;
    
    // 在实际应用中，这里应该调用API保存图片
    alert('图片已保存到您的收藏！');
  };
  
  const handleApplyFilter = (filters: ImageFilters) => {
    setImageFilters(filters);
  };
  
  const getFilterStyle = () => {
    if (!generatedImage) return {};
    
    const { brightness, contrast, saturation, blur, filter } = imageFilters;
    let filterValue = `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100}) blur(${blur}px)`;
    
    if (filter && filter !== 'none') {
      filterValue += ` ${filter}`;
    }
    
    return { filter: filterValue };
  };

  const handleCancelGeneration = () => {
    setIsCancelled(true);
    setIsGenerating(false);
    // 在实际应用中，这里应该调用API取消生成
  };

  return (
    <>
      <Head>
        <title>生成图片 - Mikey.app</title>
        <meta name="description" content="使用 AI 生成精美图片" />
      </Head>

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        {/* 测试标记 - 如果能看到这个文本，说明热更新正常工作 */}
        <div className="bg-red-500 text-white p-4 mb-4 text-center">
          测试信息：这是一个测试标记，如果您能看到此消息，说明页面更新正常
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary">
              使用 AI 生成图片
            </h1>
            <p className="mt-2 text-text-secondary">
              输入提示词，让 AI 为您创作精美的图片
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <GenerateForm 
                onImageGenerated={handleImageGenerated} 
                onGenerateStart={handleGenerateStart}
              />
              
              {user && generationHistory.length > 0 && (
                <div className="mt-8">
                  <GenerateHistory 
                    history={generationHistory}
                    onSelect={handleSelectImage}
                    onClear={handleClearHistory}
                    maxItems={6}
                  />
                </div>
              )}
            </div>
            
            <div>
              <div className="bg-surface p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-text-primary mb-4">生成结果</h2>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    <GenerateProgress 
                      progress={progressPercent} 
                      isComplete={progressComplete}
                      onCancel={handleCancelGeneration}
                    />
                    <div className="aspect-square w-full bg-background-secondary rounded-lg mt-4 flex items-center justify-center">
                      <div className="text-text-secondary">
                        正在生成图片，请稍候...
                      </div>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="flex flex-col space-y-2">
                    <div className="relative aspect-square w-full bg-background-secondary rounded-lg overflow-hidden">
                      <img
                        src={generatedImage}
                        alt={currentPrompt}
                        className="object-cover w-full h-full"
                        style={getFilterStyle()}
                      />
                      {downloadReady && (
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-2 bg-white/80 rounded-full hover:bg-white/100 transition-colors"
                            title="编辑图像"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5 3a1 1 0 112 0 1 1 0 01-2 0zm1 3a1 1 0 100 2 1 1 0 000-2zm4-3a1 1 0 112 0 1 1 0 01-2 0zm1 3a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={handleDownload}
                            className="p-2 bg-white/80 rounded-full hover:bg-white/100 transition-colors"
                            title="下载图像"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={handleShare}
                            className="p-2 bg-white/80 rounded-full hover:bg-white/100 transition-colors"
                            title="分享图像"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                          </button>
                          {user && (
                            <button
                              onClick={handleSave}
                              className="p-2 bg-white/80 rounded-full hover:bg-white/100 transition-colors"
                              title="保存到收藏"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {showFilters && (
                      <ImageFilterControls
                        filters={imageFilters}
                        onFilterChange={handleApplyFilter}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-square w-full bg-background-secondary rounded-lg">
                    <p className="text-text-secondary">
                      输入提示词并点击生成按钮，您的图片将显示在这里
                    </p>
                  </div>
                )}
              </div>

              {!user && (
                <div className="mt-6 bg-surface p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-text-primary mb-2">创建账户获取更多功能</h3>
                  <p className="text-text-secondary mb-4">
                    注册账户后，您可以保存生成的图片、查看历史记录，以及获取更多高级功能。
                  </p>
                  <button className="px-4 py-2 bg-primary text-white rounded-md">
                    注册账户
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {generatedImage && (
        <ShareImageModal
          imageUrl={generatedImage}
          prompt={currentPrompt}
          isOpen={showShareModal}
          onClose={handleCloseShareModal}
          onShare={handleShareImage}
        />
      )}
    </>
  );
} 