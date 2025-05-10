import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/features/auth/ProtectedRoute';
import { getImages, deleteImage } from '@/lib/api/api';
import type { GeneratedImage } from '@/types/image/index';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageList from '@/components/features/images/ImageList';

export default function Images() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
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
    imageId: null
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const { images } = await getImages();
      setImages(images);
      setError(null);
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

  const handleDelete = async (imageId: string) => {
    setDeleteDialog({
      isOpen: true,
      imageId
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.imageId) return;

    try {
      setIsDeleting(deleteDialog.imageId);
      await deleteImage(deleteDialog.imageId);
      setImages(images.filter(img => img.id !== deleteDialog.imageId));
      setToast({
        message: '删除成功',
        type: 'success'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除失败';
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsDeleting(null);
      setDeleteDialog({
        isOpen: false,
        imageId: null
      });
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>我的图片 - Michelangelo</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="page-title">我的图片</h1>
          <Link
            href="/generate"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            生成新图片
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" role="progressbar" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-text-secondary">
            <p>暂无图片</p>
            <Link
              href="/generate"
              className="inline-block mt-4 text-primary hover:text-primary-dark"
            >
              立即生成
            </Link>
          </div>
        ) : (
          <ImageList
            images={images}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            showActions={true}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, imageId: null })}
        onConfirm={confirmDelete}
        title="确认删除"
        message="确定要删除这张图片吗？此操作无法撤销。"
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