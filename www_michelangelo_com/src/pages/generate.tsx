import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/hooks/auth/useAuth';
import GenerateForm from '@/components/features/generate/GenerateForm';

export default function Generate() {
  const { user } = useAuth();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

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

          <GenerateForm onImageGenerated={setGeneratedImage} />

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