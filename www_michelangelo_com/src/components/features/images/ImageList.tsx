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
}

export default function ImageList({
  images,
  isLoading = false,
  error = null,
  onDelete,
  isDeleting = null,
  showActions = true,
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="image-list">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onShare={showActions ? handleShare : undefined}
          onDelete={showActions ? onDelete : undefined}
          isSharing={isSharing === image.id}
          isDeleting={isDeleting === image.id}
        />
      ))}
    </div>
  );
} 