import React, { useState } from 'react';

interface ShareImageModalProps {
  imageUrl: string;
  prompt: string;
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string, isPublic: boolean) => void;
}

const ShareImageModal: React.FC<ShareImageModalProps> = ({
  imageUrl,
  prompt,
  isOpen,
  onClose,
  onShare
}) => {
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;
  
  const shareUrl = `${window.location.origin}/shared?img=${encodeURIComponent(imageUrl)}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShare = (platform: string) => {
    onShare(platform, isPublic);
    
    // 根据不同平台打开不同的分享链接
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent('使用 Mikey.app 创建的 AI 图像')}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'weibo':
        shareLink = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('使用 Mikey.app 创建的 AI 图像')}`;
        break;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  分享图片
                </h3>
                
                <div className="mt-4">
                  <div className="aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={prompt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center mb-4">
                      <input 
                        id="public-checkbox" 
                        type="checkbox"
                        className="w-4 h-4 text-primary focus:ring-primary"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <label htmlFor="public-checkbox" className="ml-2 text-sm text-gray-700">
                        公开分享到社区展示
                      </label>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex rounded-md shadow-sm">
                        <input
                          type="text"
                          value={shareUrl}
                          readOnly
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md text-sm border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                        >
                          {copied ? "已复制" : "复制链接"}
                        </button>
                      </div>
                      
                      <div className="flex justify-center space-x-4 mt-4">
                        <button
                          type="button"
                          onClick={() => handleShare('weibo')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          分享到微博
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShare('twitter')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500"
                        >
                          分享到 Twitter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShare('facebook')}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          分享到 Facebook
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareImageModal; 