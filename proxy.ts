import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No page requires a Sesión yet (docs/adr/0001-in-memory-auth-custom-sessions.md); add routes here once one does.
const protectedRoutes: string[] = [];
const authRoutes = ['/sign-in', '/sign-up'];

// Optimistic check: only the cookie's presence, no session validation (recommended for Proxy, see Next.js authentication guide).
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = request.cookies.has('session');

    if (!hasSession && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (hasSession && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
