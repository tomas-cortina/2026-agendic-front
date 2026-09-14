import type { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignInUseCase = ReturnType<typeof signInUseCase>;
export const signInUseCase =
    (instrumentationService: IInstrumentationService, authenticationService: IAuthenticationService) =>
    (input: { email: string; password: string }): Promise<Session> =>
        instrumentationService.startSpan({ name: 'signIn Use Case', op: 'function' }, () =>
            authenticationService.signIn(input),
        );
