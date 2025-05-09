import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getImages, deleteImage, shareImage, unshareImage } from '@/utils/api';
import type { GeneratedImage } from '@/types/image';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function Images() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    imageId: string | null;
  }>({
    isOpen: false,
    imageId: null,
  });

  const loadImages = async () => {
    try {
      const { images } = await getImages();
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

  const handleDelete = async (id: string) => {
    setDeleteDialog({
      isOpen: true,
      imageId: id,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.imageId) return;

    setIsDeleting(deleteDialog.imageId);
    setError(null);

    try {
      await deleteImage(deleteDialog.imageId);
      setImages((prevImages) => prevImages.filter((image) => image.id !== deleteDialog.imageId));
      setToast({
        message: '删除成功',
        type: 'success',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败，请稍后重试');
      setToast({
        message: '删除失败，请稍后重试',
        type: 'error',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleShare = async (id: string, isPublic: boolean) => {
    setIsSharing(id);
    setError(null);

    try {
      if (isPublic) {
        await unshareImage(id);
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.id === id ? { ...image, isPublic: false } : image
          )
        );
        setToast({
          message: '已取消分享',
          type: 'success',
        });
      } else {
        await shareImage(id);
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.id === id ? { ...image, isPublic: true } : image
          )
        );
        setToast({
          message: '分享成功',
          type: 'success',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请稍后重试');
      setToast({
        message: '操作失败，请稍后重试',
        type: 'error',
      });
    } finally {
      setIsSharing(null);
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>我的图片 - Mikey.app</title>
        <meta name="description" content="查看您生成的所有图片" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">我的图片</h1>
          <Link href="/generate" className="btn btn-primary">
            生成新图片
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-error text-center">{error}</div>
        ) : images.length === 0 ? (
          <div className="text-center text-text-secondary py-12">
            <p className="text-lg mb-4">您还没有生成任何图片</p>
            <Link href="/generate" className="btn btn-primary">
              开始生成
            </Link>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare(image.id, image.isPublic)}
                      disabled={isSharing === image.id}
                      className={`text-sm ${
                        image.isPublic
                          ? 'text-primary hover:text-opacity-80'
                          : 'text-text-secondary hover:text-primary'
                      }`}
                    >
                      {isSharing === image.id
                        ? '处理中...'
                        : image.isPublic
                        ? '取消分享'
                        : '分享'}
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      disabled={isDeleting === image.id}
                      className="text-error hover:text-opacity-80 text-sm"
                    >
                      {isDeleting === image.id ? '删除中...' : '删除'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, imageId: null })}
        onConfirm={confirmDelete}
        title="删除图片"
        message="确定要删除这张图片吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
      />

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