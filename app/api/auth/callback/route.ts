import { createServerSupabaseClient } from '@/lib/supabase.server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  // Supabase kadang mengirim `next` atau `redirect` sebagai param
  const next = requestUrl.searchParams.get('next') || 
               requestUrl.searchParams.get('redirect') || 
               '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin));
    }
  }

  // Pastikan redirect ke path relatif saja (keamanan)
  const redirectPath = next.startsWith('/') ? next : '/dashboard';
  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
