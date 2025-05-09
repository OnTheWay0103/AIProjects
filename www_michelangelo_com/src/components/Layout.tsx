import { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Michelangelo
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link
                    href="/generate"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    生成图片
                  </Link>
                  <Link
                    href="/images"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    我的图片
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    退出
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
} 