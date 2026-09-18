import type { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type IVerifyEmailUseCase = ReturnType<typeof verifyEmailUseCase>;
export const verifyEmailUseCase =
    (instrumentationService: IInstrumentationService, authenticationService: IAuthenticationService) =>
    (input: { email: string; code: string }): Promise<Session> =>
        instrumentationService.startSpan({ name: 'verifyEmail Use Case', op: 'function' }, () =>
            authenticationService.verifyEmail(input.email, input.code),
        );
