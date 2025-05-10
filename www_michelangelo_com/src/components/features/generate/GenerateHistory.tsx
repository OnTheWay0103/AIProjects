import React, { useState } from 'react';
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
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<boolean>(false);

  if (history.length === 0) {
    return (
      <div className="text-center text-text-secondary py-8">
        暂无历史记录
      </div>
    );
  }

  // 根据过滤条件筛选历史记录
  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(img => img.prompt.toLowerCase().includes(filter.toLowerCase()));
  
  // 决定显示的历史记录数量
  const displayCount = expanded ? filteredHistory.length : Math.min(maxItems, filteredHistory.length);
  const displayHistory = filteredHistory.slice(0, displayCount);

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
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={filter !== 'all' ? filter : ''}
              onChange={(e) => setFilter(e.target.value || 'all')}
              placeholder="搜索历史记录"
              className="text-sm py-1 px-2 border border-gray-300 rounded-md"
            />
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {onClear && (
            <button 
              onClick={onClear}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              清除历史
            </button>
          )}
        </div>
      </div>
      
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayHistory.map((image) => (
          <li
            key={image.id}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelect?.(image)}
            role="listitem"
          >
            <div className="relative aspect-square bg-background-secondary rounded-lg overflow-hidden">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              {image.isPublic && (
                <span className="absolute top-2 right-2 bg-primary text-white text-xs px-1 py-0.5 rounded">
                  已分享
                </span>
              )}
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
      
      {filteredHistory.length > maxItems && !expanded && (
        <div className="text-center">
          <button 
            onClick={() => setExpanded(true)}
            className="text-sm text-primary hover:text-primary-dark"
          >
            显示更多历史记录
          </button>
        </div>
      )}
      
      {expanded && filteredHistory.length > maxItems && (
        <div className="text-center">
          <button 
            onClick={() => setExpanded(false)}
            className="text-sm text-primary hover:text-primary-dark"
          >
            收起
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateHistory; 