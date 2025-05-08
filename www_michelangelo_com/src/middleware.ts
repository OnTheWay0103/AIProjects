import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  
  console.log('Middleware check:', {
    path: request.nextUrl.pathname,
    hasToken: !!token,
    isAuthPage
  });

  // 如果是认证页面且已登录，重定向到首页
  if (isAuthPage && token) {
    console.log('Redirecting authenticated user from auth page to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 如果不是认证页面且未登录，重定向到登录页
  if (!isAuthPage && !token) {
    console.log('Redirecting unauthenticated user to login page');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Middleware passed, proceeding with request');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 