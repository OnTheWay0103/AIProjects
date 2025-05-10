import React from 'react';
import type { GeneratedImage } from '@/types/image/index';
import ImageCard from './ImageCard';
import { shareImage, unshareImage } from '@/lib/api/api';

interface ImageListProps {
  images: GeneratedImage[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (id: string) => void;
  isDeleting?: string | null;
  showActions?: boolean;
  viewMode?: 'grid' | 'masonry';
}

export default function ImageList({
  images,
  isLoading = false,
  error = null,
  onDelete,
  isDeleting = null,
  showActions = true,
  viewMode = 'grid',
}: ImageListProps) {
  const [isSharing, setIsSharing] = React.useState<string | null>(null);

  const handleShare = async (id: string, isPublic: boolean) => {
    setIsSharing(id);
    try {
      if (isPublic) {
        await unshareImage(id);
      } else {
        await shareImage(id);
      }
    } finally {
      setIsSharing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-error text-center">{error}</div>;
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center text-text-secondary py-12">
        <p className="text-lg">暂无图片</p>
      </div>
    );
  }

  // 根据视图模式应用不同的样式类
  const gridClass = viewMode === 'grid' 
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
    : "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6";

  return (
    <div className={gridClass} data-testid="image-list">
      {images.map((image) => (
        <div key={image.id} className={viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''}>
          <ImageCard
            image={image}
            onShare={showActions ? handleShare : undefined}
            onDelete={showActions ? onDelete : undefined}
            isSharing={isSharing === image.id}
            isDeleting={isDeleting === image.id}
          />
        </div>
      ))}
    </div>
  );
} 