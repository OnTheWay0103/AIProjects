import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  // 定义公开路由和认证路由
  const publicRoutes = ['/', '/explore', '/generate'];
  const authRoutes = ['/login', '/register'];
  const dashboardRoutes = ['/images', '/settings'];
  
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);
  const isDashboardRoute = dashboardRoutes.includes(path);
  
  console.log('Middleware check:', {
    path,
    hasToken: !!token,
    isAuthRoute,
    isDashboardRoute
  });

  // 如果是认证路由且已登录，重定向到首页
  if (isAuthRoute && token) {
    console.log('Redirecting authenticated user from auth page to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 如果是仪表板路由且未登录，重定向到登录页
  if (isDashboardRoute && !token) {
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