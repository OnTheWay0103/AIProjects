import React from 'react';
import Image from 'next/image';
import type { GeneratedImage } from '@/types/image/index';

interface ImageCardProps {
  image: GeneratedImage;
  onShare?: (id: string, isPublic: boolean) => void;
  onDelete?: (id: string) => void;
  isSharing?: boolean;
  isDeleting?: boolean;
}

export default function ImageCard({
  image,
  onShare,
  onDelete,
  isSharing = false,
  isDeleting = false
}: ImageCardProps) {
  return (
    <div className="relative group" data-testid="image-card">
      <div className="relative aspect-square">
        {image.imageUrl ? (
          <Image
            src={image.imageUrl}
            alt={image.prompt}
            className="object-cover rounded-lg w-full h-full"
            width={300}
            height={300}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-text-secondary">无图片</span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-2">
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

      <div className="mt-2">
        <p className="text-sm text-text-primary line-clamp-2">{image.prompt}</p>
        <p className="text-xs text-text-secondary mt-1">
          {new Date(image.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
} 