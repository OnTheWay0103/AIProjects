import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { generateImage } from '@/utils/api';
import type { GeneratedImage } from '@/types/image';
import Toast from '@/components/ui/Toast';

export default function Generate() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const { image } = await generateImage(prompt);
      setGeneratedImage(image);
      setToast({
        message: '图片生成成功',
        type: 'success',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试');
      setToast({
        message: '生成失败，请稍后重试',
        type: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewImage = () => {
    if (generatedImage) {
      router.push(`/images/${generatedImage.id}`);
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>生成图片 - Mikey.app</title>
        <meta name="description" content="使用AI生成图片" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">生成图片</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">输入提示词</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  描述您想要生成的图片
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="input h-32 resize-none"
                  placeholder="例如：一只可爱的猫咪在阳光下玩耍"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="btn btn-primary w-full"
              >
                {isGenerating ? '生成中...' : '生成图片'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">预览</h2>
            {isGenerating ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-error text-center py-8">{error}</div>
            ) : generatedImage ? (
              <div>
                <div className="relative aspect-square w-full mb-4">
                  <Image
                    src={generatedImage.imageUrl}
                    alt={generatedImage.prompt}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                  {generatedImage.prompt}
                </p>
                <button
                  onClick={handleViewImage}
                  className="btn btn-primary w-full"
                >
                  查看详情
                </button>
              </div>
            ) : (
              <div className="text-center text-text-secondary py-12">
                <p className="text-lg mb-4">输入提示词开始生成图片</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ProtectedRoute>
  );
} 