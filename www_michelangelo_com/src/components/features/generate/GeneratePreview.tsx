import React from 'react';

interface GeneratePreviewProps {
  aspect: string;
  style: string;
  colorStyle: string;
  lighting: string;
  composition: string;
}

const GeneratePreview: React.FC<GeneratePreviewProps> = ({
  aspect,
  style,
  colorStyle,
  lighting,
  composition
}) => {
  // 根据不同的参数生成预览样式
  const getPreviewStyle = () => {
    const aspectRatio = {
      'square': '1/1',
      'portrait': '2/3',
      'landscape': '3/2',
      'widescreen': '16/9'
    }[aspect] || '1/1';
    
    // 不同风格的背景颜色
    const styleBackground = {
      'realistic': 'bg-gradient-to-br from-gray-100 to-gray-300',
      'anime': 'bg-gradient-to-br from-blue-100 to-purple-200',
      'oil': 'bg-gradient-to-br from-yellow-100 to-orange-200',
      'digital': 'bg-gradient-to-br from-blue-100 to-cyan-200',
      'watercolor': 'bg-gradient-to-br from-green-100 to-blue-200',
      'sketch': 'bg-gray-100'
    }[style] || 'bg-gray-200';
    
    // 色彩样式
    const colorStyleClass = {
      'auto': '',
      'bright': 'saturate-150',
      'soft': 'saturate-50',
      'monochrome': 'grayscale',
      'highContrast': 'contrast-150',
      'warm': 'sepia brightness-105',
      'cool': 'hue-rotate-180',
      'vintage': 'sepia brightness-90',
      'cinematic': 'contrast-125 brightness-75 saturate-125'
    }[colorStyle] || '';
    
    // 光照效果
    const lightingClass = {
      'natural': 'bg-gradient-to-b from-white/10 to-transparent',
      'soft': 'bg-white/20',
      'dramatic': 'bg-gradient-to-tr from-black/30 via-transparent to-white/20',
      'night': 'brightness-75 bg-gradient-radial from-white/5 to-transparent',
      'backlit': 'bg-gradient-to-t from-transparent via-white/30 to-transparent',
      'studio': 'bg-none'
    }[lighting] || '';
    
    // 构图效果
    const compositionClass = {
      'balanced': 'flex items-center justify-center',
      'rule-of-thirds': 'flex items-start justify-end p-4',
      'diagonal': 'flex items-end justify-start p-4',
      'frame': 'ring-8 ring-inset ring-black/10',
      'symmetry': 'bg-gradient-to-r from-black/5 via-transparent to-black/5',
      'leading-lines': 'bg-gradient-to-br from-black/10 to-transparent',
      'depth': 'bg-gradient-to-t from-black/20 to-transparent',
      'minimal': 'p-8',
      'golden-ratio': ''
    }[composition] || '';
    
    return {
      aspectRatio,
      className: `${styleBackground} ${colorStyleClass} ${lightingClass} ${compositionClass} rounded-lg overflow-hidden`
    };
  };
  
  const { aspectRatio, className } = getPreviewStyle();
  
  // 格式化提示信息
  const formatPreviewInfo = () => {
    const styleNames = {
      'realistic': '写实',
      'anime': '动漫',
      'oil': '油画',
      'digital': '数字艺术',
      'watercolor': '水彩',
      'sketch': '素描'
    };
    
    const aspectNames = {
      'square': '正方形 (1:1)',
      'portrait': '竖版 (2:3)',
      'landscape': '横版 (3:2)',
      'widescreen': '宽屏 (16:9)'
    };
    
    return `${styleNames[style as keyof typeof styleNames] || style} · ${aspectNames[aspect as keyof typeof aspectNames] || aspect}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">
          预览效果
        </h3>
        <span className="text-xs text-gray-500">
          {formatPreviewInfo()}
        </span>
      </div>
      
      <div 
        className={`${className} overflow-hidden transition-all duration-300`}
        style={{ 
          aspectRatio,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-50"></div>
          <div className="w-16 h-16 backdrop-blur-sm bg-white/20 rounded-full flex items-center justify-center z-10 ring-4 ring-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        此预览仅作参考，实际生成效果将基于您的提示词
      </p>
    </div>
  );
};

export default GeneratePreview; 