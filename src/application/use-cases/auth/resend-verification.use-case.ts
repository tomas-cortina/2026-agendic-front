import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type IResendVerificationUseCase = ReturnType<typeof resendVerificationUseCase>;
export const resendVerificationUseCase =
    (instrumentationService: IInstrumentationService, authenticationService: IAuthenticationService) =>
    (input: { email: string }): Promise<void> =>
        instrumentationService.startSpan({ name: 'resendVerification Use Case', op: 'function' }, () =>
            authenticationService.resendVerification(input.email),
        );
