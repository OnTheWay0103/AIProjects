import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { GeneratedImage } from '@/types/image/index';

interface ImageCardProps {
  image: GeneratedImage;
  onShare?: (id: string, isPublic: boolean) => void;
  onDelete?: (id: string) => void;
  isSharing?: boolean;
  isDeleting?: boolean;
  showDetails?: boolean;
}

export default function ImageCard({
  image,
  onShare,
  onDelete,
  isSharing = false,
  isDeleting = false,
  showDetails = true
}: ImageCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50));
  const [isHovered, setIsHovered] = useState(false);
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };
  
  const truncatePrompt = (text: string, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const detailsUrl = `/shared?img=${encodeURIComponent(image.imageUrl)}`;

  return (
    <div 
      className="relative group rounded-lg overflow-hidden"
      data-testid="image-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={detailsUrl}>
        <div className="relative aspect-square">
          {image.imageUrl ? (
            <img
              src={image.imageUrl}
              alt={image.prompt}
              className="object-cover rounded-lg w-full h-full transition-transform duration-300 group-hover:scale-105"
              width={300}
              height={300}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-text-secondary">无图片</span>
            </div>
          )}
          
          {/* 点赞按钮 - 永远可见，但悬浮时突出显示 */}
          <button 
            onClick={handleLike}
            className={`absolute bottom-3 right-3 flex items-center space-x-1 rounded-full px-2 py-1 transition-colors ${
              isHovered || liked 
                ? liked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-900 hover:bg-red-100' 
                : 'bg-black/30 text-white'
            }`}
            aria-label={liked ? '取消点赞' : '点赞'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${liked ? 'fill-white' : 'stroke-current fill-none'}`} 
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span className="text-xs font-medium">{likeCount}</span>
          </button>
        </div>
      </Link>

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-2">
          <Link 
            href={detailsUrl}
            className="px-3 py-1 bg-white text-black rounded hover:bg-opacity-90"
          >
            查看详情
          </Link>
          
          {onShare && (
            <button
              onClick={() => onShare(image.id, image.isPublic)}
              disabled={isSharing}
              className="px-3 py-1 bg-white text-black rounded hover:bg-opacity-90 disabled:opacity-50"
              aria-label={isSharing ? '处理中...' : (image.isPublic ? '取消分享' : '分享')}
            >
              {isSharing ? '处理中...' : (image.isPublic ? '取消分享' : '分享')}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(image.id)}
              disabled={isDeleting}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              aria-label={isDeleting ? '删除中...' : '删除'}
            >
              {isDeleting ? '删除中...' : '删除'}
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-2">
          <p className="text-sm text-text-primary line-clamp-2">{truncatePrompt(image.prompt)}</p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-text-secondary">
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
            <div className="flex items-center text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs">{Math.floor(Math.random() * 1000)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 