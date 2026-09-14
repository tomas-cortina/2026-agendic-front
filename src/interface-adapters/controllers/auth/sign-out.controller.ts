import { UnauthenticatedError } from '@/src/entities/errors/auth';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

export type ISignOutController = ReturnType<typeof signOutController>;
// No presenter: signing out has nothing to return.
export const signOutController =
    (
        instrumentationService: IInstrumentationService,
        authenticationService: IAuthenticationService,
        signOutUseCase: ISignOutUseCase,
    ) =>
    async (sessionId: string | undefined): Promise<void> =>
        instrumentationService.startSpan({ name: 'signOut Controller' }, async () => {
            if (!sessionId) throw new UnauthenticatedError('Must be logged in to sign out');
            const { session } = await authenticationService.validateSession(sessionId);
            await signOutUseCase(session.id);
        });
