import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { getInjection } from '@/di/container';
import { VerificationLinkExpiredError, VerificationLinkInvalidError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { setSessionCookie } from '../session-cookie';

// A Route Handler, not a page: Next forbids setting cookies while rendering a Server Component.
// The link carries everything it needs, so it opens on any device, not only the one that registered.
export async function GET(request: NextRequest) {
    let destination = '/turnos';
    try {
        const controller = getInjection('IVerifyEmailController');
        const session = await controller({ token: request.nextUrl.searchParams.get('token') ?? undefined });
        await setSessionCookie(session);
    } catch (error) {
        // The sign-up screen that reads this reason ships in a later ticket; for now it just renders as always.
        if (error instanceof VerificationLinkExpiredError) destination = '/sign-up?verification=expired';
        else if (error instanceof VerificationLinkInvalidError || error instanceof InputParseError)
            destination = '/sign-up?verification=invalid';
        // Nothing to tell the Usuario about an unexpected failure, so no reason goes in the URL.
        else {
            getInjection('ICrashReporterService').report(error);
            destination = '/sign-up';
        }
    }
    redirect(destination);
}
