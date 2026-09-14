import { UnauthenticatedError } from '@/src/entities/errors/auth';
import type { User } from '@/src/entities/models/user';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IGetCurrentUserUseCase } from '@/src/application/use-cases/auth/get-current-user.use-case';

function presenter(user: User, instrumentationService: IInstrumentationService) {
    return instrumentationService.startSpan({ name: 'getCurrentUser Presenter', op: 'serialize' }, () => ({
        name: user.name,
    }));
}

export type IGetCurrentUserController = ReturnType<typeof getCurrentUserController>;
export const getCurrentUserController =
    (
        instrumentationService: IInstrumentationService,
        authenticationService: IAuthenticationService,
        getCurrentUserUseCase: IGetCurrentUserUseCase,
    ) =>
    async (sessionId: string | undefined): Promise<ReturnType<typeof presenter>> =>
        instrumentationService.startSpan({ name: 'getCurrentUser Controller' }, async () => {
            if (!sessionId) throw new UnauthenticatedError('No session cookie present');
            const { session } = await authenticationService.validateSession(sessionId);
            const user = await getCurrentUserUseCase(session.userId);
            return presenter(user, instrumentationService);
        });
