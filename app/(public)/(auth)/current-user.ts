import { getInjection } from '@/di/container';
import type { DI_RETURN_TYPES } from '@/di/types';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { deleteSessionCookie, getSessionId } from './session-cookie';

export type CurrentUser = Awaited<ReturnType<DI_RETURN_TYPES['IGetCurrentUserController']>>;

export async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
        const controller = getInjection('IGetCurrentUserController');
        return await controller(await getSessionId());
    } catch (error) {
        if (error instanceof UnauthenticatedError) {
            await deleteSessionCookie();
            return null;
        }
        getInjection('ICrashReporterService').report(error);
        return null;
    }
}
