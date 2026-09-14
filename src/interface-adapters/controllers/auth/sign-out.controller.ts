import { UnauthenticatedError } from '@/src/entities/errors/auth';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

export type ISignOutController = ReturnType<typeof signOutController>;
// No presenter: signing out has nothing to return. No separate authentication call either:
// the back's DELETE /sessions/current rejects an invalid Sesión itself, surfacing UnauthenticatedError.
export const signOutController =
    (instrumentationService: IInstrumentationService, signOutUseCase: ISignOutUseCase) =>
    async (sessionId: string | undefined): Promise<void> =>
        instrumentationService.startSpan({ name: 'signOut Controller' }, async () => {
            if (!sessionId) throw new UnauthenticatedError('Must be logged in to sign out');
            await signOutUseCase(sessionId);
        });
