import { setSecureCookie } from '@/lib/cookies';

export default function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
  // Simulate successful login and set a session cookie
  const userSession = { id: '123', name: 'John Doe' };

  // Set secure cookie
  setSecureCookie(res, 'session', userSession, { maxAge: 60 * 60 * 24 * 7 }); // 1 week

  res.status(200).json({ message: 'Logged in successfully' });
}
