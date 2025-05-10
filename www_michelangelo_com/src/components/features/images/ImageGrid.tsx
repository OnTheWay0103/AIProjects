import React from 'react';
import ImageCard from './ImageCard';
import type { GeneratedImage } from '@/types/image/index';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageClick?: (image: GeneratedImage) => void;
  onShare?: (id: string, isPublic: boolean) => Promise<void>;
  onDelete?: (id: string) => void;
  isSharing?: boolean;
  isDeleting?: boolean;
  columns?: number;
  gap?: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
  images, 
  onImageClick,
  onShare,
  onDelete,
  isSharing,
  isDeleting,
  columns = 4,
  gap = 6
}) => {
  if (images.length === 0) {
    return (
      <div className="text-center text-text-secondary py-8">
        暂无图片
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  const gridGaps = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <ul 
      className={`grid ${gridCols[columns as keyof typeof gridCols]} ${gridGaps[gap as keyof typeof gridGaps]}`}
      role="list"
    >
      {images.map((image) => (
        <li key={image.id}>
          <div onClick={() => onImageClick?.(image)}>
            <ImageCard
              image={image}
              onShare={onShare}
              onDelete={onDelete}
              isSharing={isSharing}
              isDeleting={isDeleting}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ImageGrid; 