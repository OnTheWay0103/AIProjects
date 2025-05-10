import React, { useState } from 'react';
import { generateImage } from '@/lib/api/api';

interface GenerateFormProps {
  onImageGenerated?: (imageUrl: string) => void;
}

export default function GenerateForm({ onImageGenerated }: GenerateFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { image } = await generateImage(prompt);
      onImageGenerated?.(image.url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="generate-form" className="space-y-4">
      <div>
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