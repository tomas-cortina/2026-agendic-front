import { UnauthenticatedError } from '@/src/entities/errors/auth';
import type { User } from '@/src/entities/models/user';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

function presenter(user: User, instrumentationService: IInstrumentationService) {
    return instrumentationService.startSpan({ name: 'getCurrentUser Presenter', op: 'serialize' }, () => ({
        name: user.name,
    }));
}

export type IGetCurrentUserController = ReturnType<typeof getCurrentUserController>;
// No use case: the back's GET /users/me is both the authentication and the lookup.
export const getCurrentUserController =
    (instrumentationService: IInstrumentationService, authenticationService: IAuthenticationService) =>
    async (sessionId: string | undefined): Promise<ReturnType<typeof presenter>> =>
        instrumentationService.startSpan({ name: 'getCurrentUser Controller' }, async () => {
            if (!sessionId) throw new UnauthenticatedError('No session cookie present');
            return presenter(await authenticationService.getCurrentUser(sessionId), instrumentationService);
        });
