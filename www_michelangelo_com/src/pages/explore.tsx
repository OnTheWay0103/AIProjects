import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getPublicImages } from '@/lib/api/api';
import type { GeneratedImage } from '@/types/image/index';
import Toast from '@/components/ui/Toast';
import ImageList from '@/components/features/images/ImageList';

export default function Explore() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const { images } = await getPublicImages();
      setImages(images);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败';
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>探索 - Michelangelo</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="page-title">探索</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" role="progressbar" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-text-secondary">
            <p>暂无公开图片</p>
          </div>
        ) : (
          <ImageList
            images={images}
            showActions={false}
          />
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