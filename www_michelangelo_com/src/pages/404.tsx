import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-error mb-4">404 - 页面未找到</h1>
        <p className="text-text-secondary mb-4">
          抱歉，您访问的页面不存在
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn btn-primary w-full"
        >
          返回首页
        </button>
      </div>
    </div>
  );
} 