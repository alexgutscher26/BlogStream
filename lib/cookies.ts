import { serialize } from 'cookie';

// Helper function to set a secure cookie
export function setSecureCookie(res: { status?: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; setHeader?: any; }, name: string, value: { id: string; name: string; }, options = {}) {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

  const cookie = serialize(name, stringValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    ...options,
  });

  res.setHeader('Set-Cookie', cookie);
}
