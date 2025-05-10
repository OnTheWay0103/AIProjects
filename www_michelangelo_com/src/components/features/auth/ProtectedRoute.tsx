import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          role="status"
          className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"
          aria-label="加载中"
        ></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
} 