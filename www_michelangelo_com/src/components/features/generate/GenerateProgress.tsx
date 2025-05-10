import React from 'react';

interface GenerateProgressProps {
  progress: number; // 0-100
  isComplete: boolean;
  onCancel?: () => void;
}

const GenerateProgress: React.FC<GenerateProgressProps> = ({
  progress,
  isComplete,
  onCancel
}) => {
  // 根据进度计算颜色
  const getProgressColor = () => {
    if (isComplete) return 'bg-success';
    if (progress < 30) return 'bg-primary-light';
    if (progress < 70) return 'bg-primary';
    return 'bg-primary-dark';
  };

  // 获取进度显示文本
  const getProgressText = () => {
    if (isComplete) return '生成完成';
    if (progress === 0) return '准备中...';
    if (progress < 25) return '初始化模型...';
    if (progress < 50) return '分析提示词...';
    if (progress < 75) return '生成图像...';
    if (progress < 95) return '优化结果...';
    return '即将完成...';
  };

  return (
    <div className="w-full p-4 bg-surface rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {isComplete ? (
            <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 animate-spin text-primary mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span className="font-medium text-text-primary">{getProgressText()}</span>
        </div>
        
        {!isComplete && onCancel && (
          <button 
            onClick={onCancel}
            className="text-xs text-error hover:text-error-dark"
          >
            取消
          </button>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getProgressColor()}`} 
          style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
        ></div>
      </div>
      
      <div className="mt-2 text-xs text-text-tertiary text-right">
        {progress}%
      </div>
    </div>
  );
};

export default GenerateProgress; 