import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getPublicImages } from '@/utils/api';
import type { GeneratedImage } from '@/types/image';
import Toast from '@/components/ui/Toast';

export default function Explore() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const loadImages = async () => {
    try {
      const { images } = await getPublicImages();
      setImages(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败，请稍后重试');
      setToast({
        message: '加载失败，请稍后重试',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <>
      <Head>
        <title>探索 - Mikey.app</title>
        <meta name="description" content="探索其他用户分享的图片" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">探索</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-error text-center">{error}</div>
        ) : images.length === 0 ? (
          <div className="text-center text-text-secondary py-12">
            <p className="text-lg">暂无公开图片</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="card">
                <div className="relative aspect-square w-full mb-4">
                  <Image
                    src={image.imageUrl}
                    alt={image.prompt}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {image.prompt}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-text-secondary">
                    {new Date(image.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
} 