import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';

interface Image {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  isPublic: boolean;
}

export default function ImagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error('获取图片失败');
        }
        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取图片失败');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchImages();
    }
  }, [session]);

  const handleDelete = async (imageId: string) => {
    if (!confirm('确定要删除这张图片吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除图片失败');
      }

      setImages(images.filter(image => image.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除图片失败');
    }
  };

  const handleShare = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublic: true,
        }),
      });

      if (!response.ok) {
        throw new Error('分享图片失败');
      }

      setImages(images.map(image => 
        image.id === imageId 
          ? { ...image, isPublic: true }
          : image
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '分享图片失败');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">我的图片</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">还没有生成过图片</p>
            <button
              onClick={() => router.push('/generate')}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              去生成图片
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-2">{image.prompt}</p>
                  <p className="text-sm text-gray-400 mb-4">
                    {new Date(image.createdAt).toLocaleString()}
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      删除
                    </button>
                    {!image.isPublic && (
                      <button
                        onClick={() => handleShare(image.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        分享
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 