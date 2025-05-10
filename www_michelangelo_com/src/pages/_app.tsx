import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/store/contexts/AuthContext';
import Layout from '@/components/layouts/Layout';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp; 