import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Admin routes: proteksi dengan cookie admin_session
  const isAdminProtected =
    pathname.startsWith('/admin/dashboard') ||
    pathname.startsWith('/admin/orders') ||
    pathname.startsWith('/admin/templates');

  if (isAdminProtected) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protected routes: /dashboard and /builder
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/builder');

  // Auth routes: redirect if already logged in
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|i/|api/).*)',
  ],
};
