'use server';

import { redirect } from 'next/navigation';
import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { deleteSessionCookie, getSessionId } from './session-cookie';

// An already-invalid Sesión still clears the cookie and redirects: to the Usuario the outcome is the same.
export async function signOut() {
    try {
        const controller = getInjection('ISignOutController');
        await controller(await getSessionId());
    } catch (error) {
        if (!(error instanceof UnauthenticatedError)) {
            getInjection('ICrashReporterService').report(error);
        }
    }
    await deleteSessionCookie();
    redirect('/');
}
