import React, { useState } from 'react';
import { generateImage } from '@/lib/api/api';

interface GenerateFormProps {
  onImageGenerated?: (imageUrl: string, prompt: string, style: string) => void;
  onGenerateStart?: () => void;
}

// 提示词示例
const PROMPT_EXAMPLES = [
  "一只可爱的橘猫在阳光下打盹，背景是绿色的草地，风格写实",
  "未来城市的科幻景观，高耸的建筑和飞行的汽车，夜景",
  "水彩风格的山水画，雾气缭绕的群山，有小木屋和流水",
  "日系动漫风格的女孩，站在樱花树下微笑",
  "星空下的古老城堡，月光照耀，神秘而宁静"
];

export default function GenerateForm({ onImageGenerated, onGenerateStart }: GenerateFormProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspect, setAspect] = useState('square');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quality, setQuality] = useState('standard');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError(null);
    onGenerateStart?.();

    try {
      const { image } = await generateImage(prompt, style, aspect);
      onImageGenerated?.(image.url, prompt, style);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const useExample = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="generate-form" className="space-y-4">
      <div className="relative">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-text-primary"
        >
          提示词
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          rows={4}
          placeholder="描述您想要生成的图片..."
          aria-label="提示词"
        />
        
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="absolute right-2 top-8 text-xs text-primary hover:text-primary-dark"
        >
          {showExamples ? '隐藏示例' : '查看示例'}
        </button>
        
        {showExamples && (
          <div className="mt-2 p-3 bg-surface rounded-md shadow-sm">
            <h3 className="text-sm font-medium mb-2">提示词示例:</h3>
            <ul className="space-y-2">
              {PROMPT_EXAMPLES.map((example, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => useExample(example)}
                    className="text-sm text-left text-primary hover:text-primary-dark hover:underline w-full"
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="style"
            className="block text-sm font-medium text-text-primary"
          >
            图像风格
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            aria-label="图像风格"
          >
            <option value="realistic">写实</option>
            <option value="anime">动漫</option>
            <option value="oil">油画</option>
            <option value="digital">数字艺术</option>
            <option value="watercolor">水彩</option>
            <option value="sketch">素描</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="aspect"
            className="block text-sm font-medium text-text-primary"
          >
            图像比例
          </label>
          <select
            id="aspect"
            value={aspect}
            onChange={(e) => setAspect(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            aria-label="图像比例"
          >
            <option value="square">正方形 (1:1)</option>
            <option value="portrait">竖版 (2:3)</option>
            <option value="landscape">横版 (3:2)</option>
            <option value="widescreen">宽屏 (16:9)</option>
          </select>
        </div>
      </div>
      
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary hover:text-primary-dark flex items-center"
        >
          {showAdvanced ? '隐藏高级设置' : '显示高级设置'}
          <svg 
            className={`ml-1 h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showAdvanced && (
          <div className="mt-3 p-3 bg-surface rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quality"
                  className="block text-sm font-medium text-text-primary"
                >
                  图像质量
                </label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="standard">标准</option>
                  <option value="high">高质量</option>
                  <option value="premium">超高质量</option>
                </select>
              </div>
              
              <div className="flex items-center pt-6">
                <input
                  id="enhance"
                  type="checkbox"
                  className="h-4 w-4 text-primary rounded"
                />
                <label
                  htmlFor="enhance"
                  className="ml-2 block text-sm text-text-primary"
                >
                  自动优化生成结果
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-error text-sm" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
      >
        {isGenerating ? '生成中...' : '生成图片'}
      </button>
    </form>
  );
} 