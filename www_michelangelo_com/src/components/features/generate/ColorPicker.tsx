import React, { useState } from 'react';

interface Color {
  name: string;
  value: string;
  description: string;
}

const PRESET_COLORS: Color[] = [
  { name: '自动', value: 'auto', description: '由AI自动选择合适的色彩' },
  { name: '明亮', value: 'bright', description: '鲜艳明亮的色彩' },
  { name: '柔和', value: 'soft', description: '柔和淡雅的色彩' },
  { name: '单色', value: 'monochrome', description: '单色调效果' },
  { name: '对比强', value: 'highContrast', description: '高对比度色彩' },
  { name: '暖色调', value: 'warm', description: '偏暖的黄红色调' },
  { name: '冷色调', value: 'cool', description: '偏冷的蓝绿色调' },
  { name: '复古', value: 'vintage', description: '复古怀旧色调' },
  { name: '电影感', value: 'cinematic', description: '电影般的色彩处理' },
];

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onChange }) => {
  const [hoveredColor, setHoveredColor] = useState<Color | null>(null);

  const handleColorSelect = (colorValue: string) => {
    onChange(colorValue);
  };

  // 获取当前选中颜色的描述
  const getSelectedColorDescription = () => {
    const selected = PRESET_COLORS.find(color => color.value === selectedColor);
    return selected ? selected.description : '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          色彩风格
        </label>
        <span className="text-xs text-gray-500">
          {getSelectedColorDescription()}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => handleColorSelect(color.value)}
            onMouseEnter={() => setHoveredColor(color)}
            onMouseLeave={() => setHoveredColor(null)}
            className={`
              py-2 px-3 text-xs rounded-lg transition-all duration-200
              ${selectedColor === color.value 
                ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-md' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}
            `}
          >
            {color.name}
          </button>
        ))}
      </div>
      
      {hoveredColor && (
        <div className="mt-1 text-xs text-gray-500 p-2 bg-gray-50 rounded-md">
          {hoveredColor.description}
        </div>
      )}
    </div>
  );
};

export default ColorPicker; 