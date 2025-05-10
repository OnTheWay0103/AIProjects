import React from 'react';
import type { GeneratedImage } from '@/types/image/index';

interface GenerateHistoryProps {
  history: GeneratedImage[];
  onSelect?: (image: GeneratedImage) => void;
  onClear?: () => void;
  maxItems?: number;
}

const GenerateHistory: React.FC<GenerateHistoryProps> = ({ 
  history, 
  onSelect, 
  onClear,
  maxItems = 5 
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-text-secondary py-8">
        暂无历史记录
      </div>
    );
  }

  const displayHistory = history.slice(0, maxItems);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">生成历史</h2>
        {onClear && (
          <button 
            onClick={onClear}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            清除历史
          </button>
        )}
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayHistory.map((image) => (
          <li
            key={image.id}
            className="cursor-pointer"
            onClick={() => onSelect?.(image)}
            role="listitem"
          >
            <div className="relative aspect-square">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="object-cover rounded-lg w-full h-full"
              />
            </div>
            <p className="text-sm text-text-secondary mt-2 line-clamp-2">
              {image.prompt}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {formatDate(image.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenerateHistory; 