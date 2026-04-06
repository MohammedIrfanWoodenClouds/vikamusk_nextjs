import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'vikamusk-admin-secret-key-change-this';
const TOKEN_EXPIRY = '24h';

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  };
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function generateToken(payload: { username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): { username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { username: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Also check cookies
  const cookieToken = req.cookies.get('admin_token')?.value;
  return cookieToken || null;
}

export function isAuthenticated(req: NextRequest): boolean {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded !== null;
}

export function requireAuth(req: NextRequest): { authenticated: boolean; error?: Response } {
  if (!isAuthenticated(req)) {
    return {
      authenticated: false,
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
  return { authenticated: true };
}
