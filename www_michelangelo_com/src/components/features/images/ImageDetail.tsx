import React from 'react';
import Image from 'next/image';

interface ImageDetailProps {
  image: {
    id: string;
    url: string;
    prompt: string;
    createdAt: string;
    isPublic?: boolean;
  };
  onShare?: (id: string) => void;
  onUnshare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClose?: () => void;
  isSubmitting?: boolean;
}

const ImageDetail: React.FC<ImageDetailProps> = ({ 
  image, 
  onShare, 
  onUnshare, 
  onDelete, 
  onClose,
  isSubmitting = false
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative aspect-square w-full mb-4">
        <img
          src={image.url}
          alt={image.prompt}
          className="object-cover rounded-lg w-full h-full"
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">提示词</h2>
          <div className="space-x-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                关闭
              </button>
            )}
            {onShare && !image.isPublic && (
              <button
                onClick={() => onShare(image.id)}
                className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? '分享中...' : '分享'}
              </button>
            )}
            {onUnshare && image.isPublic && (
              <button
                onClick={() => onUnshare(image.id)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? '取消分享中...' : '取消分享'}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(image.id)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? '删除中...' : '删除'}
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-600">{image.prompt}</p>
        <div className="text-sm text-gray-500">
          创建时间: {new Date(image.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ImageDetail; 