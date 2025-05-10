import React from 'react';

interface LightingOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const LIGHTING_OPTIONS: LightingOption[] = [
  {
    id: 'natural',
    name: '自然光',
    description: '柔和的自然日光照明',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: 'soft',
    name: '柔光',
    description: '均匀柔和的光线，减少阴影',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
      </svg>
    )
  },
  {
    id: 'dramatic',
    name: '戏剧光',
    description: '强烈的对比和阴影效果',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
      </svg>
    )
  },
  {
    id: 'night',
    name: '夜晚',
    description: '夜间照明，月光或人工灯光',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    )
  },
  {
    id: 'backlit',
    name: '背光',
    description: '主体背光，形成轮廓光效果',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 00-3.6 1.2c1.2.8 2 2.4 2 4.8s-.8 4-2 4.8A6 6 0 1010 4z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    id: 'studio',
    name: '工作室',
    description: '专业工作室照明效果',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
    )
  }
];

interface LightingSelectorProps {
  selectedLighting: string;
  onChange: (lighting: string) => void;
}

const LightingSelector: React.FC<LightingSelectorProps> = ({
  selectedLighting,
  onChange
}) => {
  const handleSelectLighting = (lightingId: string) => {
    onChange(lightingId);
  };

  const getSelectedDescription = () => {
    const selected = LIGHTING_OPTIONS.find(option => option.id === selectedLighting);
    return selected?.description || '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-primary">
          光照效果
        </label>
        {selectedLighting && (
          <span className="text-xs text-text-tertiary">
            {getSelectedDescription()}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {LIGHTING_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelectLighting(option.id)}
            className={`
              flex flex-col items-center justify-center py-2 px-3 rounded-md transition-all
              ${selectedLighting === option.id 
                ? 'bg-primary text-white ring-2 ring-primary-light' 
                : 'bg-surface hover:bg-gray-100 text-text-secondary'}
            `}
          >
            <div className="mb-1">
              {option.icon}
            </div>
            <span className="text-xs">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LightingSelector; 