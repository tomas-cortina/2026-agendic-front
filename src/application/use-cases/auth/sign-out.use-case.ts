import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignOutUseCase = ReturnType<typeof signOutUseCase>;
export const signOutUseCase =
    (instrumentationService: IInstrumentationService, authenticationService: IAuthenticationService) =>
    (sessionId: string): Promise<void> =>
        instrumentationService.startSpan({ name: 'signOut Use Case', op: 'function' }, () =>
            authenticationService.invalidateSession(sessionId),
        );
