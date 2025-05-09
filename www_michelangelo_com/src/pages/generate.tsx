import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { generateImage } from '@/utils/api';

export default function Generate() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateImage(prompt.trim());
      setGeneratedImage(response.image.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>生成图片 - Mikey.app</title>
        <meta name="description" content="使用 AI 生成精美图片" />
      </Head>

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary">
              使用 AI 生成图片
            </h1>
            <p className="mt-2 text-text-secondary">
              输入提示词，让 AI 为您创作精美的图片
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-text-primary">
                提示词
              </label>
              <div className="mt-1">
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  placeholder="描述您想要生成的图片，例如：一只可爱的猫咪在阳光下玩耍"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isGenerating ? '生成中...' : '生成图片'}
              </button>
            </div>
          </form>

          {generatedImage && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-text-primary mb-4">生成结果</h2>
              <div className="relative aspect-square w-full max-w-lg mx-auto">
                <img
                  src={generatedImage}
                  alt="生成的图片"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 