import React, { useState } from 'react';

interface ImageFilterControlsProps {
  onApplyFilter: (filters: ImageFilters) => void;
  initialFilters?: ImageFilters;
  imageUrl?: string;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  filter?: string;
}

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  filter: 'none'
};

const PRESET_FILTERS = [
  { name: '原始', value: 'none', preview: '' },
  { name: '黑白', value: 'grayscale(100%)', preview: 'grayscale(100%)' },
  { name: '复古', value: 'sepia(70%)', preview: 'sepia(70%)' },
  { name: '冷色调', value: 'saturate(1.5) hue-rotate(180deg)', preview: 'saturate(1.5) hue-rotate(180deg)' },
  { name: '暖色调', value: 'sepia(30%) saturate(1.5) hue-rotate(-30deg)', preview: 'sepia(30%) saturate(1.5) hue-rotate(-30deg)' },
  { name: '梦幻', value: 'brightness(1.1) contrast(0.9) saturate(1.2) hue-rotate(-10deg)', preview: 'brightness(1.1) contrast(0.9) saturate(1.2) hue-rotate(-10deg)' },
  { name: '锐化', value: 'contrast(1.5) saturate(1.2)', preview: 'contrast(1.5) saturate(1.2)' },
  { name: '柔焦', value: 'brightness(1.05) contrast(0.9) saturate(0.9)', preview: 'brightness(1.05) contrast(0.9) saturate(0.9)' },
  { name: '戏剧', value: 'contrast(1.5) brightness(0.9) saturate(1.5)', preview: 'contrast(1.5) brightness(0.9) saturate(1.5)' },
];

const ImageFilterControls: React.FC<ImageFilterControlsProps> = ({ 
  onApplyFilter,
  initialFilters = DEFAULT_FILTERS,
  imageUrl
}) => {
  const [filters, setFilters] = useState<ImageFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState<'adjustments' | 'presets'>('presets');
  const [previewFilter, setPreviewFilter] = useState<string | null>(null);

  const handleFilterChange = (name: keyof ImageFilters, value: number | string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onApplyFilter(newFilters);
  };

  const handlePresetClick = (filterValue: string) => {
    const newFilters = { ...DEFAULT_FILTERS, filter: filterValue };
    setFilters(newFilters);
    onApplyFilter(newFilters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onApplyFilter(DEFAULT_FILTERS);
  };

  const getCSSFilterString = (filters: ImageFilters): string => {
    const { brightness, contrast, saturation, blur, filter } = filters;
    
    let cssFilters = `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100}) blur(${blur}px)`;
    
    if (filter && filter !== 'none') {
      cssFilters += ` ${filter}`;
    }
    
    return cssFilters;
  };

  return (
    <div className="p-4 bg-surface rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-text-primary">图像调整</h3>
        <button
          onClick={handleReset}
          className="text-sm text-primary hover:text-primary-dark"
        >
          重置
        </button>
      </div>
      
      <div className="flex border-b border-gray-200">
        <button 
          className={`pb-2 px-4 text-sm font-medium ${activeTab === 'presets' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
          onClick={() => setActiveTab('presets')}
        >
          预设滤镜
        </button>
        <button
          className={`pb-2 px-4 text-sm font-medium ${activeTab === 'adjustments' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
          onClick={() => setActiveTab('adjustments')}
        >
          基本调整
        </button>
      </div>
      
      {activeTab === 'adjustments' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">亮度: {filters.brightness}%</label>
            <input
              type="range"
              min="50"
              max="150"
              value={filters.brightness}
              onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">对比度: {filters.contrast}%</label>
            <input
              type="range"
              min="50"
              max="150"
              value={filters.contrast}
              onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">饱和度: {filters.saturation}%</label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.saturation}
              onChange={(e) => handleFilterChange('saturation', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">模糊: {filters.blur}px</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.blur}
              onChange={(e) => handleFilterChange('blur', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <div className="py-2">
          <div className="grid grid-cols-3 gap-3">
            {PRESET_FILTERS.map((presetFilter) => (
              <button
                key={presetFilter.value}
                onClick={() => handlePresetClick(presetFilter.value)}
                onMouseEnter={() => setPreviewFilter(presetFilter.preview)}
                onMouseLeave={() => setPreviewFilter(null)}
                className={`p-0 rounded-md overflow-hidden ${filters.filter === presetFilter.value ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="relative pb-[100%]">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={presetFilter.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: presetFilter.preview }}
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 bg-gray-200 flex items-center justify-center"
                      style={{ filter: presetFilter.preview }}
                    >
                      <span className="text-xs text-gray-600">预览</span>
                    </div>
                  )}
                </div>
                <div className="p-1 text-center bg-gray-100">
                  <span className="text-xs font-medium">{presetFilter.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        CSS滤镜值: <code className="bg-gray-100 px-1 py-0.5 rounded">{getCSSFilterString(filters)}</code>
      </div>
    </div>
  );
};

export default ImageFilterControls; 