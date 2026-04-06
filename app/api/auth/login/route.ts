import { NextRequest, NextResponse } from 'next/server';
import { getAdminCredentials, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const creds = getAdminCredentials();

    if (username === creds.username && password === creds.password) {
      const token = generateToken({ username });
      
      const response = NextResponse.json({ 
        success: true, 
        token,
        user: { username } 
      });
      
      // Set HTTP-only cookie as well
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
