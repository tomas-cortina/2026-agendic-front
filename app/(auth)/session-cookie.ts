import { cookies } from 'next/headers';

export async function setSessionCookie({ sessionId, expiresAt }: { sessionId: string; expiresAt: Date }) {
    (await cookies()).set('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
    });
}
