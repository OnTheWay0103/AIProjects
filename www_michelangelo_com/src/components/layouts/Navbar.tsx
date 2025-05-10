import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-background-secondary border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Mikey.app
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/explore"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/explore')
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                探索
              </Link>
              {user && (
                <>
                  <Link
                    href="/generate"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/generate')
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    生成
                  </Link>
                  <Link
                    href="/images"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/images')
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    我的图片
                  </Link>
                  <Link
                    href="/settings"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/settings')
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    设置
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                退出
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/login')
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/register')
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 