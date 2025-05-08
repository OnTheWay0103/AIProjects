import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getImage, deleteImage, shareImage, unshareImage } from '@/utils/api';
import type { GeneratedImage } from '@/types/image';
import Toast from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ImageDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
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

  useEffect(() => {
    if (id) {
      loadImage();
    }
  }, [id]);

  const loadImage = async () => {
    try {
      const { image } = await getImage(id as string);
      setImage(image);
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

  const handleDelete = () => {
    setDeleteDialog({
      isOpen: true,
      imageId: id as string,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.imageId) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteImage(deleteDialog.imageId);
      setToast({
        message: '删除成功',
        type: 'success',
      });
      router.push('/images');
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败，请稍后重试');
      setToast({
        message: '删除失败，请稍后重试',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!image) return;

    setIsSharing(true);
    setError(null);

    try {
      if (image.isPublic) {
        await unshareImage(image.id);
        setImage({ ...image, isPublic: false });
        setToast({
          message: '已取消分享',
          type: 'success',
        });
      } else {
        await shareImage(image.id);
        setImage({ ...image, isPublic: true });
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
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `image-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-error text-center">{error || '图片不存在'}</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>图片详情 - Mikey.app</title>
        <meta name="description" content={image.prompt} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <div className="relative aspect-square w-full">
              <Image
                src={image.imageUrl}
                alt={image.prompt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="card">
            <h1 className="text-2xl font-bold mb-4">图片详情</h1>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-text-secondary mb-2">
                  提示词
                </h2>
                <p className="text-text-primary">{image.prompt}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-text-secondary mb-2">
                  创建时间
                </h2>
                <p className="text-text-primary">
                  {new Date(image.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-text-secondary mb-2">
                  分享状态
                </h2>
                <p className="text-text-primary">
                  {image.isPublic ? '已分享' : '未分享'}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={`btn ${
                    image.isPublic ? 'btn-secondary' : 'btn-primary'
                  } flex-1`}
                >
                  {isSharing
                    ? '处理中...'
                    : image.isPublic
                    ? '取消分享'
                    : '分享'}
                </button>
                <button
                  onClick={handleDownload}
                  className="btn btn-secondary flex-1"
                >
                  下载
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn btn-error flex-1"
                >
                  {isDeleting ? '删除中...' : '删除'}
                </button>
              </div>
            </div>
          </div>
        </div>
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