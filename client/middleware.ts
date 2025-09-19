import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a dashboard route
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');
  const isSuperAdminRoute = pathname.startsWith('/superadmin');

  if (isAdminRoute || isUserRoute || isSuperAdminRoute) {
    // Get the token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const userRole = token.role as string;

    if (isSuperAdminRoute && userRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isAdminRoute && !['admin', 'superadmin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isUserRoute && !['user', 'admin', 'superadmin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/superadmin/:path*'],
};