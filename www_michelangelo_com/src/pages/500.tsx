import { useRouter } from 'next/router';

export default function Custom500() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-error mb-4">500 - 服务器错误</h1>
        <p className="text-text-secondary mb-4">
          抱歉，服务器出现了问题
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