import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (email === adminEmail && bcrypt.compareSync(password, adminPasswordHash)) {
      const response = NextResponse.json({ success: true });
      
      // Set cookie for middleware
      response.cookies.set('admin_session', 'true', {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: false, // Set to false if you need to read it via client-side code, but true is safer. 
                         // Our middleware can read it regardless.
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
