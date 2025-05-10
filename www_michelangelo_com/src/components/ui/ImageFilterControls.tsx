import React, { useState } from 'react';

export interface ImageFilters {
  brightness: number;  // 范围 0-200, 默认 100
  contrast: number;    // 范围 0-200, 默认 100
  saturation: number;  // 范围 0-200, 默认 100
  blur: number;        // 范围 0-10, 默认 0
  filter: string;      // CSS 滤镜名称, 例如 'sepia', 'grayscale', 'invert', 'none'
}

interface ImageFilterControlsProps {
  filters: ImageFilters;
  onFilterChange: (filters: ImageFilters) => void;
}

const ImageFilterControls: React.FC<ImageFilterControlsProps> = ({
  filters,
  onFilterChange
}) => {
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, filterType: keyof Omit<ImageFilters, 'filter'>) => {
    const value = parseInt(e.target.value, 10);
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      filter: e.target.value
    });
  };

  const handleReset = () => {
    onFilterChange({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      filter: 'none'
    });
  };

  return (
    <div className="p-4 bg-surface rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-text-primary">调整图像</h3>
        <button 
          onClick={handleReset}
          className="text-xs text-primary hover:text-primary-dark"
        >
          重置调整
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <label htmlFor="brightness" className="block text-sm font-medium text-text-secondary">
              亮度 ({filters.brightness}%)
            </label>
            <span className="text-xs text-text-tertiary">{filters.brightness}%</span>
          </div>
          <input 
            type="range" 
            id="brightness" 
            min="0" 
            max="200" 
            step="5"
            value={filters.brightness} 
            onChange={(e) => handleRangeChange(e, 'brightness')}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <label htmlFor="contrast" className="block text-sm font-medium text-text-secondary">
              对比度
            </label>
            <span className="text-xs text-text-tertiary">{filters.contrast}%</span>
          </div>
          <input 
            type="range" 
            id="contrast" 
            min="0" 
            max="200" 
            step="5"
            value={filters.contrast} 
            onChange={(e) => handleRangeChange(e, 'contrast')}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <label htmlFor="saturation" className="block text-sm font-medium text-text-secondary">
              饱和度
            </label>
            <span className="text-xs text-text-tertiary">{filters.saturation}%</span>
          </div>
          <input 
            type="range" 
            id="saturation" 
            min="0" 
            max="200" 
            step="5"
            value={filters.saturation} 
            onChange={(e) => handleRangeChange(e, 'saturation')}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <label htmlFor="blur" className="block text-sm font-medium text-text-secondary">
              模糊度
            </label>
            <span className="text-xs text-text-tertiary">{filters.blur}px</span>
          </div>
          <input 
            type="range" 
            id="blur" 
            min="0" 
            max="10" 
            step="0.5"
            value={filters.blur} 
            onChange={(e) => handleRangeChange(e, 'blur')}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
        </div>
        
        <div>
          <label htmlFor="filter" className="block text-sm font-medium text-text-secondary mb-1">
            滤镜效果
          </label>
          <select
            id="filter"
            value={filters.filter}
            onChange={handleFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="none">无滤镜</option>
            <option value="sepia(0.7)">复古</option>
            <option value="grayscale(1)">黑白</option>
            <option value="invert(0.8)">反色</option>
            <option value="hue-rotate(90deg)">色相旋转</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ImageFilterControls; 