import React from 'react';

interface CompositionOption {
  id: string;
  name: string;
  description: string;
  preview: string; // CSS类用于显示预览
}

const COMPOSITION_OPTIONS: CompositionOption[] = [
  {
    id: 'balanced',
    name: '平衡构图',
    description: '主体居中，画面均衡稳定',
    preview: 'bg-center'
  },
  {
    id: 'rule-of-thirds',
    name: '三分法',
    description: '根据三分法则进行排列，增加画面张力',
    preview: 'bg-right-top'
  },
  {
    id: 'diagonal',
    name: '对角线',
    description: '沿对角线排列元素，产生动感',
    preview: 'bg-left-bottom'
  },
  {
    id: 'frame',
    name: '框架构图',
    description: '使用前景元素作为框架来强调主体',
    preview: 'ring-4 ring-inset ring-gray-700/20'
  },
  {
    id: 'symmetry',
    name: '对称构图',
    description: '左右或上下对称，给人和谐感',
    preview: 'bg-gradient-to-r from-gray-200 via-transparent to-gray-200'
  },
  {
    id: 'leading-lines',
    name: '引导线',
    description: '使用线条引导视线到主体',
    preview: 'bg-gradient-to-br from-gray-200 to-transparent'
  },
  {
    id: 'depth',
    name: '纵深感',
    description: '创造前中后三个层次的空间感',
    preview: 'bg-gradient-to-t from-gray-300 to-transparent'
  },
  {
    id: 'minimal',
    name: '极简构图',
    description: '减少元素，留白，突出主体',
    preview: 'flex items-center justify-center'
  },
  {
    id: 'golden-ratio',
    name: '黄金比例',
    description: '使用黄金比例进行构图，自然和谐',
    preview: 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'
  },
];

interface CompositionSelectorProps {
  selectedComposition: string;
  onChange: (composition: string) => void;
}

const CompositionSelector: React.FC<CompositionSelectorProps> = ({
  selectedComposition,
  onChange
}) => {
  const handleSelectComposition = (compositionId: string) => {
    onChange(compositionId);
  };

  const getSelectedDescription = () => {
    const selected = COMPOSITION_OPTIONS.find(option => option.id === selectedComposition);
    return selected?.description || '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-primary">
          构图方式
        </label>
        {selectedComposition && (
          <span className="text-xs text-text-tertiary">
            {getSelectedDescription()}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {COMPOSITION_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelectComposition(option.id)}
            className={`
              p-1 rounded-md border transition-all overflow-hidden
              ${selectedComposition === option.id 
                ? 'border-primary ring-2 ring-primary-light' 
                : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <div className="flex flex-col items-center">
              <div 
                className={`
                  w-full h-12 mb-1 rounded bg-gray-100 overflow-hidden
                  ${option.preview}
                `}
              >
                {option.id === 'minimal' && (
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
              </div>
              <span className="text-xs py-1">
                {option.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompositionSelector; 