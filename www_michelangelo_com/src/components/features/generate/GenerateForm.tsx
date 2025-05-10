import React, { useState } from 'react';
import { generateImage } from '@/lib/api/api';
import Button from '@/components/ui/Button';
import ColorPicker from './ColorPicker';
import LightingSelector from './LightingSelector';
import CompositionSelector from './CompositionSelector';
import GeneratePreview from './GeneratePreview';

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

// 常用负面提示词
const NEGATIVE_PROMPTS = [
  "模糊, 畸变, 低质量",
  "过度曝光, 过度饱和",
  "扭曲的肢体, 额外的四肢",
  "不清晰的细节, 像素化",
  "不自然的姿势, 不协调的构图"
];

export default function GenerateForm({ onImageGenerated, onGenerateStart }: GenerateFormProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspect, setAspect] = useState('square');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quality, setQuality] = useState('standard');
  const [showExamples, setShowExamples] = useState(false);
  const [showNegativeExamples, setShowNegativeExamples] = useState(false);
  
  // 测试计数器
  const [testCounter, setTestCounter] = useState(0);
  
  // 新增的参数
  const [colorStyle, setColorStyle] = useState('auto');
  const [lighting, setLighting] = useState('natural');
  const [composition, setComposition] = useState('balanced');

  // 测试函数
  const testClick = () => {
    console.log("测试按钮被点击");
    setTestCounter(prev => prev + 1);
    alert("测试按钮被点击了！");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit被调用", e);
    e.preventDefault?.();
    
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError(null);
    onGenerateStart?.();

    try {
      // 传递所有参数给API
      const { image } = await generateImage(
        prompt, 
        style, 
        aspect, 
        negativePrompt,
        {
          colorStyle,
          lighting,
          composition,
          quality
        }
      );
      onImageGenerated?.(image.url, prompt, style);
      console.log("生成成功，参数:", {
        prompt, style, aspect, negativePrompt,
        colorStyle, lighting, composition, quality
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败';
      setError(errorMessage);
      console.error("生成失败:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const useExample = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };

  const useNegativeExample = (example: string) => {
    setNegativePrompt(example);
    setShowNegativeExamples(false);
  };

  const handleClear = () => {
    setPrompt('');
    setNegativePrompt('');
    setError(null);
  };

  const handleRandomGenerate = () => {
    const randomPrompts = [
      "星空下的古堡，月光照耀，神秘而宁静",
      "未来都市的霓虹街道，雨夜，赛博朋克风格",
      "热带海滩上的日落，椰树剪影，橙红色的天空",
      "雪山脚下的木屋，炊烟袅袅，宁静祥和",
      "水晶洞穴，蓝色的光芒，神秘而美丽",
      "春日樱花树下的小路，花瓣飘落，阳光透过树枝",
      "深海中的珊瑚礁，色彩斑斓的鱼群，蓝色的海水",
      "荒漠中的绿洲，椰枣树，金色的沙丘"
    ];
    
    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    setPrompt(randomPrompts[randomIndex]);
    
    const randomStyles = ["realistic", "anime", "oil", "digital", "watercolor", "sketch"];
    const randomStyleIndex = Math.floor(Math.random() * randomStyles.length);
    setStyle(randomStyles[randomStyleIndex]);
    
    const randomAspects = ["square", "portrait", "landscape", "widescreen"];
    const randomAspectIndex = Math.floor(Math.random() * randomAspects.length);
    setAspect(randomAspects[randomAspectIndex]);
  };

  return (
    <>
      {/* 移除测试按钮和测试组件，这些是调试用的 */}
      
      <form onSubmit={handleSubmit} data-testid="generate-form" className="space-y-6 bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="relative">
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            提示词
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
            rows={4}
            placeholder="描述您想要生成的图片..."
            aria-label="提示词"
          />
          
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="absolute right-2 top-8 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showExamples ? '隐藏示例' : '查看示例'}
          </button>
          
          {showExamples && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium mb-2 text-gray-700">提示词示例:</h3>
              <ul className="space-y-2">
                {PROMPT_EXAMPLES.map((example, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => useExample(example)}
                      className="text-sm text-left text-blue-600 hover:text-blue-800 hover:underline w-full transition-colors"
                    >
                      {example}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label
              htmlFor="style"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              图像风格
            </label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
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

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <label
              htmlFor="aspect"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              图像比例
            </label>
            <select
              id="aspect"
              value={aspect}
              onChange={(e) => setAspect(e.target.value)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
              aria-label="图像比例"
            >
              <option value="square">正方形 (1:1)</option>
              <option value="portrait">竖版 (2:3)</option>
              <option value="landscape">横版 (3:2)</option>
              <option value="widescreen">宽屏 (16:9)</option>
            </select>
          </div>
        </div>

        <div className="relative bg-gray-50 p-4 rounded-lg border border-gray-100">
          <label
            htmlFor="negativePrompt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            负面提示词 <span className="text-xs text-gray-500">(不希望出现在图像中的元素)</span>
          </label>
          <textarea
            id="negativePrompt"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
            rows={2}
            placeholder="例如：模糊, 畸变, 低质量..."
            aria-label="负面提示词"
          />
          
          <button
            type="button"
            onClick={() => setShowNegativeExamples(!showNegativeExamples)}
            className="absolute right-2 top-8 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showNegativeExamples ? '隐藏示例' : '查看示例'}
          </button>
          
          {showNegativeExamples && (
            <div className="mt-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium mb-2 text-gray-700">常用负面提示词:</h3>
              <ul className="space-y-2">
                {NEGATIVE_PROMPTS.map((example, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => useNegativeExample(example)}
                      className="text-sm text-left text-blue-600 hover:text-blue-800 hover:underline w-full transition-colors"
                    >
                      {example}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
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
            <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-100 space-y-6">
              <GeneratePreview 
                aspect={aspect}
                style={style}
                colorStyle={colorStyle}
                lighting={lighting}
                composition={composition}
              />
              
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <ColorPicker 
                    selectedColor={colorStyle}
                    onChange={setColorStyle}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <LightingSelector 
                    selectedLighting={lighting}
                    onChange={setLighting}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <CompositionSelector 
                    selectedComposition={composition}
                    onChange={setComposition}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <label
                    htmlFor="quality"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    图像质量
                  </label>
                  <select
                    id="quality"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
                  >
                    <option value="standard">标准</option>
                    <option value="high">高质量</option>
                    <option value="premium">超高质量</option>
                  </select>
                </div>
                
                <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                  <input
                    id="enhance"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label
                    htmlFor="enhance"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    自动优化生成结果
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1 border-gray-300 hover:bg-gray-50 transition-colors"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            清除
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={handleRandomGenerate}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            随机生成
          </Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isGenerating}
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium transition-colors"
        >
          {isGenerating ? '生成中...' : '生成图片'}
        </Button>
      </form>
    </>
  );
} 