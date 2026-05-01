import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Middleware can only read cookies, not localStorage
    // Ensure that your login page sets this cookie:
    // document.cookie = "admin_session=true; path=/";
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'true') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Also protect API routes under /api/admin
  if (pathname.startsWith('/api/admin')) {
    const session = request.cookies.get('admin_session');
    
    // For API routes, if we want to be strict, we check the cookie or a custom Authorization header
    // Since we are using standard fetch from the client for admin actions, the cookie is sent automatically.
    if (!session || session.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};
